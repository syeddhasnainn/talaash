'use client'

import { createChat } from "@/actions/actions";
import useStore from '@/utils/store';
import { usePathname, useRouter } from 'next/navigation';
import React, { FormEvent, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function Search({ user_id }: { user_id: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const { question, setQuestion, setAllResponses } = useStore()

    useEffect(() => {
        setAllResponses([])
    }, [pathname, setAllResponses])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(e.target.value)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const uuid = uuidv4()
        await createChat(user_id, uuid)
        router.push(`/chat/${uuid}`)
    }

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            <form onSubmit={handleSubmit}>
                <input
                    className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                    value={question}
                    placeholder="Say something..."
                    onChange={handleChange}
                />
            </form>
        </div>
    )
}