import { getMessages } from '@/actions/messageActions';
import Chat from '@/components/chat';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messages = await getMessages(id);
  return <Chat chatid={id} initialMessages={messages} />;
}
