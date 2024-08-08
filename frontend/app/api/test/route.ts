import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
    const response = await openai.chat.completions.create({
        model:"gpt-4o-mini",
        messages: [
            {
                role: "user",
                "content": [
                    {
                        "type": "text",
                        "text": "whats in the image",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            url: "https://podpreview.uk/test.png"
                        }
                    }
                ]
            },
        ],
        
        max_tokens: 300,
    });

    return NextResponse.json(response.choices[0].message.content)
}