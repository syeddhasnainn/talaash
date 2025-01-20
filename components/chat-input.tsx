"use client";

import { useChat } from "@/hooks/use-chat";

export const ChatInput = () => {
  const { handleSubmit, inputRef } = useChat();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white">
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            ref={inputRef}
            className="w-full p-4 border border-gray-300 rounded-custom outline-none shadow-sm"
            placeholder="Ask me a question"
            type="text"
          />
        </form>
      </div>
    </div>
  );
};
