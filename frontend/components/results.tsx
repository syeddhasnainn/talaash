import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useStore from "@/utils/store";
import { handleSearch } from "@/utils/get-search";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { streamingController } from "@/utils/streamingController";
import { useState } from "react";

interface ResultProps {
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  question: string;
  answer: string;
  socket: any,
}

export function Results({
  handleInput,
  handleSubmit,
  question,
  answer,
  socket
}: ResultProps) {
  const {
    setResults,
    setAnswer,
    isLoading,
    extractedCode,
    setExtractedCode,
    streaming,
    setStreaming,
    allResponses,
    setAllResponses,
    chatId,
    setChatId
  } = useStore();


  return (

    // <form
    //   onSubmit={handleSubmit}
    //   className="flex flex-col"
    // >
    //   <div className="w-full relative rounded-lg">
    //     <input
    //       onChange={handleInput}
    //       value={question}
    //       type="search"
    //       placeholder="Ask me anything..."
    //       className="w-full h-12 px-4 rounded-lg bg-background border border-black"
    //     />
    //     <Button
    //       type="submit"
    //       onClick={() =>
    //         handleSearch({
    //           question,
    //           setResults,
    //           setAnswer,
    //           extractedCode,
    //           setExtractedCode,
    //           socket,
    //           streaming,
    //           setStreaming,
    //         })
    //       }
    //       variant="ghost"
    //       size="icon"
    //       className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
    //     >
    //       <SearchIcon className="w-5 h-5" />
    //       <span className="sr-only">Search</span>
    //     </Button>
    //   </div>
    //   <div className="flex gap-2">
    //     <button className="border border-black my-2 w-24 rounded-xl p-1" onClick={() =>
    //       handleSearch({
    //         question,
    //         setResults,
    //         setAnswer,
    //         extractedCode,
    //         setExtractedCode,
    //         socket,
    //         streaming,
    //         setStreaming,
    //       })
    //     }>regenerate</button>


    //     <button className="border border-black my-2 w-24 rounded-xl p-1" onClick={() => streamingController.stopStreaming()} disabled={!streaming}
    //     >stop</button>

    //   </div>

    //   {!answer && isLoading && <div>Loading...</div>}
    //   {answer && (

    //     <div className="flex flex-row gap-2 h-full overflow-y-scroll">
    //       <div className="basis-1/2 border border-black rounded-xl p-1 ">
    //         <Markdown remarkPlugins={[remarkGfm]}
    //           components={{
    //             code(props) {
    //               const { children, className, node, ...rest } = props
    //               const match = /language-(\w+)/.exec(className || '')
    //               return match ? (
    //                 <SyntaxHighlighter
    //                   PreTag="div"
    //                   language={match[1]}
    //                   style={dark}
    //                   wrapLines={true}
    //                   wrapLongLines={true}
    //                 >
    //                   {String(children).replace(/\n$/, '')}
    //                 </SyntaxHighlighter>
    //               ) : (
    //                 <code {...rest} className={className}>
    //                   {children}
    //                 </code>
    //               )
    //             }
    //           }}
    //         >{answer}</Markdown>
    //       </div>
    //       {<div className="h-full basis-1/2 border border-black rounded-xl p-1 ">
    //         <iframe
    //           src="http://localhost:3000"
    //           style={{ width: '100%', height: '100%', border: 'none' }}
    //         ></iframe>
    //       </div>}

    //     </div>


    //   )}
    //   {/* <button className="border border-black my-4 w-24 rounded-xl p-1" onClick={() =>
    //     handleSearch({
    //       question,
    //       setResults,
    //       setAnswer,
    //       extractedCode,
    //       setExtractedCode,
    //       socket,
    //       streaming,
    //       setStreaming,
    //     })
    //   }>regenerate</button> */}
    // </form>
    <div>
      <div className="flex h-screen w-full">
        <div className="left flex-1  flex flex-col">
          <div className="flex-1 overflow-auto">
            {allResponses.map((resp: any) => (
              <>
                {resp.role == "user" && (<div className="bg-slate-300">{resp.content}</div>)}
                
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
                  >{resp.role == "assistant" ? resp.content : null}</Markdown>
              </>

            ))}

          </div>
          <div className="bottom-box">
            <form onSubmit={handleSubmit}>
              <input
                className="border"
                onChange={handleInput}
                value={question}
                type="search"
                placeholder="Ask me anything..."
              />
              <button
                className="border"
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
                    allResponses,
                    setAllResponses,
                    setChatId,
                  })
                }
              >
                search
              </button>

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



        <div className="right flex-1">
          <iframe
            src="http://localhost:3000"
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
