'use client'
import { useSocket } from '@/app/socket'
import { handleSearch } from '@/utils/get-response'
import useStore from '@/utils/store'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface MessagesProps {
  chatMessages: unknown,
  uuid: string
}

export default function Messages({ chatMessages, uuid }: MessagesProps) {
  const socket = useSocket()
  const pathname = usePathname()

  const { question, setQuestion, setExtractedCode, setStreaming, setChatId, allResponses, setAllResponses, extractedCode } = useStore()
  console.log('from messages:', allResponses)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSearch({ question, setExtractedCode, socket, setStreaming, allResponses, setAllResponses, setChatId, uuid })
    setQuestion('')
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value)
  }

  useEffect(() => {
    console.log(pathname)
    setAllResponses(chatMessages)
  }, [])

  return (
    <div>
      <div className="flex h-screen w-full pt-4 px-10 gap-2 font-light">

        <div className="left flex-1 flex flex-col gap-2 max-w-4xl">
          <div className="flex-1 overflow-auto">
            {allResponses.map((resp: any, index: number) => (
              <div key={index}>
                {resp.role == "user" && (<div className="inline-block min-w-36 px-1 bg-slate-200 rounded-md border mb-2 p-2">{resp.content}</div>)}
                <div>
                  <Markdown remarkPlugins={[remarkGfm]}
                    components={{
                      code(props) {
                        const { children, className, node, ...rest } = props
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <SyntaxHighlighter
                            PreTag="div"
                            language={match[1]}
                            style={dark}
                            wrapLines={true}
                            wrapLongLines={true}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...rest} className={className}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {resp.role == "assistant" ? resp.content : null}</Markdown>
                </div>

              </div>

            ))}

          </div>
          <div className="bottom-box ">
            <form onSubmit={handleSubmit} className='mb-4'>
              <input className='border w-full rounded-md px-2 font-thin shadow-sm' placeholder='ask me anything' value={question} onChange={handleInput} type="text" />


            </form>
          </div>
          {/* <div className="border sticky bottom-0 ">
            <div>

              <form onSubmit={handleSubmit}>
                <input
                  onChange={handleInput}
                  value={question}
                  type="search"
                  placeholder="Ask me anything..."
                />
                <button
                  type="submit"
                  onClick={() =>
                    handleSearch({
                      question,
                      setResults,
                      setAnswer,
                      extractedCode,
                      setExtractedCode,
                      socket,
                      streaming,
                      setStreaming,
                    })
                  }
                >
                  search
                </button>

              </form>

            </div>
          </div> */}

        </div>



        <div className="right flex-1 border rounded-md mb-4 shadow-sm">
          {extractedCode && extractedCode.startsWith("<!DOCTYPE html>") ? <iframe srcDoc={extractedCode} style={{ width: '100%', height: '100%', border: 'none' }} ></iframe> : <div>error</div>}
          {/* <iframe
            src="http://localhost:3000"
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe> */}

        </div>
      </div>
    </div>
  )
}
