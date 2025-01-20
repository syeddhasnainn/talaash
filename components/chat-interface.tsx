"use client";

import { useChat } from "@/hooks/use-chat";
import { Markdown } from "@/components/markdown";
import { Spinner } from "@/components/spinner";

export const ChatInterface = () => {
  const { conversation, isPending } = useChat();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 p-6 pb-32">
        {conversation.map((message, index) =>
          message.role === "user" ? (
            <div
              className="max-w-xs ml-auto border border-gray-300 text-black p-4 shadow-sm rounded-custom"
              key={index}
            >
              {message.content}
            </div>
          ) : (
            <div
              className="max-w-2xl border bg-gray-50 border-gray-300 p-4 rounded-custom shadow-sm"
              key={index}
            >
              <Markdown>{message.content}</Markdown>
            </div>
          )
        )}

        {isPending && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};
