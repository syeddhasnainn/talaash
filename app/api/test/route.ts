// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
import { NextResponse } from "next/server";
import Together from "together-ai";

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

const encoder = new TextEncoder()

const together = new Together({ "apiKey": process.env.TOGETHER_API_KEY });

async function* makeIterator() {
    const answer = await together.chat.completions.create({
        messages: [{ role: "user", content: 'what is ai?' }],
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        max_tokens: 100,
        stream: true,

    });

    for await (const chunk of answer) {
        yield encoder.encode(`<p>${chunk.choices[0].delta?.content}</p>`)
    }
}

export async function GET() {
    const iterator = makeIterator()
    const stream = iteratorToStream(iterator)

    return new NextResponse(stream, { status: 200 })
}