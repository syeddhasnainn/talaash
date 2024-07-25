'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function Sidebar({chats}:any) {
    const router = useRouter()
    return (
        <div>
            <h2>history</h2>

            <div>
                {chats.map((cm:any) => (
                    <div onClick={e => router.push(`/chat/${cm.id}`)}>
                        {cm.chat_name}
                    </div>
                ))}
            </div>

        </div>
    )
}
