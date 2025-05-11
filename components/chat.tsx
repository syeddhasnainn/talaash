'use client';
import { useChat } from '@ai-sdk/react';
// import { usePathname } from 'next/navigation';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';
import { useEffect } from 'react';

export default function Chat({
  chatid,
  initialMessages,
}: {
  chatid: string;
  initialMessages: any;
}) {

  return (
    <div className="flex h-[100dvh] relative overflow-auto custom-scrollbar">
      <div className="mx-auto flex max-w-3xl flex-col justify-between w-full">
        <ChatMessages chatid={chatid} initialMessages={initialMessages} />
        <ChatInput initialMessages={initialMessages} chatid={chatid} />
      </div>
    </div>
  );
}
