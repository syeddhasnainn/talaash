"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { deleteChats } from "@/actions/actions";
import { Trash2 } from "lucide-react";
import { useChatContext } from "./chat-provider";

export default memo(function Sidebar() {
  const router = useRouter();

  const { chatList, setChatList, setMessages  } = useChatContext();


  const handleDelete = async (chat_id:string) => {
    await deleteChats(chat_id);
    const updatedChats = chatList.filter((chat: { id: string; }) => chat.id !== chat_id);
    const uuid = uuidv4()
    setChatList(updatedChats);
    setMessages([])
    router.push(`/chat/${uuid}`)
};
  return (
    <>
      <nav className="w-64  border-r border-gray-200">
        <ScrollArea className="h-full px-4 py-6">
          <Button
            onClick={() => router.push(`/chat/${uuidv4()}`)}
            className="w-full mb-4 bg-black text-white hover:bg-gray-800"
          >
            New Chat
          </Button>
          <ul className="space-y-2">
            {chatList.map((chat) => (
              <div key={chat.id} className="flex justify-between">
                <li
                  
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer text-sm text-gray-700"
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  {chat.chat_name}
                </li>
                <button
                  onClick={() => handleDelete(chat.id)}
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer text-sm text-gray-700"
                >
                  <Trash2 className="w-4" />
                </button>
              </div>
            ))}
          </ul>
          {/* <Button
            onClick={() => router.push(`/chat/${uuidv4()}`)}
            className="w-full mt-4 bg-black text-white hover:bg-gray-800"
          >
            Clear All
          </Button> */}
        </ScrollArea>
      </nav>
    </>
  );
});
