"use client";

import { useChatContext } from "@/context/ChatContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const ChatInput = () => {
  const { handleSubmit, inputRef, model, handleModelChange } = useChatContext();

  return (
    <div className="sticky inset-x-0 bottom-0 bg-white pb-2">
      <form onSubmit={handleSubmit}>
        <fieldset className="space-y-2 p-4 border text-sm border-gray-300 rounded-custom outline-none shadow-sm">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              className="w-full outline-none h-10"
              placeholder="Ask me a question"
              type="text"
            />
            <Select value={model} onValueChange={handleModelChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llama3">Llama 3.3 70B</SelectItem>
                <SelectItem value="deepseek">Deepseek V3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </fieldset>
      </form>
      <div className="text-center text-xs mt-2 text-gray-500">
        AI can make mistakes. Consider checking important information.
      </div>
    </div>
  );
};
