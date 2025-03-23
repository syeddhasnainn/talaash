"use client";

import { ChatMessageType } from "@/types/types";
import { addItem, getChat } from "@/utils/indexed-db";
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import { usePathname } from "next/navigation";

interface ChatContextType {
  conversation: ChatMessageType[];
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  id: string;
  isPending: boolean;
  error: string | null;
  handleSubmit: (e: React.KeyboardEvent<HTMLFormElement>) => Promise<void>;
  setConversation: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
  generateTitleFromUserMessage: (message: string) => Promise<string>;
  model: string;
  handleModelChange: (value: string) => void;
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  systemPrompt: string;
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const SYSTEM_PROMPT_KEY = 'talaash-system-prompt';
const DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant.";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { mutate } = useSWRConfig();

  const [conversation, setConversation] = useState<ChatMessageType[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const id = usePathname().split("/")[2];
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [systemPrompt, setSystemPrompt] = useState<string>(
    typeof window !== 'undefined' 
      ? localStorage.getItem(SYSTEM_PROMPT_KEY) ?? DEFAULT_SYSTEM_PROMPT
      : DEFAULT_SYSTEM_PROMPT
  );

  useEffect(() => {
    localStorage.setItem(SYSTEM_PROMPT_KEY, systemPrompt);
  }, [systemPrompt]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const [model, setModel] = useState<string>("qwen25groq");

  const handleModelChange = (value: string) => {
    setModel(value);
  };

  const generateTitleFromUserMessage = async (message: string) => {
    const chatTitleResp = await fetch("/api/title", {
      method: "POST",
      body: JSON.stringify({
        question: [...conversation, { role: "user", content: message }],
      }),
    });

    const { title } = await chatTitleResp.json();
    return title;
  };

  const handleSubmit = async (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const question = inputRef.current?.value;
      if (inputRef.current) inputRef.current.value = "";
      setInputValue("");

      if (!question || question.trim() === "") return;
      let chatId = id;

      if (!chatId) {
        chatId = crypto.randomUUID();
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
          model,
          systemPrompt,
          conversation: [...conversation, conversationMessage],
        }),
      });

      if (!response.ok) {
        const errorRes = await response.json();
        setError(errorRes.message);
        setIsPending(false);
        return;
      }

      setIsPending(false);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = "";

      setConversation((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const result = await reader.read();
          if (result.done) break;
          content += decoder.decode(result.value, { stream: true });
          setConversation((prev) => {
            const lastMessageIndex = prev.length - 1;
            return [
              ...prev.slice(0, lastMessageIndex),
              { role: "assistant", content },
            ];
          });
        }
      }

      const currentChat = await getChat(chatId);

      const title =
        currentChat?.title || (await generateTitleFromUserMessage(question));

      await addItem(
        {
          title,
          id: chatId,
          messages: [
            ...conversation,
            { role: "user", content: question },
            { role: "assistant", content },
          ],
        },
        chatId
      );
      mutate("sidebarChats");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        inputRef,
        model,
        handleModelChange,
        id: id as string,
        conversation,
        setConversation,
        handleSubmit,
        isPending,
        error,
        generateTitleFromUserMessage,
        inputValue,
        handleInputChange,
        systemPrompt,
        setSystemPrompt
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
