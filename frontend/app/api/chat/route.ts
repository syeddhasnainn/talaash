import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: "Always mention that 'this is a test' in the beginning of the response. each time. ",
    messages,
  });

  return result.toAIStreamResponse();
}