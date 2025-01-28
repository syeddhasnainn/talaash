"use client";

import { ChatMessageType } from "@/types/types";
import { addItem, getChat } from "@/utils/indexed-db";
import React, { createContext, useContext, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { usePathname } from "next/navigation";

interface ChatContextType {
  conversation: ChatMessageType[];
  inputRef: any;
  id: string;
  isPending: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setConversation: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
  generateTitleFromUserMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { mutate } = useSWRConfig();

  const [conversation, setConversation] = useState<ChatMessageType[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = usePathname().split("/")[2];

  const generateTitleFromUserMessage = async (message: string) => {
    const chatTitle = await fetch("/api/title", {
      method: "POST",
      body: JSON.stringify({
        question: [...conversation, { role: "user", content: message }],
      }),
    });

    const { title } = await chatTitle.json();
    return title;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = inputRef.current?.value;
    inputRef.current!.value = "";

    if (!question || question.trim() === "") return;
    var chatId = id;

    if (!chatId) {
      chatId = crypto.randomUUID() as string;
      window.history.replaceState({}, "", `/chat/${chatId}`);
    }
    setIsPending(true);
    const conversationMessage: ChatMessageType = {
      role: "user",
      content: question,
    };

    setConversation((prev) => [...prev, conversationMessage]);
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        conversation: [...conversation, conversationMessage],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      setError(error.message);
      return;
    }
    setIsPending(false);

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let content = "";

    setConversation((prev) => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const result = await reader?.read();
      if (result?.done) break;
      content += decoder.decode(result?.value, { stream: true });
      setConversation((prev) => {
        const lastMessageIndex = prev.length - 1;
        return [
          ...prev.slice(0, lastMessageIndex),
          { role: "assistant", content },
        ];
      });
    }
    const currentChat = await getChat(chatId as string);

    const title =
      currentChat?.title || (await generateTitleFromUserMessage(question));

    await addItem(
      {
        title,
        id: chatId as string,
        messages: [
          ...conversation,
          {
            role: "user",
            content: question,
          },
          {
            role: "assistant",
            content,
          },
        ],
      },
      chatId as string
    );

    mutate("sidebarChats");
  };

  return (
    <ChatContext.Provider
      value={{
        inputRef,
        id: id as string,
        conversation,
        setConversation,
        handleSubmit,
        isPending,
        error,
        generateTitleFromUserMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
