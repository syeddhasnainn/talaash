'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SidebarChats } from './nav-chats';
import { SidebarLogo } from './nav-logo';
import { SidebarNewChat } from './nav-main';
import { NavUser } from './nav-user';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r border-border bg-sidebar text-sidebar-foreground" {...props}>
      <SidebarHeader>
        <SidebarLogo />
        <SidebarNewChat />
      </SidebarHeader>
      <SidebarContent>
        <SidebarChats />
      </SidebarContent>
      <NavUser />
      <SidebarRail />
    </Sidebar>
  );
}
