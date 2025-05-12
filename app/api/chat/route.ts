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

const generateChatTitle = async (question: string): Promise<string | undefined> => {
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

  return completion.choices[0].message.content ?? "Untitled Chat"
}

export async function POST(req: NextRequest) {
  try {
    const { messages, id, model: modelName } = await req.json();
    const { userId } = await auth()

    const provider = getProviderByModelName(modelName);
    if (!provider) return NextResponse.json({ error: "Provider not found" }, { status: 400 })

    const { instance, config } = provider

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const chat = await getChatById(id);

    let chatTitle: string | undefined = ""
    if (chat.length === 0) {
      chatTitle = await generateChatTitle(messages[messages.length - 1].content);
      if (!chatTitle) return NextResponse.json({error: "Failed to generate title"})
      const result = await addChat(id, userId, chatTitle);
      if (!result.success) {
        console.log('Failed to add chat:', result.error);
        return NextResponse.json({ error: 'Failed to add chat' }, { status: 500 });
      }
    }

    await addMessage(userId!, id, 'user', messages[messages.length - 1].content);
    const results = streamText({
      model:instance,
      messages,
      maxRetries: 2,
      maxTokens: config.maxTokens,
      onFinish: async (message) => {
        await addMessage(userId!, id, 'assistant', message.text);
      },
      experimental_transform: smoothStream({
        delayInMs: 10,
        chunking: 'line',
      }),
    });

    return results.toDataStreamResponse();
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
