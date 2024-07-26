'use client'
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';

import React from 'react'
import { useRouter } from "next/navigation";

export default function Sidebar({chats}:any) {
    const router = useRouter()


    return (
       <>
       <nav className='w-64 bg-white border-r border-gray-200'>
      <ScrollArea className="h-full px-4 py-6">
        <Button 
          onClick={() => router.push(`/chat/${uuidv4()}`)} 
          className="w-full mb-4 bg-black text-white hover:bg-gray-800"
        >
          New Chat
        </Button>
        <ul className='space-y-2'>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className='px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer text-sm text-gray-700'
              onClick={() => router.push(`/chat/${chat.id}`)}
            >
              {chat.chat_name}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </nav>
       </>
    )
}
