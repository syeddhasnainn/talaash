import { createUser, getChats, getUser } from "@/actions/actions";
import CreateChat from "@/components/create-chat";

export default async function Chat() {
  const user = "123456789";
  const user_id = user;
  const loggedInUser = await getUser(user_id);
  const firstName = "John";

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
