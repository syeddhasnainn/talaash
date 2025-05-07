'use client';

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Geist_Mono } from 'next/font/google';

const font = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              {/* <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-3" /> 
              </div> */}
              <span
                className={`truncate font-medium text-md tracking-wider ${font.className}`}
              >
                TALAASH
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
