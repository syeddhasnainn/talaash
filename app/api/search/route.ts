import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const API_KEY = process.env.AZURE_SUBSCRIPTION_KEY
    if (!API_KEY) {
        return NextResponse.json({ error: "API key not found" }, { status: 500 })
    }

    const url = new URL(request.url)
    const query = url.searchParams.get('q')

    if (!query) { 
        return NextResponse.json({ error: "Search can't be empty" }, { status: 400 }) 
    }

    const params = new URLSearchParams({
        q: query || '',
        count: '5',
        mkt: 'en-us',
        safesearch: 'strict',

    })

    const res = await fetch(`https://api.bing.microsoft.com/v7.0/search?${params}`, { headers: { 'Ocp-Apim-Subscription-Key': API_KEY } })
    const data = await res.json()

    return NextResponse.json({ data: data }, { status: 200 })

}