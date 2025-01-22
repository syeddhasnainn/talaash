"use client";
import { SquarePen, Plus, Settings, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { deleteAllItems, getAllItems } from "@/utils/indexed-db";
import { useEffect, useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import { useRouter } from "next/navigation";

export const SidebarComponent = () => {
  const { id } = useChatContext();
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);

  const handleClearAllChats = async () => {
    await deleteAllItems();
    setChats([]);
    router.push("/chat");
  };

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getAllItems();
      const filteredChats = chats.map((c) => ({
        id: c.id,
        title: c.messages[0].content.slice(0, 30) + "...",
      }));
      setChats(filteredChats);
    };
    fetchChats();
  }, [id]);

  return (
    <nav className="hidden md:flex h-full w-[280px] flex-col bg-sidebar border-r">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold tracking-tight">TALAASH</h2>
        <Link href="/chat">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-sidebar-accent/50 transition-colors"
          >
            <SquarePen className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1.5">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className={`group flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-gray-200/30 transition-all hover:shadow-sm ${
                  id === chat.id
                    ? "bg-sidebar-accent shadow-sm"
                    : "bg-sidebar-accent/20"
                }`}
              >
                <span className="text-sm line-clamp-1 flex-1 font-medium">
                  {chat.title}
                </span>
              </Link>
            ))
          ) : (
            <div className="flex items-center justify-center text-sm text-muted-foreground h-12 bg-sidebar-accent/20 rounded-lg">
              No chats available
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t bg-sidebar p-3 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 h-9 px-3 hover:bg-gray-300/50 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm font-medium">Settings</span>
        </Button>
        <Button
          onClick={handleClearAllChats}
          variant="ghost"
          className="w-full justify-start gap-2 h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/20 transition-colors"
        >
          <Trash className="h-4 w-4" />
          <span className="text-sm font-medium">Clear all chats</span>
        </Button>
      </div>
    </nav>
  );
};
