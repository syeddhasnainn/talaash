'use client'
import { addMessage, createChat } from '@/actions/actions'
import { continueConversation } from '@/app/action'
import { useSocket } from '@/app/socket'
import { extractCodeFromChat, handleSearch } from '@/utils/get-response'
import useStore from '@/utils/store'
import { readStreamableValue } from 'ai/rsc'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { useChat } from 'ai/react';

interface MessagesProps {
  chatMessages: any,
  uuid: string
}

export default function Messages({ chatMessages, uuid, user_id, chats }: any) {
  const socket = useSocket()

  const { question, setQuestion, setExtractedCode, allResponses, setAllResponses, extractedCode, isLoading } = useStore()

<<<<<<< HEAD
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSearch({ question, setQuestion, setExtractedCode, socket, setStreaming, allResponses, setAllResponses, setChatId, uuid })
    setQuestion('')
  }
=======
  const { messages, input, handleInputChange, handleSubmit, stop,  } = useChat({
    onResponse: async () => {
      const existingChat = chats.find((c: any) => c.id === uuid);
      if (chats.length == 0 || !existingChat) {
        await createChat(user_id, uuid, input);
      }
      
      await addMessage('user', input, uuid)
    },

    onFinish: async (response) => {
      await addMessage(response.role, response.content, uuid)
    },

    initialMessages: chatMessages

  });
>>>>>>> prompts

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value)
  }
  console.log('loading', isLoading)

  // useEffect(() => {
  //   setAllResponses(chatMessages)
  // }, [])


  useEffect(()=> {
    if (chatMessages.length == 0){
      handleSearch({ question, setQuestion, setExtractedCode, socket, setStreaming, allResponses, setAllResponses, setChatId, uuid })
    }
  }, [])


  return (
    <div>
<<<<<<< HEAD
      <div className="flex h-screen w-full pt-4 px-10 gap-2 font-light">
=======
      <div className="flex h-screen w-full  gap-2 font-light">

>>>>>>> prompts
        <div className="left flex-1 flex flex-col gap-2 max-w-4xl">

          <div className="flex-1 overflow-auto">
            {messages.map((resp: any, index: number) => (
              <div key={index}>
                {resp.role == "user" && (<div className="inline-block min-w-36 px-1 bg-slate-200 rounded-md border mb-2 p-2">{resp.content}</div>)}
                <div>
                  {/* <Markdown remarkPlugins={[remarkGfm]}
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
                  > */}
                  {resp.role == "assistant" ? resp.content : null}
                  {/* </Markdown> */}
                </div>

              </div>

            ))}

          </div>
          <div className="bottom-box ">
            <form onSubmit={handleSubmit} className='mb-4 flex flex-row gap-2'>
              <input className='border w-full rounded-md px-2 text-xl font-thin shadow-sm py-4' placeholder='ask me anything' value={input} onChange={handleInputChange} type="text" />

                <button className='border rounded-md px-2 text-xl font-thin shadow-sm py-4' type="button" onClick={() => stop()}>
                Stop
              </button>
              
              
            </form>
          </div>
        </div>


<<<<<<< HEAD

        <div className="right flex-1 border rounded-md mb-4 shadow-sm">
          {extractedCode && extractedCode.startsWith("<!DOCTYPE html>") ? <iframe srcDoc={extractedCode} style={{ width: '100%', height: '100%', border: 'none' }} ></iframe> : <div>error</div>}
          {/* <iframe
            src="http://localhost:3000"
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe> */}
=======
        {extractedCode && (
          <div className="right flex-1 border rounded-md mb-4 shadow-sm">
            {extractedCode && extractedCode.startsWith("<!DOCTYPE html>") ? <iframe srcDoc={extractedCode} style={{ width: '100%', height: '100%', border: 'none' }} ></iframe> : <div>error</div>}
            {/* <iframe
            src="http://localhost:3000"
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe> */}

          </div>
        )}
>>>>>>> prompts

      </div>
    </div>
  )
}

// async e => {
//   e.preventDefault();
//   const existingChat = chats.find((c: any) => c.id === uuid);
//   if (chats.length == 0 || !existingChat) {
//     await createChat(user_id, uuid, question);
//   }

//   const currentMessage = { role: 'user', content: question }
//   const newMessages: any = [
//     ...allResponses,
//     currentMessage,
//   ];

//   setAllResponses(newMessages);
//   setQuestion('');
//   const result = await continueConversation(newMessages);

//   let fullResponse = ''
//   for await (const content of readStreamableValue(result)) {
//     var newContent = content?.slice(fullResponse.length);
//     fullResponse += newContent
//     setAllResponses([
//       ...newMessages,
//       {
//         role: 'assistant',
//         content: content as string,
//       },
//     ]);
//   }

//   const onlyCode = extractCodeFromChat(fullResponse) as string;
//   setExtractedCode(onlyCode);

//   await addMessage(currentMessage.role, currentMessage.content, uuid)
//   await addMessage('assistant', fullResponse, uuid)

// }

