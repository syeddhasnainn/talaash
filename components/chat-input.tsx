"use client";

import { useChatContext } from "@/context/ChatContext";

export const ChatInput = () => {
  const { handleSubmit, inputRef } = useChatContext();

  return (
    <div className="sticky inset-x-0 bottom-0 bg-white pb-2">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="w-full p-4 border text-sm border-gray-300 rounded-custom outline-none shadow-sm"
          placeholder="Ask me a question"
          type="text"
        />
      </form>
      <div className="text-center text-xs mt-2 text-gray-500">
        AI can make mistakes. Consider checking important information.
      </div>
    </div>
  );
};
