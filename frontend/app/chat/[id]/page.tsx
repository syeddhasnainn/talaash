import { getChats, getMessages } from "@/actions/actions"
import { currentUser } from "@clerk/nextjs/server"
import Sidebar from "@/components/sidebar"
import ChatUI from "@/components/chat-ui"

type PageProps = {
    params: { id: string };
}


export default async function Chat({ params }: PageProps) {

    const user = await currentUser().then(resp => resp?.id) as string
    const chatMessages = await getMessages(params.id)
    const chats = await getChats(user)


    return (
        <div className="flex min-h-screen w-full">
            {/* <Sidebar chats={chats}/>
            <Messages chats={chats} chatMessages={chatMessages} uuid={params.id} user_id={user}/> */}
            <ChatUI chats={chats} chatMessages={chatMessages} uuid={params.id} user_id={user} />
        </div>
    )
}