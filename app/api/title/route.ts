import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: 'https://api.cerebras.ai/v1',
});

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    console.log('question', question);
    question.unshift({
      role: 'system',
      content: `\n
    - you will generate a short title based on the first message a user begins a conversation with, the name should be descriptive and concise
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    });
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b',
      messages: question,
    });

    return NextResponse.json({ title: completion.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
