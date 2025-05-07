'use client';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { Trash, User } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/clerk-react';
import { deleteAllChats } from '@/actions/chatActions';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function NavUser() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  return (
    <SidebarMenu>
      <SidebarMenuItem className="pb-1 px-1 space-y-1 m-1 mb-2">
        <div className=" transition-colors space-y-2">
          <Button
            onClick={() => {
              deleteAllChats(user?.id);
              queryClient.invalidateQueries({
                queryKey: ['chats', user?.id],
              });
              toast.success('All chats deleted');
            }}
            className="rounded-lg w-full justify-start bg-card gap-2 border border-white/10 text-foreground hover:bg-red-600 hover:text-white 
                     transition-colors"
            variant="ghost"
          >
            <Trash className="h-4 w-4 " />
            Delete all chats
          </Button>

          <Button
            className="rounded-lg w-full justify-start bg-card gap-2 border border-white/10 text-foreground hover:text-white 
                     transition-colors"
            variant="ghost"
            asChild
          >
            <div>
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate">{user?.fullName}</span>

              <UserButton
                appearance={{
                  elements: {
                    userButtonTrigger:
                      'absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg focus:opacity-25 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
                    userButtonAvatarBox: 'hidden',
                    userButtonAvatarImage: 'hidden',
                  },
                }}
              />
            </div>
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
