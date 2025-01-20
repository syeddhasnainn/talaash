import { NextResponse, NextRequest } from "next/server";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_AI_API_KEY,
});

export async function POST(req: NextRequest) {
  var systemprompt =
    "You are an expert at programming and breaking down complex computer science/software engineering problems into easy to understand steps. You are also an expert at explaining concepts in a way that is easy to understand. You are also an expert at providing code examples and best practices, you always write up to date code. You always explain concepts in a detailed and concise manner.";

  try {
    var { conversation } = await req.json();
    conversation.unshift({ role: "system", content: systemprompt });
    const stream = await together.chat.completions.create({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      messages: conversation,
      stream: true,
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
