import { createUser, getChats, getUser } from "@/actions/actions";
import CreateChat from "@/components/create-chat";
import { currentUser } from "@clerk/nextjs/server";

export default async function Chat() {
  const user = await currentUser().then((resp) => resp);
  const user_id = user?.id as string;
  const loggedInUser = await getUser(user_id);
  const firstName = user?.firstName;

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

  return <CreateChat chats={chatList} firstName={firstName} />;
}
