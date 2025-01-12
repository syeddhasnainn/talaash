"use client";

import { useRouter } from "next/navigation";
import React from 'react';
import { useConversationStore } from './store/conversation';
import type { Message } from './store/conversation';

const recentSearches = [
  'Test 1',
  'Test 2',
  'Test 3',
];

export default function Home() {
  const router = useRouter();
  const { conversation, setConversation, question, setQuestion } = useConversationStore();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      
      if (question.trim() === "") return;
      
      const uuid = crypto.randomUUID();
      router.push(`/chat/${uuid}`);
      
      const newMessage: Message = { role: "user", content: question };
      setConversation(newMessage);
      setQuestion("");

      try {
        const response = await fetch(`/api/chat`, {
          method: "POST",
          body: JSON.stringify({ conversation: [...conversation, newMessage] }), 
        });


        const responseText = await response.text();

        setConversation({ role: "assistant", content: responseText });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <main className="flex min-h-screen">
      <div className="search-container flex h-screen flex-col items-center justify-center w-full">
        <div className="max-w-3xl w-full rounded-2xl bg-background p-4 border shadow-lg">
          <textarea
            autoFocus
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="w-full bg-transparent resize-none outline-none"
          ></textarea>
        </div>
      </div>
    </main>
  );
}