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
    router.push('/chat');
    setMessages([]);
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
                className="rounded-sm"
              >
                <Button
                  className="rounded-lg text-[var(--primary-foreground)] bg-[var(--primary)] drop-shadow-lg hover:bg-[var(--primary)]/ hover:text-[var(--primary-foreground)]"
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
