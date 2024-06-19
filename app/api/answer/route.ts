import { NextResponse } from "next/server"
import Together from "together-ai";
import jsdom, { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export const dynamic = "force-dynamic";

const together = new Together({ "apiKey": process.env.TOGETHER_API_KEY });
const encoder = new TextEncoder()

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

async function* makeIterator(prompt: string) {
  const answer = await together.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "Qwen/Qwen1.5-7B",
    max_tokens: 100,
    stream: true
  });
  for await (const chunk of answer) {
    yield encoder.encode(`${chunk.choices[0].delta?.content}`)
    await sleep(100)
  }
}

export async function POST(request: Request) {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  var { question, sources } = await request.json()
  const htmlParser = async (url: any) => {
    const response = await fetch(url)
    const pageSource = await response.text()
    const vc = new jsdom.VirtualConsole()
    const dom = new JSDOM(pageSource, { virtualConsole: vc })
    const doc = dom.window.document
    const parsedHTML = new Readability(doc).parse()?.content
    return parsedHTML
  }

  sources = await Promise.all(sources.map(async (source: any) => {
    const parsedHTML = await htmlParser(source.url);
    return { ...source, parsedHTML };
  }));

  const context = sources.map((source: any) => source.parsedHTML).join("\n")
  const prompt = `${question} ${context}\n`

  const iterator = makeIterator(prompt)
  const streamer = iteratorToStream(iterator)

  return new NextResponse(streamer, {headers: {
        "Content-Encoding": "none",
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream; charset=utf-8",
        "Connection": "keep-alive"
      }})
}