"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { useChatContext } from "@/context/ChatContext";
import { getChat } from "@/utils/indexed-db";
import useSWR from "swr";

export default function Chat() {
  const { id, setConversation, isNewChat } = useChatContext();

  const fetchChat = async () => {
    const { messages } = await getChat(id);
    return messages;
  };

  const { data } = useSWR(id && !isNewChat ? `chat-${id}` : null, fetchChat, {
    fallbackData: [],
    onSuccess: (data) => {
      if (!isNewChat) {
        setConversation(data);
      }
    },
  });

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
