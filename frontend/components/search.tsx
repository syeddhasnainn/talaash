'use client'

import { type CoreMessage } from 'ai';
import { readStreamableValue } from 'ai/rsc';
import { addMessage, createChat } from "@/actions/actions";
import { useSocket } from '@/app/socket';
import { handleSearch } from '@/utils/get-response';
import useStore from '@/utils/store';
import { usePathname, useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChat } from 'ai/react';
import { continueConversation } from '@/app/action';

export function Search({ user_id }: { user_id: string }) {

    const pathname = usePathname()
    const router = useRouter()

    // const [question, setQuestion] = useState('')
    // const [chatList, setChatList] = useState([])
    const socket = useSocket()
    const { question, setQuestion, setExtractedCode, setStreaming, allResponses, setChatId, setAllResponses } = useStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(question)
        setQuestion(e.target.value)
    }

    useEffect(() => {
        // if (pathname =='/new') {
        //     setAllResponses([])

        // }
        setAllResponses([])
    }, [pathname])


    // const handleMessage = async(e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
    //     const uuid = uuidv4()
    //     router.push(`/chat/${uuid}`)
    //     createChat(user_id, uuid)
    //     // await handleSearch({ question, setExtractedCode, socket, setStreaming, allResponses, setAllResponses, setChatId, uuid })
    //     handleSubmit()
    //     setAllResponses(messages)
    //     console.log(messages)
    //     console.log(allResponses)
    // }

    return (
        // <div>
        //     <form onSubmit={handleSubmit}>
        //         <div >
        //             <input className='border w-full rounded-md px-2 font-thin' placeholder='ask me anything' value={input} onChange={handleInputChange} type="text" />
        //         </div>
        //     </form>

        // </div>

        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">

            {/* {allResponses.map((m, i) => (
                <div key={i} className="whitespace-pre-wrap">
                    {m.role === 'user' ? 'User: ' : 'AI: '}
                    {m.content as string}
                </div>
            ))} */}
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    const uuid = uuidv4()
                    
                    await createChat(user_id, uuid)
                    
                    router.push(`/chat/${uuid}`)
                    // setAllResponses(newMessages);
                    // setQuestion('');

                    

                }}
            >
                <input
                    className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                    value={question}
                    placeholder="Say something..."
                    onChange={e => setQuestion(e.target.value)}
                />
            </form>
        </div>
    )
}