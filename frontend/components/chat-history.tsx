'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ChatHistoryProps {
    chatList: Array<{
        id: string,
        user_id: string
    }>
}

export default function ChatHistory({ chatList }: ChatHistoryProps) {
    const [chatHistory, setChatHistory] = useState(chatList)
    const router = useRouter()

    return (
        <div>
            <div className='flex flex-col gap-2'>
                {chatHistory.map((chat: any) => <button  className='rounded-md border hover:bg-slate-100 font-thin' onClick={() => { router.push(`/chat/${chat.id}`) }}>{chat.id}</button>)}
            </div>
        </div>
    )
}
