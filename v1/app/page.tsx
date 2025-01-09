'use client'
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MemoizedMarkdown from "@/components/markdown";
import Spinner from "@/components/spinner";
import { useChatContext } from "@/components/chat-provider";

export default function Home() {

  const { messages, isLoading } = useChatContext();
  return (
    <main>
      <div className="flex flex-col items-center justify-end h-screen">
        <div className="flex flex-col items-start justify-start">
    <div>

    <ScrollArea className="flex-1 mb-4">
      <div className="flex flex-col gap-4">
        {messages.map((c, index) => (
          <div key={index}>
            {c.role == "user" ? (
              <div className="p-3 rounded-xl  bg-[#21201C]  text-white w-fit">
                {typeof c.content == "object" ? c.content[0].text : c.content}
              </div>
            ) : (
              <div className="text-white p-3 rounded-xl bg-[#373634] bordertext-md ">
                <MemoizedMarkdown c={c.content} />
              </div>
            )}
          </div>
        ))}
        {isLoading && <Spinner />}
      </div>
    </ScrollArea>
    </div>
        <div>
          <input
            className="p-4 rounded-2xl bg-transparent outline-none text-white border"
            placeholder="Ask me anything..."
            type="text"
          />
        </div>
        </div>
        
      </div>
    </main>
  );
}
