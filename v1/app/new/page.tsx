import { createUser, getChats, getUser } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { PaperclipIcon, ImageIcon, RotateCcw } from "lucide-react";

export default async function Chat() {
  const user = "123456789";
  const user_id = user;
  const loggedInUser = await getUser(user_id);
  const firstName = "John"; // Replace with actual user's name

  if (loggedInUser.length == 0) {
    await createUser(user_id);
  }

  let chatList: Array<{ id: string; user_id: string }> = [];
  try {
    chatList = await getChats(user_id);
    chatList = chatList.slice(0, 6);
  } catch {
    console.log("Err: No Chat found OR no table in DB!");
  }

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto px-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="relative">
            <textarea 
              className="w-full bg-[#393937] text-[#E6E6E3] p-6 rounded-xl resize-none h-[120px] outline-none"
              placeholder="Ask me something!"
            />
            <div className="absolute right-4 bottom-4 flex gap-2">
              <Button variant="ghost" size="icon" className="text-[#E6E6E3] hover:bg-[#4A4A47]">
                <PaperclipIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#E6E6E3] hover:bg-[#4A4A47]">
                <ImageIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

        </div>
      </div>

    
    </div>
  );
}
