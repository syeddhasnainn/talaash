import { NextResponse } from "next/server";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { HumanMessage } from "@langchain/core/messages";
import { pull } from "langchain/hub";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent } from "langchain/agents";

export async function POST(request: Request) {
  const tool = new DuckDuckGoSearch({ maxResults: 3 });
  // const { question } = await request.json();

  const data = await tool
    .invoke("react sign in page")
    .then((res) => JSON.parse(res))
    .then((res) =>
      res.map((result: any) => ({
        title: result.title,
        url: result.link,
        description: result.snippet,
      })),
    );

  // const llm = new ChatTogetherAI({
  //     model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  //     temperature: 0.0,
  //     apiKey: process.env.TOGETHER_API_KEY
  // });

  // const llm = new ChatOpenAI({
  //     model: "gpt-3.5-turbo",
  //     apiKey:process.env.OPENAI_API_KEY,
  //     temperature:0

  // })

  // const agent = createToolCallingAgent({ llm, tools, prompt })

  // const agentExecutor = new AgentExecutor({
  //     agent,
  //     tools
  // })

  // const result = await agentExecutor.invoke({ "input": "btc price in usd" })

  return NextResponse.json({ data }, { status: 200 });

  // const API_KEY = process.env.AZURE_SUBSCRIPTION_KEY
  // if (!API_KEY) {
  //     return NextResponse.json({ error: "API key not found" }, { status: 500 })
  // }

  // const { question } = await request.json()

  // if (!question) {
  //     return NextResponse.json({ error: "Search can't be empty" }, { status: 400 })
  // }

  // const params = new URLSearchParams({
  //     q: question || '',
  //     count: '2',
  //     mkt: 'en-us',
  //     safesearch: 'strict',

  // })

  // const res = await fetch(`https://api.bing.microsoft.com/v7.0/search?${params}`, { headers: { 'Ocp-Apim-Subscription-Key': API_KEY } })
  // const data = await res.json()
  // .then(data => data.webPages.value)
  // .then(data => data.map((result:any)=> ({
  //     title: result.name,
  //     url: result.url,
  //     description: result.snippet,
  // })))

  // return NextResponse.json({ data }, { status: 200 })
}
