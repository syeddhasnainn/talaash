"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatContext } from "@/context/ChatContext";
import { deleteAllItems, getAllItems } from "@/utils/indexed-db";
import { Settings, SquarePen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

export const SidebarComponent = () => {
  const { id, setConversation, setIsNewChat } = useChatContext();
  const router = useRouter();

  const getAllChats = async () => {
    const chats = await getAllItems();
    const filteredChats = chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
    }));
    return filteredChats;
  };

  const { data: sidebarChats } = useSWR("sidebarChats", getAllChats, {
    fallbackData: [],
  });

  const handleClearAllChats = async () => {
    await deleteAllItems();
    mutate("sidebarChats");
    router.push("/chat");
  };

  const handleNewChat = () => {
    setConversation([]);
    router.push("/chat");
  };

  return (
    <nav className="hidden md:flex h-full w-[280px] flex-col bg-sidebar border-r">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold tracking-tight">TALAASH</h2>

        <Button
          onClick={handleNewChat}
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-sidebar-accent/50 transition-colors"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1.5">
          {sidebarChats?.length > 0 ? (
            sidebarChats?.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setIsNewChat(false);
                  router.push(`/chat/${chat.id}`);
                }}
                className={`group flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-gray-200/30 transition-all hover:shadow-sm ${
                  id === chat.id
                    ? "bg-sidebar-accent shadow-sm"
                    : "bg-sidebar-accent/20"
                }`}
              >
                <span className="text-sm line-clamp-1 flex-1 font-medium">
                  {chat.title}
                </span>
              </button>
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
