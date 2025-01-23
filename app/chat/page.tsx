import { ChatInput } from "@/components/chat-input";
import { SidebarComponent } from "@/components/sidebar-component";
export default function Chat() {
  return (
    <div className="flex h-[100dvh]">
      
      <SidebarComponent />
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto relative">
        <ChatInput />
      </div>
    </div>
  );
}
