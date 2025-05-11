'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCallback, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { CircleStop } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/clerk-react';
import { useQueryClient } from '@tanstack/react-query';
import { type Chat } from '@/lib/types';
import { toast } from 'sonner';
export const ChatInput = ({
  initialMessages,
  chatid,
}: {
  initialMessages: any;
  chatid: string;
}) => {
  const router = useRouter();
  const { userId } = useAuth();
  const [model, setModel] = useState<string>(
    localStorage.getItem('model') || 'internvl3-2b',
  );

  const queryClient = useQueryClient();

  const { input, messages, handleInputChange, handleSubmit, stop, status } =
    useChat({
      id: chatid,
      initialMessages: initialMessages,
      api: '/api/chat',
      body: {
        id: chatid,
        model: model,
      },
      onFinish: async () => {
        if (messages.length === 0) {
          queryClient.invalidateQueries({
            queryKey: ['chats', userId],
          });
        }
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  const customHandleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status !== 'ready' && status !== 'error') {
        return;
      }

      window.history.pushState(null, '', `/chat/${chatid}`);

      if (messages.length === 0) {
      queryClient.setQueryData(['chats', userId], (oldData: Chat[]) => {
        if (oldData) {
          return [{ id: chatid, title: 'New Chat' },...oldData];
        }
        return [{ id: chatid, title: 'New Chat' }];
      });
    }
      handleSubmit();
    },
    [handleSubmit, messages.length, queryClient, router, userId],
  );

  const handleModelChange = useCallback((model: string) => {
    localStorage.setItem('model', model);
    setModel(model);
  }, []);
  return (
    <div className="sticky inset-x-0 bottom-0 bg-[var(--card)] rounded-tl-2xl rounded-tr-2xl border border-white/10 drop-shadow-lg">
      <form onSubmit={customHandleSubmit}>
        <fieldset className="space-y-2 p-4 text-sm outline-none ">
          <div className="flex flex-col gap-2">
            <textarea
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  (e.target as HTMLTextAreaElement).form?.requestSubmit();
                }
              }}
              autoFocus
              value={input}
              onChange={handleInputChange}
              className="w-full outline-none resize-none custom-scrollbar bg-[var(--card)] text-foreground placeholder:text-muted-foreground"
              placeholder="Ask me a question"
            />
            <div className="flex justify-between items-center ">
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger className="w-[180px] ">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internvl3-2b">Internvl 3.2B</SelectItem>
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
                  <button
                    onClick={stop}
                    className="rounded-custom bg-destructive/10 hover:bg-destructive/20 transition-colors"
                  >
                    <CircleStop className="text-destructive" />
                  </button>
              )}
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
