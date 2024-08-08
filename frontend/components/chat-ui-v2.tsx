import React from 'react'
import { ChatProvider } from './chat-provider';
import Sidebar from './sidebar'
import { ChatMessages } from './chat-messages'
import { ChatHeader } from './chat-header'
import { ChatInput } from './chat-input';
import { CodePreview } from './chat-preview';

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
                <div className="flex flex-1 gap-6 p-6">
                    <div className="flex flex-col flex-1 basis-2/5 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                        <ChatHeader />
                        <ChatMessages />
                        <ChatInput />
                    </div>
                    <CodePreview />
                </div>
            </div>
        </ChatProvider>
    )
}
