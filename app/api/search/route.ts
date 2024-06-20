import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const API_KEY = process.env.AZURE_SUBSCRIPTION_KEY
    if (!API_KEY) {
        return NextResponse.json({ error: "API key not found" }, { status: 500 })
    }
  
    const { question } = await request.json()

  

    if (!question) { 
        return NextResponse.json({ error: "Search can't be empty" }, { status: 400 }) 
    }

    const params = new URLSearchParams({
        q: question || '',
        count: '2',
        mkt: 'en-us',
        safesearch: 'strict',

    })

    const res = await fetch(`https://api.bing.microsoft.com/v7.0/search?${params}`, { headers: { 'Ocp-Apim-Subscription-Key': API_KEY } })
    const data = await res.json()
    .then(data => data.webPages.value)
    .then(data => data.map((result:any)=> ({
        title: result.name,
        url: result.url,
        description: result.snippet,
    })))

    return NextResponse.json({ data }, { status: 200 })

}