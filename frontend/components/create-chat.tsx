'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Plus, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';


export default function CreateChat({ chats }: any) {
    const router = useRouter()
    const [chatList, setChatList] = useState(chats)

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 flex flex-col">
                <h1 className="text-3xl font-light text-gray-800 mb-8 text-center">Create Chat</h1>

                <button onClick={() => {
                    const uuid = uuidv4()
                    router.push(`/chat/${uuid}`)
                }} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center mb-8 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <Plus size={20} className="mr-2" />
                    New Chat
                </button>

                <div className="flex-grow">
                    <h2 className="text-xl font-light text-gray-700 mb-4">Recent</h2>
                    <ul className="space-y-2">
                        {chatList.map((chat: { id: any }, index: number) => (
                            <li onClick={() => router.push(`/chat/${chat.id}`)} key={index} className="group flex items-center justify-between py-3 px-4 hover:bg-gray-100 rounded-lg transition duration-300 cursor-pointer">
                                <span className="text-gray-600 group-hover:text-gray-800">{chat.id}</span>
                                <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition duration-300" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
