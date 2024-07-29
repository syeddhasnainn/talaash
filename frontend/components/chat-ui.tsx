"use client";
import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import { addMessage, createChat } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { extractCodeFromChat } from "@/utils/get-response";
import { useChat } from "@/hooks/useChat";
import { CircleX, Copy, StopCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { v4 as uuidv4 } from "uuid";
import Spinner from "./spinner";
import { useSocket } from "@/app/socket";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Sidebar from "./sidebar";
import { UserButton } from "@clerk/nextjs";
import MemoizedMarkdown from "./markdown";
import { read } from "fs";
import { streamingController } from "@/utils/streamingController";
import { IFrame } from "./iframe";

interface ChatUIProps {
  chatMessages: any;
  uuid: string;
  user_id: string;
  chats: ChatProps[];
}

type ChatProps = {
  id: string;
  user_id: string;
  chat_name: string;
};

const ChatUI = ({ chatMessages, uuid, user_id, chats }: ChatUIProps) => {
  const router = useRouter();

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    preview,
    code,
    setPreview,
    handlePreview,
    stop,
    isLoading,
    chatList,
    setChatList
  } = useChat({ chats, chatMessages, uuid, user_id });

  return (
    <div className="flex flex-row flex-1 h-screen">
      <Sidebar chats={chatList} setChatList={setChatList} messages={messages} setMessages={setMessages}/>
      <div className="flex flex-1 gap-6 p-6">
        <div className="flex flex-col flex-1 basis-2/5 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Chat</h2>
            <UserButton afterSignOutUrl="/" />
          </div>
          <ScrollArea className="flex-1 mb-4">
            <div className="flex flex-col gap-4">
              {messages.map((c, index) => (
                <div key={index}>
                  {c.role == "user" ? (
                    <div className="p-3 rounded-lg bg-gray-100">
                      {c.content}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-white border border-gray-200 text-md ">
                      <MemoizedMarkdown c={c.content} />
                    </div>
                  )}

                  {c.role === "assistant" && (
                    <div className="mt-2 space-x-2">
                      <button
                        className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        onClick={() => navigator.clipboard.writeText(c.content)}
                      >
                        Copy
                      </button>
                      <button
                        className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        onClick={() => handlePreview(c.content)}
                      >
                        Preview
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              className="flex-1 border-gray-300"
              placeholder="Ask me anything..."
            />
            {isLoading && <Button
              type="button"
              onClick={() => stop()}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Stop
            </Button>}
            
          </form>
        </div>
        {preview && (
          <div className="flex-1 basis-3/5 rounded-lg shadow-lg overflow-hidden">
            <div className="h-full rounded-lg overflow-hidden flex flex-col">
              <div className="bg-black text-white p-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="flex space-x-2">
                  <button onClick={() => setPreview(false)}>
                    <CircleX />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                {code?.startsWith("<!DOCTYPE html>") ? (
                  <IFrame srcDoc={code}></IFrame>
                ) : (
                  <IFrame src="http://localhost:3000"></IFrame>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;
