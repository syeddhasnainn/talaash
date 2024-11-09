import { getChats, getMessages } from "@/actions/actions";
import ChatUI from "@/components/chat-ui";
import Sidebar from "@/components/sidebar";
import {ChatUIV2} from '@/components/chat-ui-v2'
type PageProps = {
  params: { id: string };
};

export default async function Chat({ params }: PageProps) {
  const user = "123456789";
  const chatMessages = await getMessages(params.id);
  const chats = await getChats(user);

  return (
    <div className="flex min-h-screen w-full">
      <ChatUIV2
        chats={chats}
        chatMessages={chatMessages}
        uuid={params.id}
        user_id={user}
      />
    </div>
  );
}
