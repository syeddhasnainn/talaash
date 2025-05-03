'use client';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="pb-1 px-1 space-y-1 m-1 mb-2">
        <div className="space-y-1">
          <textarea
            id="system-prompt"
            rows={6}
            className="w-full rounded-sm bg-base-50 text-sm p-3 
                     border border-base-200 hover:border-gray-300
                     transition-all resize-none outline-none
                     placeholder:text-gray-400"
            name="system-prompt"
            placeholder="Customize AI behavior with your system prompt..."
          />
        </div>
        <div className="hover:text-white transition-colors">
          <Button
            className="rounded-sm w-full justify-start bg-base-50 gap-2 border border-base-200 text-black hover:bg-red-600 hover:text-white 
                     transition-colors"
            variant="ghost"
          >
            <Trash className="h-4 w-4" />
            Delete all chats
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
