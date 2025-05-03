'use client';

import { ChatInput } from '@/components/chat-input';
import { ChatMessages } from '@/components/chat-messages';
// import { getChat } from '@/utils/indexed-db';
// import useSWR from 'swr';
import Head from 'next/head';
export default function Chat() {
  // const fetchChat = async () => {
  //   const { messages } = await getChat(id);
  //   return messages;
  // };

  // const { data } = useSWR(`chat-${id}`, fetchChat, {
  //   onSuccess: (data) => {
  //     setConversation(data);
  //   },
  // });

  return (
    <>
      <Head>
        <title>Hello Chat</title>
      </Head>
      <div className="flex h-[100dvh] relative overflow-auto custom-scrollbar">
      <div className="mx-auto flex max-w-3xl  p-4 flex-col justify-between w-full">
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
    </>
  
  );
}
