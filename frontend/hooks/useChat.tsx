import { addMessage, createChat, getMessageCount, incrementMessages } from "@/actions/actions";
import { useSocket } from "@/app/socket";
import { extractCodeFromChat } from "@/utils/get-response";
import { streamingController } from "@/utils/streamingController";
import { FileType } from "lucide-react";
import { useState } from "react";

type ContentItem =
  | { type: 'text', text: string }
  | { type: 'image_url', image_url: { url: string } };

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
  // const socket = useSocket();

  const [input, setInput] = useState("");
  const [code, setCode] = useState<string | undefined>("");
  const [preview, setPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] =
    useState<any[]>(chatMessages);
  const [chatList, setChatList] = useState(chats);
  const [limit, setLimit] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [imgUrl, setImgUrl] = useState('')

  const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }

    console.log('sf',selectedFile)

    try {
      // Step 1: Get the pre-signed URL
      const response = await fetch('/api/image-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: selectedFile.name, fileType: selectedFile.type }),
      });

      const { signedUrl } = await response.json();

      // Step 2: Use the signed URL to upload the file
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: selectedFile, // This is where we send the actual file
        headers: { 'Content-Type': selectedFile.type },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      console.log('uploaded')

    } catch (error) {
      throw new Error('Error uploading file');
    } 
  };

  const getCodeType = (resp: string) => {
    if (resp.includes("```html")) return "html";
    if (resp.includes("```javascript")) return "javascript";
    if (resp.includes("```typescript")) return "typescript";
    if (resp.includes("```jsx")) return "jsx";
    if (resp.includes("```tsx")) return "tsx";
    return "unknown";
  };

  const handlePreview = (resp: string) => {
    const ec = extractCodeFromChat(resp) as string;
    const codeType = getCodeType(resp);
    setPreview(true);

    switch (codeType) {
      case "jsx":
      case "tsx":
      case "javascript":
      case "typescript":
        // socket?.emit("generation", ec);
        setCode(ec);
        break;
      case "html":
        setCode(ec);
        break;
      default:
        setPreview(false);
        setPreviewError('nothing to preview')
    }
  };
  const stop = () => {
    streamingController.stopStreaming();
  };

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
      var newUserMessage = {}
    
      if (file) {
        console.log('img url cond')
        newUserMessage = {
          role: "user",
          content: [
            { type: "text", text: input },
            {
              type: "image_url",
              image_url: {
                "url": `https://podpreview.uk/${file.name}`,
                "detail": "low"
              },
            },
          ],
        };
      } 
      else {
        newUserMessage = {
          role: "user",
          content: input,
        };
      }

      // const newUserMessage = {
      //       role: "user",
      //       content: [
      //         { type: "text", text: input },
      //         {
      //           type: "image_url",
      //           image_url: {
      //             "url": `https://podpreview.uk/de2bb07f099f8ff8e3ae09cfde0b4374.png`
      //           },
      //         },
      //       ],
      //     };
    
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
      setFile(null)
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
            // Check if the new content is already at the end of the existing message
            if (!lastMessage.content.endsWith(content)) {
              lastMessage.content += content;
            }

            return updated;
          });
        }
      }

      handlePreview(assistantResponse);

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
    code,
    preview,
    isLoading,
    handleInputChange,
    handleSubmit,
    setPreview,
    handlePreview,
    stop,
    chatList,
    setChatList,
    setMessages,
    limit,
    setLimit,
    previewError,
    setPreviewError,
    file,
    setFile,
    handleFileChange,
  };
};
