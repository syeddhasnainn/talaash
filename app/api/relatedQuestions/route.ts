import { NextResponse } from "next/server";
import Together from "together-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

const itemSchema = z.object({
  relatedQuestions: z.array(z.string()).length(3),
});
const jsonSchema = zodToJsonSchema(itemSchema, "schema");

export async function POST(request: Request) {
  const { question } = await request.json();
  const prompt = `generate 3-4 related question to the text below as json. json only. nothing else: \n ${question}`;
  const answer = await together.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "mistralai/Mistral-7B-Instruct-v0.1",
    max_tokens: 200,
    response_format: {
      type: "json_object",
      schema: jsonSchema as Record<string, string>,
    },
  });

  if (!answer || !answer.choices) {
    throw new Error("Failed to get related questions");
  }

  const content = answer.choices[0].message?.content;

  const output = JSON.parse(content as string);

  return NextResponse.json({ output });
}
