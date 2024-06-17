'use client'
import { useState } from 'react';
export default function Home() {

  const [question, setQuestion] = useState('');
  const [results, setResults] = useState([])
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(question);
  }

  const handleInput = (e: any) => {
    console.log(e.target.value);
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
    console.log('this is response', searchResponse)
    setResults(searchResponse.data)
    console.log('this is results', results)
  }

  return (
    <main>
      <div className="max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="pt-16 flex flex-col gap-1">
            <input onChange={handleInput} value={question} className="border-2 border-black rounded-xl px-2" type="text" />
            <button onClick={handleSearch} type="submit" className="max-w-xs border-2 rounded-xl border-black">submit</button>
          </div>
        </form>

        <div className='results'>
          <div>results</div>
          <div>
            {results.map((result: any) => (
              <li>{result.url}</li>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
