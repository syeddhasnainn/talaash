"use client";
import { SquarePen, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { getAllItems } from "@/utils/indexed-db";
import { useEffect } from "react";

export const SidebarComponent = () => {
  const chats = [
    {
      id: 1,
      title: "chat 1",
    },
    {
      id: 2,
      title: "chat 2",
    },
    {
      id: 3,
      title: "chat 3",
    },
  ];

  //   useEffect(() => {
  //     const fetchChats = async () => {
  //       const chats = await getAllItems();
  //       console.log(chats);
  //     };
  //     fetchChats();
  //   }, []);

  return (
    <nav className="hidden md:flex flex-col">
      {/* Top Section */}
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-lg font-semibold tracking-tight">TALAASH</h2>
        <Link href="/chat">
          <SquarePen size={20} />
        </Link>
      </div>

      {/* Chat List Section */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full justify-start gap-2 px-2 bg-gray-100/60 hover:bg-gray-200 transition-colors"
            >
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{chat.title}</span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="mt-auto px-4 py-2">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>
    </nav>
  );
};
