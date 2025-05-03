'use client';

import { Plus } from 'lucide-react';

import { Collapsible } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useChat } from '@ai-sdk/react';

const items = [
  {
    title: 'New Chat',
    url: '/chat',
    icon: Plus,
    isActive: true,
  },
];

export function SidebarNewChat() {
  const router = useRouter();
  const { setMessages } = useChat({
    id: 'chat',
    api: '/api/chat',
  });
  const handleNewChat = () => {
    setMessages([]);
    router.push('/chat');
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
                className="outline outline-1 rounded-sm"
              >
                <Button
                  className="bg-primary-400 hover:bg-primary-500 border-none outline-none py-4 text-black font-normal"
                  variant="ghost"
                  onClick={handleNewChat}
                >
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
