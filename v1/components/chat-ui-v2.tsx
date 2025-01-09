'use client'
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';
import { ChatProvider } from './chat-provider';
import Sidebar from './sidebar';

interface ChatUIProps {
    chatMessages: any;
    uuid: string;
    user_id: string;
    chats: ChatProps[];
}

type ChatProps = {
    id: string;
    user_id: string;
    chat_name: string;
};

export const ChatUIV2 = ({ chatMessages, uuid, user_id, chats }: ChatUIProps) => {

    return (
        <ChatProvider initialMessages={chatMessages} uuid={uuid} userId={user_id} initialChats={chats}>
            <div className="flex flex-row flex-1 h-screen relative">
                {/* <Sidebar /> */}
                <div className="flex flex-1">
                    <div className="flex flex-col flex-1 basis-2/5 max-w-3xl mx-auto px-6 pt-6">
                        {/* <ChatHeader /> */}
                        <ChatMessages />
                        <ChatInput />
                    </div>
                </div>
            </div>
        </ChatProvider>
    )
}
