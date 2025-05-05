import { getMessages } from '@/actions/messageActions';
import Chat from '@/components/chat';

export default async function ChatPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const messages = await getMessages(id);
  return <Chat chatid={id} initialMessages={messages} />;
}
