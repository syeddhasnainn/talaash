import { Markdown } from "@/components/markdown";
import { Spinner } from "@/components/spinner";
import { useChatContext } from "@/context/ChatContext";
import { useEffect } from "react";
import { useRef } from "react";

export function ChatMessages() {
  const { isPending, conversation } = useChatContext();
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div ref={messagesRef} className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4 p-6 pb-32">
          {conversation &&
            conversation.map((message, index) =>
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
    </div>
  );
}
