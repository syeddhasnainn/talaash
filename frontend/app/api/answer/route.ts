import { NextResponse } from "next/server";
import Together from "together-ai";
import OpenAI from "openai";
import { systemPrompt } from "@/utils/prompts";

export const dynamic = "force-dynamic";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const encoder = new TextEncoder();

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function* makeIterator(messages: any) {
  
  const sp = [{ role: "system", content: systemPrompt }];
  const newArray = sp.concat(messages);
  
  // const answer = await together.chat.completions.create({
  //   messages: newArray as any,
  //   model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
  //   // model: "codellama/CodeLlama-70b-Instruct-hf",
  //   // model: "mistralai/Mixtral-8x22B-Instruct-v0.1",


  //   stream: true,
  // });

  const answer = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: newArray as any,
    stream: true,
  });

  for await (const chunk of answer) {
    const content = chunk.choices[0].delta?.content;
    if (content) {
      yield encoder.encode(content);
    }
  }

}

export async function POST(request: Request) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  var { messages } = await request.json();

  const iterator = makeIterator(messages);
  const streamer = iteratorToStream(iterator);

  return new NextResponse(streamer, {
    headers: {
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
    },
  });
}
