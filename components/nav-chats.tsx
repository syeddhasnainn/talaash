'use client';
import Link from 'next/link';

import {
  ArrowUpRight,
  Link as LinkIcon,
  MoreHorizontal,
  StarOff,
  Trash2,
} from 'lucide-react';

import { Spinner } from '@/components/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
// import { useState } from 'react';
// import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getAllChats } from '@/actions/chatActions';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function SidebarChats() {
  const { isMobile } = useSidebar();

  // const getAllChats = async () => {
  //   const chats = await getAllChats();
  //   const filteredChats = chats.map((chat) => ({
  //     id: chat.id,
  //     title: chat.title,
  //   }));
  //   return filteredChats;
  // };

  // const fetchSidebarChats = async ()=> {
  //   const chats = await getAllChats();
  //   const filteredChats = chats.map((chat) => ({
  //     id: chat.id,
  //     title: chat.title,
  //   }));
  //   return filteredChats;
  // }

  const { data: sidebarChats } = useSWR('sidebarchats', getAllChats, {
    fallbackData: [],
    onError(err, key, config) {
      console.log(err);
    },
    onSuccess(data, key, config) {
      console.log(data);
    },
  });

  const chatid = usePathname().split('/')[2];
  console.log(chatid);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden scrollbar-hide">
      <SidebarGroupLabel>Recent</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarChats.length === 0 ? (
          <SidebarMenuButton asChild>
            <span>
              <Spinner size="xs" />
            </span>
          </SidebarMenuButton>
        ) : (
          sidebarChats.map((item: any) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                className={`${
                  chatid === item.id ? 'rounded-sm bg-base-100' : ''
                }`}
              >
                <Link
                  // prefetch={true}
                  href={`/chat/${item.id}`}
                  title={item.title}
                >
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <StarOff className="text-muted-foreground" />
                    <span>Remove from Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LinkIcon className="text-muted-foreground" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowUpRight className="text-muted-foreground" />
                    <span>Open in New Tab</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
