"use client";

import { Plus } from "lucide-react";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/context/ChatContext";
import { Button } from "./ui/button";

const items = [
  {
    title: "New Chat",
    url: "/chat",
    icon: Plus,
    isActive: true,
  },
];

export function SidebarNewChat() {
  const { setConversation } = useChatContext();
  const router = useRouter();

  const handleNewChat = () => {
    setConversation([]);
    router.push("/chat");
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="outline outline-1 rounded-lg"
              >
                <Button variant="ghost" onClick={handleNewChat}>
                  <item.icon />
                  <span>{item.title}</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>

      
    </SidebarGroup>
  );
}
