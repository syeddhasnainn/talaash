import React from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import MemoizedMarkdown from "./markdown";
import Spinner from "./spinner";
import { useChatContext } from "./chat-provider";

export const ChatMessages: React.FC = () => {
  const { messages, isLoading, handlePreview } = useChatContext();

  return (
    <ScrollArea className="flex-1 mb-4">
      <div className="flex flex-col gap-4">
        {messages.map((c, index) => (
          <div key={index}>
            {c.role == "user" ? (
              <div className="p-3 rounded-xl  bg-[#21201C]  text-white">
                {typeof c.content == "object" ? c.content[0].text : c.content}
              </div>
            ) : (
              <div className="text-white p-3 rounded-xl bg-[#373634] bordertext-md ">
                <MemoizedMarkdown c={c.content} />
              </div>
            )}
          </div>
        ))}
        {isLoading && <Spinner />}
      </div>
    </ScrollArea>
  );
};
