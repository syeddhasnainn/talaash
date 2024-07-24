'use client'
import { addMessage, createChat } from '@/actions/actions';
import { useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { StopCircle } from '@phosphor-icons/react'
import { extractCodeFromChat } from '@/utils/get-response';

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

    const [chatList, setChatList] = useState(chats)
    const [html, setHtml] = useState<string | undefined>("")
    const [isHtml, setIsHtml] = useState(false)

    const { messages, input, handleInputChange, handleSubmit, stop, } = useChat({
        onResponse: async () => {
            const existingChat = chats.find((c: any) => c.id === uuid);
            if (chats.length == 0 || !existingChat) {
                await createChat(user_id, uuid, input);
            }
            await addMessage('user', input, uuid)
        },
        onFinish: async (response) => {
            await addMessage(response.role, response.content, uuid)
            const html = extractCodeFromChat(response.content)
            setHtml(html)
            setIsHtml(true)
            console.log(html)
        },
        initialMessages: chatMessages
    });

    const handleHtml = (code:string)=> {
        const ec = extractCodeFromChat(code)
        setHtml(ec)
        setIsHtml(true)
    }


    return (
        <div className='flex flex-row flex-1 gap-2 h-screen'>
            <button>test button</button>
            <nav className='basis-1/6 border pt-2'>
                <ul className='flex flex-col gap-2'>
                    {chatList.map((chat: any) => (
                        <li className='text-center border-y hover:bg-slate-300' onClick={() => router.push(`/chat/${chat.id}`)}>{chat.chat_name}</li>
                    ))}

                </ul>
            </nav>

            <div className='right flex basis-5/6 flex-1 gap-6'>
                <div className='flex flex-col gap-4 flex-1 basis-1/2'>
                    <div className='flex-1 overflow-y-auto border'>
                        <div className='flex flex-col gap-2'>
                            {messages.map((c) => (
                                <div onClick={()=> handleHtml(c.content)} className={`hover:bg-slate-100 ${c.role === 'user' ? 'bg-gray-200' : null}`}>{c.content}</div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit} action="" className='flex py-4 gap-1'>
                            <input value={input} onChange={handleInputChange} type="text" className='border w-full' placeholder='ask me anything...' />
                            <button type='submit' onClick={() => stop()} className='border'>
                                stop
                            </button>
                        </form>

                    </div>
                </div>

                <div className='flex-1 border basis-1/2 '>
                    {isHtml ? <iframe srcDoc={html} style={{ width: '100%', height: '100%', border: 'none' }}></iframe> : <p>nothing to preview</p>}
                </div>


            </div>

        </div>
    );
};


export default ChatUI;