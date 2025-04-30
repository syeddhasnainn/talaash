'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { usePathname } from 'next/navigation';
import { CircleStop } from 'lucide-react';
import { addMessage, getChat } from '@/utils/indexed-db';
import { mutate } from 'swr';
export const ChatInput = () => {
  const id = usePathname().split('/')[2];
  const [model, setModel] = useState<string>(
    localStorage.getItem('model') || 'deepseek3',
  );

  const {
    input,
    handleInputChange,
    handleSubmit,
    stop,
    status,
    setMessages,
  } = useChat({
    id: 'chat',
    api: '/api/chat',
    body: {
      model: model,
    },
    onFinish: (message) => {
      addMessage(id, { role: 'assistant', content: message.content });
    }
  });

  useEffect(() => {
    if (!id) return;

    (async()=> {
      const chat = await getChat(id);
      if (chat) setMessages(chat.messages);
    })()

  }, [id, setMessages]);

  
  const customHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let chatId = id;

    if (!chatId) {
      chatId = crypto.randomUUID();
      window.history.replaceState({}, '', `/chat/${chatId}`);
      await addMessage(chatId, { role: 'user', content: input }, "test1233242");
    }
    await addMessage(chatId, { role: 'user', content: input });
    handleSubmit();

    mutate('sidebarchats');
  };

  const handleModelChange = (model: string) => {
    localStorage.setItem('model', model);
    setModel(model);
  };
  return (
    <div className="sticky inset-x-0 bottom-0 bg-[#121212] ">
      <form onSubmit={customHandleSubmit}>
        <fieldset className="space-y-2 p-4 border  text-sm border-white/10 rounded-custom outline-none shadow-sm">
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
              className="w-full outline-none resize-none custom-scrollbar bg-[#121212]"
              placeholder="Ask me a question"
            />
            <div className="flex justify-between items-center">
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
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
              {status && (
                <div>
                  <button
                    onClick={stop}
                    className="border border-white/10 rounded-custom"
                  >
                    <CircleStop className="bg-[#ea5a2e]" />
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
