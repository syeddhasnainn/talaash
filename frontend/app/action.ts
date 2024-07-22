'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { systemPrompt } from '@/utils/prompts';

export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    system: systemPrompt
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}