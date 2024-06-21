'use client'
import { FormEvent, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Results } from '@/components/ui/results';
import SearchBar from '@/components/ui/search-bar';

export default function Home() {
  console.log(process.env.TOGETHER_API_KEY)
  interface SearchResults {
    title: string;
    url: string;
    description: string;
  }

  const [question, setQuestion] = useState<string>('');
  const [results, setResults] = useState<SearchResults[]>([])
  const [answer, setAnswer] = useState<string>('')
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.currentTarget.value);
  }

  const handleSearch = async () => {
    const searchResponse = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    }).then(res => res.json())
    setResults(searchResponse.data)

    const relatedQuestions = await fetch('/api/relatedQuestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    }).then(res => res.json()).then(res => res.output.relatedQuestions)
    setRelatedQuestions(relatedQuestions)

    const llmResponse = await fetch('/api/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, sources: searchResponse.data })
    })



    if (!llmResponse.ok) {
      throw new Error('Failed to fetch answer')
    }

    const reader = llmResponse.body?.getReader();

    if (!reader) {
      throw new Error('Response body is null');
    }

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

          <SearchBar handleInput={handleInput} handleSearch={handleSearch} question={question} />

        }

        {results.length > 0 && <Results results={results} handleInput={handleInput} handleSearch={handleSearch} handleSubmit={handleSubmit} question={question} answer={answer} relatedQuestions={relatedQuestions} />}

      </div>
    </main>
  );
}

