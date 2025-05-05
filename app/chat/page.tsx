import Chat from '@/components/chat';

export default async function ChatPage() {
  const chatid = crypto.randomUUID();

  return <Chat chatid={chatid} initialMessages={[]} />;
}
