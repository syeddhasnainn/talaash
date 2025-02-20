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
  const {
    handleSubmit,
    inputRef,
    model,
    handleModelChange,
    inputValue,
    handleInputChange,
  } = useChatContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="sticky inset-x-0 bottom-0 bg-white pb-2">
      <form onKeyDown={handleSubmit}>
        <fieldset className="space-y-2 p-4 border text-sm border-gray-300 rounded-custom outline-none shadow-sm">
          <div className="flex flex-col gap-2">
            <textarea
              rows={3}
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              className="w-full outline-none resize-none custom-scrollbar"
              placeholder="Ask me a question"
            />
            <Select value={model} onValueChange={handleModelChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llama3">Llama 3.3 70B</SelectItem>
                <SelectItem value="deepseek3">Deepseek V3</SelectItem>
                <SelectItem value="deepseekr1">Deepseek R1</SelectItem>
                <SelectItem value="qwen32">
                  Qwen 2.5 Coder 32B Instruct
                </SelectItem>
                <SelectItem value="qwen72">
                  Qwen2.5 72B Instruct Turbo
                </SelectItem>
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
