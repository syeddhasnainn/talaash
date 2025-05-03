import Chat from '@/components/chat';

export default function ChatPage() {
  const chatid = crypto.randomUUID();
  return <Chat chatid={chatid} initialMessages={[]} />;
}
