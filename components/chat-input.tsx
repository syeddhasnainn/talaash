"use client";

import { useChatContext } from "@/context/ChatContext";

export const ChatInput = () => {
  const { handleSubmit, inputRef } = useChatContext();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Coding
          </button>
          <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Explain
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            ref={inputRef}
            className="w-full p-4 border border-gray-300 rounded-custom outline-none shadow-sm"
            placeholder="Ask me a question"
            type="text"
          />
        </form>
        <div className="text-center text-xs mt-2 text-gray-500">
          AI can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};
