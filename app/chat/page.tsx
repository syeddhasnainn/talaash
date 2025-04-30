'use client';

import { ChatInput } from '@/components/chat-input';
import { ChatMessages } from '@/components/chat-messages';
import { useRef } from 'react';

export default function Chat() {
  const messagesRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={messagesRef}
      className="flex h-[100dvh] relative overflow-auto custom-scrollbar"
    >
      <div className="mx-auto flex max-w-3xl flex-col justify-between w-full">
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}
