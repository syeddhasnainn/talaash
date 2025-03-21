"use client";
import { Trash } from "lucide-react";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { deleteAllItems } from "@/utils/indexed-db";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useChatContext } from "@/context/ChatContext";
export function NavUser() {
  const router = useRouter();
  const handleClearAllChats = async () => {
    await deleteAllItems();
    mutate("sidebarChats");
    router.push("/chat");
  };

    const { systemPrompt, setSystemPrompt } = useChatContext();

    const handleSystemPromptChange = (e:any)=> {
      setSystemPrompt(e.target.value);
    }
  return (
    <SidebarMenu>
      <SidebarMenuItem className="pb-1 px-1 space-y-3">
        <div className="space-y-2">
          <textarea 
            id="system-prompt"
            value={systemPrompt} 
            onChange={handleSystemPromptChange} 
            rows={6} 
            className="w-full rounded-lg bg-gray-100/80 text-sm p-3 
                     border border-gray-200 hover:border-gray-300
                     transition-all resize-none outline-none
                     placeholder:text-gray-400"
            name="system-prompt" 
            placeholder="Customize AI behavior with your system prompt..." 
          />
        </div>
        <Button
          onClick={handleClearAllChats}
          className="w-full justify-start gap-2 text-gray-600 hover:text-red-600 
                     transition-colors group"
          variant="ghost"
        >
          <Trash className="h-4 w-4 text-gray-500 group-hover:text-red-500 
                           transition-colors" />
          Delete all chats
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
