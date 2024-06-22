import { NextResponse } from "next/server";
import Together from "together-ai";
import jsdom, { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

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

  var { question, sources } = await request.json();
  // const htmlParser = async (url: any) => {
  //   const response = await fetch(url)
  //   const pageSource = await response.text()
  //   const vc = new jsdom.VirtualConsole()
  //   const dom = new JSDOM(pageSource, { virtualConsole: vc })
  //   const doc = dom.window.document.getElementsByTagName('body').length
  //   console.log(doc)

  //   // const parsedHTML = new Readability(doc).parse()?.content
  //   // console.log(parsedHTML)
  //   // return parsedHTML
  // }
  // var sources = [{
  //   url: 'https://www.bbc.co.uk/weather/2640354'
  // },
  // {
  //   url: 'https://www.metoffice.gov.uk/weather/forecast/gcrg49fhe'
  // },
  // {
  //   url: 'https://www.accuweather.com/en/gb/peterborough/pe1-2/weather-forecast/330350'
  // }

  // ]

  sources = await Promise.all(
    sources.map(async (source: any) => {
      const jinaResponse = await fetch(`https://r.jina.ai/${source.url}`, {
        headers: { "X-Timeout": "5", "X-Return-Format": "text" },
      }).then((res) => res.text().then((res) => res.replace("\n", "")));
      return { ...source, jinaResponse };
    }),
  );

  const context = sources.map((item: any) => item.jinaResponse).join("\n");

  const prompt = `${question}\n ${context}`;

  // const answer = await together.chat.completions.create({
  //   messages: [{ role: "user", content: prompt }],
  //   model: "codellama/CodeLlama-13b-Instruct-hf",
  //   max_tokens: 100,
  // });

  // const answer = await together.chat.completions.create({
  //   messages: [{ role: "system", content: "use the context provided and extract accurate answers, add it with your own knowledge and output a concise answer. Prioritize information over condensation. Provide to the point answers. no yapping" }, { role: "user", content: prompt },],
  //   model: "codellama/CodeLlama-13b-Instruct-hf",
  //   max_tokens: 100,
  // });

  // sources = await Promise.all(sources.map(async (source: any) => {
  //   const parsedHTML = await htmlParser(source.url);
  //   return { ...source, parsedHTML };
  // }));

  // const context = sources.map((source: any) => source.parsedHTML).join("\n")
  // const prompt = `${question} ${context}\n`

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
