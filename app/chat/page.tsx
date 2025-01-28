"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";

export default function Chat() {
  return (
    <div className="flex h-[100dvh] relative">
      <div className="mx-auto flex max-w-2xl flex-col justify-between w-full">
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}
