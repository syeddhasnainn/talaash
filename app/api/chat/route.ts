import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// const client = new OpenAI({
//   apiKey: process.env.CEREBRAS_API_KEY,
//   baseURL: "https://api.cerebras.ai/v1",
// });

export async function POST(req: NextRequest) {
  const models = {
    llama3: {
      model_name: "llama3.3-70b",
      apikey: process.env.CEREBRAS_API_KEY,
      baseURL: "https://api.cerebras.ai/v1",
    },
    deepseek3: {
      model_name: "deepseek-ai/DeepSeek-V3",
      apikey: process.env.TOGETHER_AI_API_KEY,
      baseURL: "https://api.together.xyz/v1",
    },
    deepseekr1: {
      model_name: "deepseek-ai/DeepSeek-R1",
      apikey: process.env.TOGETHER_AI_API_KEY,
      baseURL: "https://api.together.xyz/v1",
    },
    qwen72: {
      model_name: "Qwen/Qwen2.5-72B-Instruct-Turbo",
      apikey: process.env.TOGETHER_AI_API_KEY,
      baseURL: "https://api.together.xyz/v1",
    },
    qwen32: {
      model_name: "Qwen/Qwen2.5-Coder-32B-Instruct",
      apikey: process.env.TOGETHER_AI_API_KEY,
      baseURL: "https://api.together.xyz/v1",
    },
  };

  type ModelKeys = keyof typeof models;

  try {
    var { model, conversation, systemPrompt } = await req.json();
    const modelKey: ModelKeys = model as ModelKeys;
    const { model_name, apikey, baseURL } = models[modelKey];
    conversation.unshift({ role: "system", content: systemPrompt });
    const client = new OpenAI({
      apiKey: apikey,
      baseURL: baseURL,
    });

    const stream = await client.chat.completions.create({
      model: model_name,
      messages: conversation,
      stream: true,
      max_completion_tokens: 32768,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(content);
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Encoding": "none",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
