'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { CircleStop } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ChatInput = ({ chatid }: { chatid: string }) => {
  const router = useRouter();

  const [model, setModel] = useState<string>('llama3.1');

  const { input, handleInputChange, handleSubmit, stop, status } = useChat({
    id: chatid,
    api: '/api/chat',
    body: {
      id: chatid,
      model: model,
    },
  });

  const customHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.replace(`/chat/${chatid}`);
    handleSubmit();
  };

  const handleModelChange = (model: string) => {
    setModel(model);
  };
  return (
    <div className="sticky inset-x-0 bottom-0 bg-base-50 rounded-tl-sm rounded-tr-sm border border-black/20">
      <form onSubmit={customHandleSubmit}>
        <fieldset className="space-y-2 p-4 text-sm outline-none ">
          <div className="flex flex-col gap-2">
            <textarea
              disabled={status === 'streaming'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  (e.target as HTMLTextAreaElement).form?.requestSubmit();
                }
              }}
              autoFocus
              value={input}
              onChange={handleInputChange}
              className="w-full outline-none placeholder:text-base-500 resize-none custom-scrollbar bg-base-50 text-foreground placeholder:text-muted-foreground"
              placeholder="Ask me a question"
            />
            <div className="flex justify-between items-center ">
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger className="w-[180px] ">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3.1">
                    Llama 3.1 8B Instruct Turbo
                  </SelectItem>
                  <SelectItem value="deepseek3">Deepseek V3</SelectItem>
                  <SelectItem value="deepseekr1-together">
                    Deepseek R1
                  </SelectItem>
                  <SelectItem value="qwen3-30b">Qwen3 30B</SelectItem>
                  <SelectItem value="qwen3-235b-fp8-tput">
                    Qwen3 235B FP8
                  </SelectItem>
                  <SelectItem value="qwen25groq">Qwen 2.5 32B Groq</SelectItem>
                  <SelectItem value="llama3">Llama 3.3 70B</SelectItem>
                  <SelectItem value="qwen32">
                    Qwen 2.5 Coder 32B Instruct
                  </SelectItem>
                  <SelectItem value="qwen72">
                    Qwen2.5 72B Instruct Turbo
                  </SelectItem>
                </SelectContent>
              </Select>
              {status !== 'ready' && status !== 'error' && (
                <div>
                  <button
                    onClick={stop}
                    className="rounded-custom bg-destructive/10 hover:bg-destructive/20 transition-colors"
                  >
                    <CircleStop className="text-destructive" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
