"use client";
import { Trash } from "lucide-react";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { deleteAllItems } from "@/utils/indexed-db";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
export function NavUser() {
  const router = useRouter();
  const handleClearAllChats = async () => {
    await deleteAllItems();
    mutate("sidebarChats");
    router.push("/chat");
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem className="pb-1">
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
