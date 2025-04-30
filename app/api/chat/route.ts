import { NextRequest, NextResponse } from 'next/server';
import { smoothStream, streamText } from 'ai';
import { getProviderByModelName } from '@/lib/models';
import { LLMProvider } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { messages, model: modelName } = await req.json();
    console.log('from api', modelName);
    const model = getProviderByModelName(modelName as LLMProvider);
    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 400 });
    }
    console.log('model', model);
    const results = streamText({
      model,
      messages,
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
