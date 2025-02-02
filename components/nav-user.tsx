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
      <SidebarMenuItem className="pb-1 px-1">
        <textarea value={systemPrompt} onChange={handleSystemPromptChange} rows={6} className="resize-none w-full rounded-md bg-gray-200/60 outline-none text-sm p-1" name="system-prompt" placeholder="Enter your system prompt here..." ></textarea>
        <Button
          onClick={handleClearAllChats}
          className="w-full justify-start items-start"
          variant="ghost"
        >
          <Trash />
          Delete all chats
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
