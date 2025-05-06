import Chat from '@/components/chat';
export const dynamic = 'force-dynamic';

export default async function ChatPage() {
  const chatid = crypto.randomUUID();
  console.log('new chat page: ', chatid);

  return <Chat chatid={chatid} initialMessages={[]} />;
}
