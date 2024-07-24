import { createUser, getChats, getUser } from "@/actions/actions"
import ChatHistory from "@/components/chat-history"
import { Search } from "@/components/search"
import { currentUser } from "@clerk/nextjs/server"

export default async function Chat() {
    const user = await currentUser().then(resp => resp?.id) as string
    const loggedInUser = await getUser(user)
    console.log('user', loggedInUser)

    if (loggedInUser.length == 0) {
        await createUser(user)
    }

    let chatList: Array<{ id: string, user_id: string }> = []

    try {
        chatList = await getChats(user);

    } catch {
        console.log('Err: No Chat found OR no table in DB!');
    }

    return (
        <div className="flex flex-col max-w-md gap-4 mx-auto pt-96">

            <Search user_id={user} />
            <ChatHistory chatList={chatList} />
        </div>
    )
}