"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { ChatMessageType } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { addItem, getAllItems } from "@/utils/indexed-db";
import { setInterval } from "timers/promises";

interface ChatContextType {
  conversation: ChatMessageType[];
  setConversation: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
  inputRef: any;
  id: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isPending: boolean;
  error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversation, setConversation] = useState<ChatMessageType[]>([]);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  var { id } = useParams();

  //   useEffect(() => {
  //     const fetchConversation = async () => {
  //       const items = await getAllItems();
  //       console.log(items);
  //       //   setConversation(items);
  //     };
  //     fetchConversation();
  //   }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = inputRef.current?.value;
    inputRef.current!.value = "";

    if (!question || question.trim() === "") return;
    var chatId = id;
    if (!chatId) {
      setConversation([]);
      chatId = crypto.randomUUID();
      router.push(`/chat/${chatId}`);
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

    await addItem(
      [
        ...conversation,
        { role: "user", content: question },
        { role: "assistant", content },
      ],
      chatId as string
    );
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
