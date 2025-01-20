"use client";

import { SidebarComponent } from "@/components/sidebar-component";
import { useChatContext } from "@/context/ChatContext";
export default function Chat() {
  const { handleSubmit, inputRef } = useChatContext();

  return (
    <div className="flex h-[100dvh]">
      {/* <SidebarComponent /> */}
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto relative">
        {" "}
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
      </div>
    </div>
  );
}
