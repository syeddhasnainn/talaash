'use client'
import { addMessage, createChat } from '@/actions/actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { extractCodeFromChat } from '@/utils/get-response';
import { useChat } from 'ai/react';
import { StopCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid';
import Spinner from './spinner';
import { useSocket } from '@/app/socket';

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

    const [chatList, setChatList] = useState(chats)
    const [code, setCode] = useState<string | undefined>("")
    const [preview, setPreview] = useState(false)

    const { messages, input, handleInputChange, handleSubmit, stop, error, setMessages, isLoading } = useChat({
        onResponse: async () => {
            const existingChat = chats.find((c: any) => c.id === uuid);
            if (chats.length == 0 || !existingChat) {
                await createChat(user_id, uuid, input);
            }
            await addMessage('user', input, uuid)
        },
        onFinish: async (response) => {
            await addMessage(response.role, response.content, uuid)
            const code = extractCodeFromChat(response.content) as string
            console.log(code)
            socket?.emit('generation', code)

            if (code != null) {
                setCode(code)
                setPreview(true)
            }
        },
        initialMessages: chatMessages,
        keepLastMessageOnError: true
    });

    const customSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (error != null) {
            setMessages(messages.slice(0, -1))
        }
        handleSubmit(event)
    }

    const getCodeType = (resp: string) => {
        if (resp.includes('```html')) return 'html'
        if (resp.includes('```javascript')) return 'javascript'
        if (resp.includes('```typescript')) return 'typescript'
        if (resp.includes('```jsx')) return 'jsx'
        if (resp.includes('```tsx')) return 'tsx'
        return 'unknown'
    }

    const handlePreview = (resp: string) => {
        const ec = extractCodeFromChat(resp) as string
        const codeType = getCodeType(resp)
        setPreview(true)

        switch (codeType) {
            case 'jsx':
            case 'tsx':
            case 'javascript':
            case 'typescript':
                socket?.emit('generation', ec)
                setCode(ec)
                break
            case 'html':
                setCode(ec)
                break
            default:
                setPreview(false)
        }
    }

    return (
        <div className='flex flex-row flex-1 h-screen bg-gray-50'>
            <nav className='w-64 bg-white shadow-md z-10'>
                <ScrollArea className="h-full px-4 py-6">
                    <Button onClick={() => router.push(`/chat/${uuidv4()}`)} variant="outline" className="w-full mb-4">New Chat</Button>
                    <ul className='space-y-2'>
                        {chatList.map((chat: any) => (
                            <li
                                key={chat.id}
                                className='px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer text-sm'
                                onClick={() => router.push(`/chat/${chat.id}`)}
                            >
                                {chat.chat_name}
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </nav>

            <div className='flex flex-1 gap-6 p-6'>
                <div className='flex flex-col flex-1 basis-2/5'>
                    <ScrollArea className='flex-1 mb-4 bg-white rounded-lg shadow-md'>

                        <div className='flex flex-col gap-4 p-4'>
                            {messages.map((c, index) => (
                                <div
                                    key={index}
                                    onClick={() => handlePreview(c.content)}
                                    className={`p-3 rounded-lg transition-colors duration-200 ${c.role === 'user' ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    {/* <ReactMarkdown
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
                                        {c.content}
                                    </ReactMarkdown> */}

                                </div>

                            ))}
                        </div>


                    </ScrollArea>
                    <form onSubmit={customSubmit} className='flex gap-2'>
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            className='flex-1'
                            placeholder='Ask me anything...'
                        />

                        <Button onClick={stop} variant="outline" className="hover:bg-red-50 transition-colors duration-200">
                            <StopCircle className="h-4 w-4 mr-2" />
                            Stop
                        </Button>
                    </form>
                </div>
                {preview ? <div className='flex-1 bg-white rounded-lg shadow-md overflow-hidden basis-3/5'>
                    {code?.startsWith('<!DOCTYPE html>') ? (
                        <iframe srcDoc={code} style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
                    ) : (
                        <iframe src="http://localhost:3000" style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
                        // <div className="flex items-center justify-center h-full text-gray-500">
                        //     Nothing to preview
                        // </div>
                    )}
                </div> : null}

            </div>
        </div>
    );
};


export default ChatUI;