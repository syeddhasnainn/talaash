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
import { mutate } from 'swr';
import { addMessage, getMessages } from '@/actions/messageActions';
// import { getChat } from '@/actions/chatActions';
// import { Message } from '@/lib/types';
import { addUser } from '@/actions/userActions';
import { addChat } from '@/actions/chatActions';
import { useRouter } from 'next/navigation';

export const ChatInput = () => {
  const router = useRouter();
  const id = usePathname().split('/')[2];

  const [model, setModel] = useState<string>(
    localStorage.getItem('model') || 'llama3.1',
  );

  const {
    input,
    handleInputChange,
    handleSubmit,
    stop,
    messages,
    status,
    setMessages,
  } = useChat({
    id: 'chat',
    api: '/api/chat',
  });

  useEffect(() => {
    if (!id) return;

    (async () => {
      const chat = await getMessages(id);
      const filteredChat = chat.map((message) => ({
        id: message.id.toString(),
        role: message.role as 'user' | 'assistant' | 'system',
        content: message.content,
      }));
      console.log('filteredChat', filteredChat);

      if (chat) setMessages(filteredChat);
    })();
  }, [id, setMessages]);

  const getChatTitle = async () => {
    const response = await fetch('/api/title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: input }),
    });

    const title = await response.json();
    return title;
  };

  const customHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let chatId = id;
    // const user = '0oTdkN4LWVxJSRjsqKW';

    if (!chatId) {
      chatId = crypto.randomUUID();
      router.replace(`/chat/${chatId}`);
      handleSubmit(undefined, {
        body: {
          id: chatId,
          model: model,
        },
      });
      getChatTitle()
        .then(async (resp) => {
          if (resp.title) {
            console.log('chat id  ', chatId);
            console.log('this is the title', resp.title);
            await addChat(chatId, '0oTdkN4LWVxJSRjsqKW', resp.title);

            mutate('sidebarchats');
          }
        })
        .catch((err) => {
          console.error('Failed to generate title', err);
        });
    } else {
      await addMessage('0oTdkN4LWVxJSRjsqKW', chatId, 'user', input);
      handleSubmit(undefined, {
        body: {
          id: chatId,
          model: model,
        },
      });
    }
  };

  const handleModelChange = (model: string) => {
    localStorage.setItem('model', model);
    setModel(model);
  };
  return (
    <div className="sticky inset-x-0 bottom-0 bg-background border-t border-border">
      <form onSubmit={customHandleSubmit}>
        <fieldset className="space-y-2 p-4 text-sm rounded-custom outline-none border-r border-l">
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
              className="w-full outline-none resize-none custom-scrollbar bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="Ask me a question"
            />
            <div className="flex justify-between items-center">
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger className="w-[180px]">
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
