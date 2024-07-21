'use client'
import { createChat } from "@/actions/actions";
import { useSocket } from '@/app/socket';
import { handleSearch } from '@/utils/get-response';
import useStore from '@/utils/store';
import { usePathname, useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function Search({ user_id }: { user_id: string }) {


    const pathname = usePathname()
    const router = useRouter()

    // const [question, setQuestion] = useState('')
    // const [chatList, setChatList] = useState([])
    const socket = useSocket()
    const {question, setQuestion, setExtractedCode, setStreaming, allResponses, setChatId, setAllResponses } = useStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(question)
        setQuestion(e.target.value)
    }

    useEffect(() => {
        setAllResponses([])
        console.log(pathname)
        console.log('search:',allResponses)
    }, [pathname])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const uuid = uuidv4()
        router.push(`/chat/${uuid}`)
        createChat(user_id, uuid)
        handleSearch({ question, setExtractedCode, socket, setStreaming, allResponses, setAllResponses, setChatId, uuid })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div >
                    <input className='border w-full rounded-md px-2 font-thin' placeholder='ask me anything' value={question} onChange={handleChange} type="text" />

                </div>
            </form>

        </div>
    )
}