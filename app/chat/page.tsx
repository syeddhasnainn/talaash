"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { useChatContext } from "@/context/ChatContext";
import { useEffect, useRef } from "react";

export default function Chat() {
  const { isPending, conversation } = useChatContext();

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [conversation]);
  return (
    <div ref={messagesRef} className="flex h-[100dvh] relative overflow-y-auto">
      <div
        className="mx-auto flex max-w-2xl flex-col justify-between w-full"
      >
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}
