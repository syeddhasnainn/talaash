"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { useChatContext } from "@/context/ChatContext";
import { getChat } from "@/utils/indexed-db";
import useSWR from "swr";

export default function Chat() {
  const { id, setConversation } = useChatContext();

  const fetchChat = async () => {
    const { messages } = await getChat(id);
    return messages;
  };

  const { data } = useSWR(`chat-${id}`, fetchChat, {
    onSuccess: (data) => {
      setConversation(data);
    },
  });

  return (
    <div className="flex h-[100dvh] relative">
      <div className="mx-auto flex max-w-2xl flex-col justify-between w-full">
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}
