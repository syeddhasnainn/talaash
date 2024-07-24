import Messages from "@/components/messages"
import { getMessages } from "@/actions/actions"

type PageProps = {
    params: { id: string };
}

export default async function Chat({ params }: PageProps) {

    const chatMessages = await getMessages(params.id)

    return (
        <>
            <Messages chatMessages={chatMessages} uuid={params.id} />
        </>
    )
}