import { useRef, useState, useTransition } from "react";
import { ChatMessageType } from "@/types/types";
import { useParams, useRouter } from "next/navigation";

export const useChat = () => {
  const router = useRouter();
  const { id } = useParams();
  const [conversation, setConversation] = useState<ChatMessageType[]>([]);
  const [question, setQuestion] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = inputRef.current?.value;
    inputRef.current!.value = "";

    if (!question || question.trim() === "") return;
    const chatId = crypto.randomUUID();

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
    if (!id) router.push(`/chat/${chatId}`);
  };

  return {
    conversation,
    question,
    setQuestion,
    handleSubmit,
    isPending,
    error,
    inputRef,
  };
};
