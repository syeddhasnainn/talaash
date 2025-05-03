import { NextRequest, NextResponse } from 'next/server';
import { smoothStream, streamText } from 'ai';
import { getProviderByModelName } from '@/lib/models';
import { LLMProvider } from '@/lib/types';
import { addMessage } from '@/actions/messageActions';

export async function POST(req: NextRequest) {
  try {
    const { messages, id, model: modelName } = await req.json();
    const model = getProviderByModelName(modelName as LLMProvider);
    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 400 });
    }
    addMessage('0oTdkN4LWVxJSRjsqKW', id, 'user', messages[messages.length - 1].content);
    console.log('user message added');
    const results = streamText({
      model,
      messages,
      onFinish: (message) => {
        addMessage('0oTdkN4LWVxJSRjsqKW', id, 'assistant', message.text);
        console.log('assistant message added');
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
