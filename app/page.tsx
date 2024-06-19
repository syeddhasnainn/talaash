'use client'
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function LinkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
export function Component({ items, handleSearch, handleInput, handleSubmit, value, answer }: any) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="w-full mb-8 relative border border-gray-300 rounded-lg">
        <Input
          onChange={handleInput}
          value={value}
          type="search"
          placeholder="Ask me anything..."
          className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button
          type='submit'
          onClick={handleSearch}
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
        >
          <SearchIcon className="w-5 h-5" />
          <span className="sr-only">Search</span>
        </Button>


      </div>
      {items.length > 0 &&
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="col-span-1 bg-card rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Sources</h3>
            {items.map((item: any) => (
              <div className="space-y-2">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded-md p-2"
                  prefetch={false}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              </div>

            ))}

          </div>
          <div className="col-span-1 md:col-span-2 bg-card rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Answer</h3>
            <div className="prose text-muted-foreground">
              <p>
                {answer}
              </p>
            </div>
          </div>
          <div className="col-span-1 bg-card rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Related Questions</h3>
            <div className="space-y-2">
              <Link
                href="#"
                className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded-md p-2"
                prefetch={false}
              >
                <SearchIcon className="w-4 h-4" />
                <span>what is ai?</span>
              </Link>
            </div>
          </div>
        </div>
      }
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="col-span-1 bg-card rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Sources</h3>
          {items.map((item: any) => (
            <div className="space-y-2">
              <Link
                href="#"
                className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded-md p-2"
                prefetch={false}
              >
                <LinkIcon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            </div>

          ))}

        </div>
        <div className="col-span-1 md:col-span-2 bg-card rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Answer</h3>
          <div className="prose text-muted-foreground">
            <p>
              {answer}
            </p>
          </div>
        </div>
        <div className="col-span-1 bg-card rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Related Questions</h3>
          <div className="space-y-2">
            <Link
              href="#"
              className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded-md p-2"
              prefetch={false}
            >
              <SearchIcon className="w-4 h-4" />
              <span>what is ai?</span>
            </Link>
          </div>
        </div>
      </div> */}
    </form>
  )
}
export function Cards() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto p-4 md:p-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 ">
          <h3 className="text-lg font-medium">Breaking News: Earthquake Hits California</h3>
          <p className="text-sm text-muted-foreground mt-2">
            A powerful earthquake has struck the California coast, causing widespread damage and power outages.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium">Tech Giant Announces Major Acquisition</h3>
          <p className="text-sm text-muted-foreground mt-2">
            The tech industry is buzzing with news of a high-profile acquisition that could reshape the market.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium">New Sustainability Initiative Launched</h3>
          <p className="text-sm text-muted-foreground mt-2">
            A leading organization has unveiled a comprehensive plan to address environmental concerns.
          </p>
        </CardContent>
      </Card>
    </div>
    
  </div>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
export function AccordionDemo({ items }: any) {
  return (
    <div>
      Sources
      {items.map((item: any) => (
        <Accordion type="single" collapsible className="w-full flex flex-row">
          <Avatar>
            <AvatarImage src={`https://www.google.com/s2/favicons?domain=${item.url}&sz=64`} />
          </Avatar>
          <AccordionItem value="item-1">
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              {item.desription}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>

  )
}

export default function Home() {



  const [question, setQuestion] = useState('');
  const [results, setResults] = useState([])
  const [answer, setAnswer] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault();
  }

  const handleInput = (e: any) => {
    setQuestion(e.target.value);
  }

  const handleSearch = async () => {
    console.log('searching');
    const searchResponse = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    }).then(res => res.json())
    setResults(searchResponse.data)

    const llmResponse = await fetch('/api/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, sources: searchResponse.data })
    })

    const reader = llmResponse.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let fullContent = '';

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        fullContent += decoder.decode(value);
        setAnswer(fullContent)
      }
    }
  }
  
  return (
    <main>

      <div>
        <div className='flex flex-row justify-between p-2'>
          <Badge className='border border-gray-300 rounded-full' variant="outline">Talaash</Badge>
          <Badge className='rounded-full' variant="default">Beta</Badge>
        </div>
        {results.length == 0 &&


           
          <div className="flex flex-col items-center justify-center h-screen w-full max-w-4xl mx-auto p-4 md:p-6 right-0 left-0 top-0 fixed">
             <Cards />
            <div className="w-full mb-8 relative border border-gray-300 rounded-lg">
              <Input
                onChange={handleInput}
                value={question}
                type="text"
                placeholder="Ask me anything..."
                className="w-full h-12 px-4 rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary "
              />
              <Button
                type='submit'
                onClick={handleSearch}
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
              >
                <SearchIcon className="w-5 h-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>

          }


        {results.length > 0 && <Component items={results} handleInput={handleInput} handleSearch={handleSearch} handleSubmit={handleSubmit} value={question} answer={answer} />}

      </div>
    </main>
  );
}
