"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { UserButton } from "@clerk/nextjs";

export default function CreateChat({ chats, firstName }: any) {
  const router = useRouter();
  const [chatList, setChatList] = useState(chats);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      <div className="absolute right-4 top-4 ">
        <UserButton afterSignOutUrl="/" />
      </div>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-2xl text-center text-gray-700 mb-6 font-normal">
            {`Welcome ${firstName}`}
          </p>

          <Button
            onClick={() => {
              const uuid = uuidv4();
              router.push(`/chat/${uuid}`);
            }}
            className="w-full mb-6 bg-black text-white hover:bg-gray-800"
          >
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Recent Chats
            </h3>
            <ul className="space-y-2">
              {chatList.map((chat, index) => (
                <li
                  onClick={() => router.push(`/chat/${chat.id}`)}
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <span className="text-sm text-gray-700">
                    {chat.chat_name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
