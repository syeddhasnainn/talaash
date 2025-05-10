'use client';
// import { usePathname } from 'next/navigation';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';

export default function Chat({
  chatid,
  initialMessages,
}: {
  chatid: string;
  initialMessages: any;
}) {
  // const chatid = usePathname().split('/')[2] || crypto.randomUUID();

  return (
    <div className="flex h-[100dvh] relative overflow-auto custom-scrollbar">
      <div className="mx-auto flex max-w-3xl flex-col justify-between w-full">
        <ChatMessages chatid={chatid} initialMessages={initialMessages} />
        <ChatInput chatid={chatid} />
      </div>
    </div>
  );
}
