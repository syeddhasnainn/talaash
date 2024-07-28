import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { abort } from "process";
import { systemPrompt } from "@/utils/prompts";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages,
    abortSignal: req.signal,
    system: systemPrompt,
  });

  return result.toAIStreamResponse();
}
