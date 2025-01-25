"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";

export default function Chat() {
  return (
    <div className="flex h-[100dvh]">
      <div className="flex-1 relative">
        <ChatMessages />

        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-2xl mx-auto">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
