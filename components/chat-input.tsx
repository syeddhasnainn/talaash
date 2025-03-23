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
    <div className="sticky inset-x-0 bottom-0 bg-[#121212] ">
      <form onKeyDown={handleSubmit}>
        <fieldset className="space-y-2 p-4 border-t  text-sm border-white/40 rounded-custom outline-none shadow-sm">
          <div className="flex flex-col gap-2">
            <textarea
              rows={3}
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              className="w-full outline-none resize-none custom-scrollbar bg-[#121212]"
              placeholder="Ask me a question"
            />
            <div className="flex justify-between items-center">
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qwen25groq">Qwen 2.5 32B Groq</SelectItem>

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
              <div>
                <button className="border border-white/10 px-3 py-1 rounded-custom bg-[#ea5a2e]">
                  Send
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
