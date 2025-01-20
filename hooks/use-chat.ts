import { useState, useTransition } from "react";
import { ChatMessageType } from "@/types/types";

export const useChat = () => {
  const [conversation, setConversation] = useState<ChatMessageType[]>([]);
  const [question, setQuestion] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const conversationMessage: ChatMessageType = {
      role: "user",
      content: question,
    };

    setConversation((prev) => [...prev, conversationMessage]);
    startTransition(async () => {
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
      setQuestion("");
    });
  };

  return {
    conversation,
    question,
    setQuestion,
    handleSubmit,
    isPending,
    error,
  };
};
