'use client';
import { getMessages } from '@/actions/messageActions';
import Chat from '@/components/chat';
import { Message } from '@/lib/types';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';

export default function ChatIdPage() {
  const { id } = useParams();
  console.log('id from chat page:',id);
  const [messages, setMessages] = useState<any>([]);
  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(id as string);
      console.log(messages);
      setMessages(messages);
    };
    fetchMessages();
  }, [id]);

  return  <Chat chatid={id as string} initialMessages={messages} />;
}
