"use client";

import { useChat } from "@/hooks/use-chat";
import Markdown from "@/components/markdown";
import { Spinner } from "@/components/spinner";
export const ChatComponent = () => {
  const { conversation, setQuestion, handleSubmit, isPending, question } =
    useChat();

  return (
    <div className="flex flex-col space-y-4 py-4 mb-12">
      <div className="space-y-4">
        {conversation.map((message, index) =>
          message.role === "user" ? (
            <div
              className="max-w-xs border  border-gray-300 text-black p-4 shadow-sm rounded-custom"
              key={index}
            >
              {message.content}
            </div>
          ) : (
            <div
              className=" p-4 rounded-custom border bg-gray-50 border-gray-300 shadow-sm"
              key={index}
            >
              {isPending ? (
                <Spinner size="xs" />
              ) : (
                <Markdown>{message.content}</Markdown>
              )}
            </div>
          )
        )}
      </div>

      <div className="sticky bottom-0 py-4">
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-4 border fixed bottom-0 inset-x-0 max-w-2xl mx-auto mb-4 border-gray-300 rounded-custom outline-none bg-white shadow-sm"
            placeholder="Ask me a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
          />
        </form>
      </div>
    </div>
  );
};
