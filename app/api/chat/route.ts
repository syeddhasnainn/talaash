import { NextRequest, NextResponse } from 'next/server';
import { smoothStream, streamText } from 'ai';
import { getProviderByModelName } from '@/lib/models';
import { LLMProvider } from '@/lib/types';
import { addMessage } from '@/actions/messageActions';
import { addChat, getChatById } from '@/actions/chatActions';
import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server'

const client = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: 'https://api.cerebras.ai/v1',
});

const SYSTEM_PROMPT = `
    - you will generate a short title based on the first message a user begins a conversation with, the name should be descriptive and concise
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons
`;

const generateChatTitle = async(question: string) => {
  const completion = await client.chat.completions.create({
        model: 'llama-3.3-70b',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        max_completion_tokens: 15,
      });
  
      return completion.choices[0].message.content
}
export async function POST(req: NextRequest) {
  try {
    const { messages, id, model: modelName } = await req.json();
    const { userId } = await auth()

    const model = getProviderByModelName(modelName as LLMProvider);
    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 400 });
    }

    const chat = await getChatById(id);
    if (chat.length === 0) {
      try {
        const title = await generateChatTitle(messages[messages.length - 1].content);
        await addChat(id, userId!, title!);
      }
      catch (error) {
        console.log('error getting title', error);
      }
    }
    await addMessage(userId!, id, 'user', messages[messages.length - 1].content);
    const results = streamText({
      model,
      messages,
      onFinish: async(message) => {
        await addMessage(userId!, id, 'assistant', message.text);
      },
      experimental_transform: smoothStream({
        delayInMs: 10,
        chunking: 'word',
      }),
    });
    return results.toDataStreamResponse();
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
