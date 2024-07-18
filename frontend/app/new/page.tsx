import { currentUser } from "@clerk/nextjs/server"
import { getUser, createUser } from "@/actions/actions"
import {Search} from "@/components/ui/search"
import ChatHistory from "@/components/ui/chat-history"

export default async function Chat() {
    const user = await currentUser().then(resp => resp?.id) as string
    const loggedInUser = await getUser(user)

    if (loggedInUser.length == 0) {
        await createUser(user)
    }

    return (
        <div>
            <Search />
            <ChatHistory />
        </div>
    )
}