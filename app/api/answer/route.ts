import { NextResponse } from "next/server";
import Together from "together-ai";



export const dynamic = "force-dynamic";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
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

async function* makeIterator(prompt: string) {
  const answer = await together.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "mistralai/Mistral-7B-Instruct-v0.3",
    max_tokens: 100,
    stream: true,
  });

  for await (const chunk of answer) {
    yield encoder.encode(`${chunk.choices[0].delta?.content}`);
    await sleep(50);
  }
}

export async function POST(request: Request) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  var { question, sources, isWebAccess } = await request.json();
  var context = ""

  if(isWebAccess) {
    sources = await Promise.all(
      sources.map(async (source: any) => {
        const jinaResponse = await fetch(`https://r.jina.ai/${source.url}`, {
          headers: { "X-Timeout": "5", "X-Return-Format": "text" },
        }).then((res) => res.text().then((res) => res.replace("\n", "")));
        return { ...source, jinaResponse };
      }),
    );
    context = sources.map((item: any) => item.jinaResponse).join("\n");
  }
  
  const prompt = `${question}\n ${context}`;

  const iterator = makeIterator(prompt);
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
