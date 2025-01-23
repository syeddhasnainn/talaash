"use client";

import { ChatInput } from "@/components/chat-input";
import { Markdown } from "@/components/markdown";
import { SidebarComponent } from "@/components/sidebar-component";
import { Spinner } from "@/components/spinner";
import { useChatContext } from "@/context/ChatContext";
import { getChat } from "@/utils/indexed-db";
import useSWR from "swr";

export default function Chat() {
  const { isPending, id, conversation, setConversation } = useChatContext();

  const fetchChat = async () => {
    const { messages } = await getChat(id);
    return messages;
  };

  const { data } = useSWR(id ? `chat-${id}` : null, fetchChat, {
    fallbackData: [],
    onSuccess: (data) => {
      setConversation(data);
    },
  });

  return (
    <div className="flex h-[100dvh]">
      <SidebarComponent />
      <div className="flex-1 relative">
        <div className="h-full overflow-y-auto">
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

        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-2xl mx-auto">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
