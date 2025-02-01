import { Markdown } from "@/components/markdown";
import { Spinner } from "@/components/spinner";
import { useChatContext } from "@/context/ChatContext";
import { useEffect, useRef } from "react";

export function ChatMessages() {
  const { isPending, conversation } = useChatContext();
  const messagesRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={messagesRef} className=" space-y-4 py-6 pb-8">
      {conversation &&
        conversation.map((message, index) =>
          message.role === "user" ? (
            <div
              key={index}
              className="max-w-xs ml-auto border border-gray-300 text-black p-4 shadow-sm rounded-custom"
            >
              {message.content}
            </div>
          ) : (
            <div
              key={index}
              className="max-w-2xl border bg-gray-50 border-gray-300 p-4 rounded-custom shadow-sm"
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
  );
}
