import { addMessage, createChat, getMessageCount, incrementMessages } from "@/actions/actions";
import { streamingController } from "@/utils/streamingController";
import { useState } from "react";


interface ChatMessageProps {
  role: Role;
  content: string;
  chat_id: string;
  createdAt?: any;
}

interface ChatProps {
  id: string;
  user_id: string;
  chat_name: string;
}

type Role = "user" | "assistant" | "system";

interface useChatProps {
  chatMessages: Array<ChatMessageProps>;
  uuid: string;
  user_id: string;
  chats: ChatProps[];
}

export const useChat = ({
  chatMessages,
  uuid,
  user_id,
  chats,
}: useChatProps) => {

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] =
    useState<any[]>(chatMessages);
  const [chatList, setChatList] = useState(chats);
  const [limit, setLimit] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const signal = streamingController.startStreaming();

    try {
      const count = await getMessageCount(user_id);
      if (count > 100) {
        setLimit(true);
        setInput("");
        throw new Error('Message limit reached');
      }
      var newUserMessage = {
          role: "user",
          content: input,
      };

      const updatedMessages = [...messages, newUserMessage];
      console.log('updated mesages', updatedMessages)
      setMessages(updatedMessages);

      const resp = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages:updatedMessages }),
        signal,
      });

      console.log('response:',resp)

      setInput("");
      const reader = resp.body?.getReader();
    
      if (!resp.ok) {
        throw new Error("Failed to fetch response!");
      }

      if (!reader) {
        throw new Error("Response body is null");
      }

      setMessages([...updatedMessages, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      let done = false;
      let assistantResponse = "";
      setIsLoading(false);

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const content = decoder.decode(value);
          assistantResponse += content;
          setMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (!lastMessage.content.endsWith(content)) {
              lastMessage.content += content;
            }

            return updated;
          });
        }
      }

      const existingChat = chats.find((c: any) => c.id === uuid);
      if (!existingChat) {
        await createChat(user_id, uuid, input);
        setChatList([
          ...chatList,
          { chat_name: input, user_id: user_id, id: uuid },
        ]);
      }

      if (resp.ok) {
        await addMessage("user", input, uuid);
      }

      await addMessage("assistant", assistantResponse, uuid);
      await incrementMessages(user_id)
    } catch (error) {
      if (error instanceof DOMException) {
      } else new Error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return {
    input,
    messages,
    isLoading,
    handleInputChange,
    handleSubmit,
    stop,
    chatList,
    setChatList,
    setMessages,
    limit,
    setLimit,

  };
};
