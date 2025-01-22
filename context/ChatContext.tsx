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

interface ChatContextType {
  conversation: ChatMessageType[];
  setConversation: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
  inputRef: any;
  id: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isPending: boolean;
  error: string | null;
  sidebarChats: any[];
  setSidebarChats: React.Dispatch<React.SetStateAction<any[]>>;
  isNewChat: boolean;
  setIsNewChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversation, setConversation] = useState<ChatMessageType[]>([]);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidebarChats, setSidebarChats] = useState<any[]>([]);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  var { id } = useParams();

  const fetchChats = async () => {
    const chats = await getAllItems();
    const filteredChats = chats.map((c) => ({
      id: c.id,
      title: c.messages[0].content.slice(0, 30) + "...",
    }));
    setSidebarChats(filteredChats);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = inputRef.current?.value;
    inputRef.current!.value = "";

    if (!question || question.trim() === "") return;
    var chatId = id;

    if (!chatId) {
      setConversation([]);
      setIsNewChat(true);
      chatId = crypto.randomUUID();

      setSidebarChats((prev) => [
        ...prev,
        {
          id: chatId,
          title: question.slice(0, 30) + "...",
        },
      ]);
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
      {
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

    await fetchChats();
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
        sidebarChats,
        setSidebarChats,
        isNewChat,
        setIsNewChat,
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
