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
import Link from 'next/link';

const items = [
  {
    title: 'New Chat',
    url: '/chat',
    icon: Plus,
    isActive: true,
  },
];

export function SidebarNewChat() {

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
                  <Link href={item.url}>
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
