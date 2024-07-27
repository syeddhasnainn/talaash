'use client'
import { useVirtualizer, Virtualizer } from '@tanstack/react-virtual'
import { addMessage, createChat } from '@/actions/actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { extractCodeFromChat } from '@/utils/get-response';
import { useChat } from 'ai/react';
import { CircleX, StopCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid';
import Spinner from './spinner';
import { useSocket } from '@/app/socket';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Sidebar from './sidebar'
import { UserButton } from '@clerk/nextjs';
import { headers } from 'next/headers';
import ChatHistory from './chat-history';

import { read } from 'fs';
import { streamingController } from '@/utils/streamingController';

interface ChatUIProps {
    chatMessages: any
    uuid: string;
    user_id: string,
    chats: ChatProps[]
}

type ChatProps = {
    id: string,
    user_id: string,
    chat_name: string
}

const ChatUI = ({ chatMessages, uuid, user_id, chats }: ChatUIProps) => {
    const router = useRouter()
    const socket = useSocket()


    const [input, setInput] = useState('')

    const [chatList, setChatList] = useState(chats)
    const [code, setCode] = useState<string | undefined>("")
    const [preview, setPreview] = useState(false)
    const [messages, setMessages] = useState<{ role: string; content: string; }[]>(chatMessages)

    // const { messages, input, handleInputChange, handleSubmit, stop, error, setMessages, isLoading, } = useChat({
    //     onResponse: async () => {
    //         const existingChat = chats.find((c: any) => c.id === uuid);
    //         if (chats.length == 0 || !existingChat) {
    //             await createChat(user_id, uuid, input);
    //         }
    //         await addMessage('user', input, uuid)
    //     },
    //     onFinish: async (response) => {
    //         await addMessage(response.role, response.content, uuid)
    //         handlePreview(response.content)
    //     },
    //     initialMessages: chatMessages,
    //     keepLastMessageOnError: true
    // });

    // const customSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     if (error != null) {
    //         setMessages(messages.slice(0, -1))
    //     }
    //     handleSubmit(event)
    // }

    // const getCodeType = (resp: string) => {
    //     if (resp.includes('```html')) return 'html'
    //     if (resp.includes('```javascript')) return 'javascript'
    //     if (resp.includes('```typescript')) return 'typescript'
    //     if (resp.includes('```jsx')) return 'jsx'
    //     if (resp.includes('```tsx')) return 'tsx'
    //     return 'unknown'
    // }

    // const handlePreview = (resp: string) => {
    //     const ec = extractCodeFromChat(resp) as string
    //     const codeType = getCodeType(resp)
    //     setPreview(true)

    //     switch (codeType) {
    //         case 'jsx':
    //         case 'tsx':
    //         case 'javascript':
    //         case 'typescript':
    //             socket?.emit('generation', ec)
    //             setCode(ec)
    //             break
    //         case 'html':
    //             setCode(ec)
    //             break
    //         default:
    //             setPreview(false)
    //     }
    // }


    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const existingChat = chats.find((c: any) => c.id === uuid);
        const signal = streamingController.startStreaming()

        if (!existingChat) {
            await createChat(user_id, uuid, input)
            setChatList([...chatList, { chat_name: input, user_id: user_id, id: uuid }])
        }

        const userMessage = [...messages, { role: 'user', content: input }]
        try {
            const resp = await fetch('/api/answer', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ messages: userMessage }),
                signal
            })

            if (resp.ok) {
                await addMessage('user', input, uuid)
            }

            setInput('')
            const reader = resp.body?.getReader()

            if (!resp.ok) {
                throw new Error('Failed to fetch response!')
            }

            if (!reader) {
                throw new Error("Response body is null");
            }

            setMessages([...userMessage, { role: 'assistant', content: '' }])

            const decoder = new TextDecoder()
            let done = false
            let assistantResponse = ''

            while (!done) {
                const { value, done: streamDone } = await reader.read()
                done = streamDone
                if (value) {
                    const content = decoder.decode(value)
                    assistantResponse += content
                    setMessages((prev) => {
                        const updated = [...prev]
                        const lastMessage = updated[updated.length - 1]
                        // Check if the new content is already at the end of the existing message
                        if (!lastMessage.content.endsWith(content)) {
                            lastMessage.content += content
                        }

                        return updated
                    })
                }
            }
            await addMessage('assistant', assistantResponse, uuid)
        }
        catch (error) {
            if (error instanceof DOMException){}
            else new Error(`${error}`)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }



    return (
        <div className='flex flex-row flex-1 h-screen'>
            <Sidebar chats={chatList} />

            <div className='flex flex-1 gap-6 p-6'>
                <div className='flex flex-col flex-1 basis-2/5 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6'>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Chat</h2>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                    <ScrollArea className='flex-1 mb-4'>
                        <div className='flex flex-col gap-4'>
                            {messages.map((c, index) => (

                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${c.role === 'user' ? 'bg-gray-100' : 'bg-white border border-gray-200 text-md '
                                        }`}
                                >
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
                                    >{c.content}</Markdown>

                                    {/* {c.content} */}


                                    {c.role === "assistant" && (
                                        <div className="mt-2 space-x-2">
                                            {/* <button className='px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors' onClick={() => navigator.clipboard.writeText(c.content)}>Copy</button> */}
                                            {/* <button className='px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors' onClick={() => handlePreview(c.content)}>Preview</button> */}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleSubmit} className='flex gap-2'>
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            className='flex-1 border-gray-300'
                            placeholder='Ask me anything...'
                        />
                        <Button type='button' onClick={() => streamingController.stopStreaming()
                        } variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                            <StopCircle className="h-4 w-4 mr-2" />
                            Stop
                        </Button>

                    </form>
                </div>
                {preview && (
                    <div className='flex-1 basis-3/5 rounded-lg shadow-lg overflow-hidden'>
                        <div className='h-full rounded-lg overflow-hidden flex flex-col'>
                            <div className='bg-black text-white p-3 flex items-center justify-between'>
                                <h3 className='text-lg font-semibold'>Preview</h3>
                                <div className='flex space-x-2'>
                                    <button onClick={() => setPreview(false)}>
                                        <CircleX />

                                    </button>
                                </div>
                            </div>
                            <div className='flex-1 overflow-hidden'>
                                {code?.startsWith('<!DOCTYPE html>') ? (
                                    <iframe srcDoc={code} style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
                                ) : (
                                    <iframe src="http://localhost:3000" style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default ChatUI;