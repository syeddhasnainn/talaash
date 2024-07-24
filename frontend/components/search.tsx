'use client'

import { usePathname, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export function Search({ user_id }: { user_id: string }) {
    const pathname = usePathname()
    const router = useRouter()


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const uuid = uuidv4()
        router.push(`/chat/${uuid}`)
    }

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            <button onClick={handleSubmit}>create chat</button>
        </div>
    )
}