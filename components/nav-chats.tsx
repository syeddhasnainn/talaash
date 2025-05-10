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
import { fetchUserChats } from '@/actions/chatActions';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';

export function SidebarChats() {
  const { isMobile } = useSidebar();
  const { userId } = useAuth();
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats', userId],
    queryFn: () => fetchUserChats(userId!),
    staleTime: 60 * 60 * 1000,
  });
  const chatid = usePathname().split('/')[2];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden scrollbar-hide">
      <SidebarGroupLabel>Recent</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? (
          <SidebarMenuButton asChild>
            <span>
              <Spinner size="xs" />
            </span>
          </SidebarMenuButton>
        ) : (
          chats.map((item: any) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                className={`${
                  chatid === item.id ? 'rounded-lg bg-[var(--primary-foreground)] border border-white/10 drop-shadow-md' : ''
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
