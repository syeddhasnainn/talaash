'use client'
import Editor from "@/components/ui/editor";
import { tree } from "next/dist/build/templates/app-page";
import { headers } from "next/headers";

export default async function Home() {

    const handleSearch = async () => {
        const res = await fetch("http://localhost:3003", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({ data: "hello" }),
        }).then(res=>res.json())

        console.log(res)
    }

    return (
        <div>
            <button onClick={handleSearch}>test</button>
        </div>
    )
}