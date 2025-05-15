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
import {Link} from 'react-router';

const items = [
  {
    title: 'New Chat',
    url: '/',
    icon: Plus,
    isActive: true,
  },
];

export function SidebarNewChat() {
  const { setMessages } = useChat({
    id: 'chat',
    api: '/api/chat',
  });
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
                >
                  <item.icon />
                  <Link
                    onClick={() => {
                      setMessages([]);
                    }}
                    to={item.url}
                  >
                    <span>{item.title}</span>
                  </Link>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
