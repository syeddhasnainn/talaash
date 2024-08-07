"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { UserButton } from "@clerk/nextjs";
import { CircleX, Paperclip, StopCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IFrame } from "./iframe";
import MemoizedMarkdown from "./markdown";
import Sidebar from "./sidebar";
import Spinner from "./spinner";
import { getMessageCount } from "@/actions/actions";
import { Alert } from "./ui/alert";
import ErrorAlert from "./error-alert";

interface ChatUIProps {
    chatMessages: any;
    uuid: string;
    user_id: string;
    chats: ChatProps[];
}

type ChatProps = {
    id: string;
    user_id: string;
    chat_name: string;
};

const ChatUI = ({ chatMessages, uuid, user_id, chats }: ChatUIProps) => {
    const router = useRouter();

    const {
        messages,
        setMessages,
        input,
        handleInputChange,
        handleSubmit,
        preview,
        code,
        setPreview,
        handlePreview,
        stop,
        isLoading,
        chatList,
        setChatList,
        limit,
        setLimit,
        previewError,
        setPreviewError,
        file,
        setFile,
        handleFileChange,
    } = useChat({ chats, chatMessages, uuid, user_id });
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    // useEffect(() => {
    //     console.log('effect')
    //     const countchecker = async () => {
    //         const count = await getMessageCount(user_id)
    //         if (count > 5) {
    //             setLimit(true)
    //         }
    //     }

    //     countchecker()
    // }, [])

    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
    };
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-row flex-1 h-screen relative">
            <Sidebar chats={chatList} setChatList={setChatList} messages={messages} setMessages={setMessages} />
            <div className="flex flex-1 gap-6 p-6">
                {/* <div className="absolute bottom-1 right-2 max-w-xs">
                    <ErrorAlert />

                </div> */}
                <div className="flex flex-col flex-1 basis-2/5 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Chat</h2>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                    <ScrollArea className="flex-1 mb-4">
                        <div className="flex flex-col gap-4">
                            {messages.map((c, index) => (
                                <div key={index}>
                                    {c.role == "user" ? (
                                        <div className="p-3 rounded-lg bg-gray-100">
                                            {typeof (c.content) == 'object' ? c.content[0].text : c.content}
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-lg bg-white border border-gray-200 text-md ">
                                            <MemoizedMarkdown c={c.content} />
                                        </div>
                                    )}

                                    {c.role === "assistant" && (
                                        <div className="mt-2 space-x-2">
                                            <button
                                                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                                onClick={() => navigator.clipboard.writeText(c.content)}
                                            >
                                                Copy
                                            </button>
                                            <button
                                                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                                onClick={() => handlePreview(c.content)}
                                            >
                                                Preview
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && <Spinner />}
                        </div>

                    </ScrollArea>
                    {limit && <div className="text-red-700 text-xs mb-1 text-end">Limit Reached!</div>}
                    {file && (
                        <div className="text-red-700 text-xs mb-1 text-end">
                            Selected file: {file.name}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex gap-2 ">
                        <div className="relative flex-1 border-gray-300">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                className=""
                                placeholder="Ask me anything..."
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 hover:scale-100">
                                <Paperclip onClick={handlePaperclipClick}
                                    className="h-5 w-5 text-gray-500 hover:text-black hover:scale-110" />
                                <input ref={fileInputRef}
                                    type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>

                        {isLoading && <Button
                            type="button"
                            onClick={() => stop()}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            <StopCircle className="h-4 w-4 mr-2" />
                            Stop
                        </Button>}

                    </form>
                </div>
                {preview && (
                    <div className={`flex-1 basis-3/5 rounded-lg shadow-lg overflow-hidden transition-opacity duration-500 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}>

                        <div className="h-full rounded-lg overflow-hidden flex flex-col">
                            <div className="bg-black text-white p-3 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Preview</h3>
                                <div className="flex space-x-2">
                                    <button onClick={() => {
                                        setPreview(false);
                                        setIframeLoaded(false);
                                    }}>
                                        <CircleX />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                {code?.startsWith("<!DOCTYPE html>") ? (
                                    <IFrame srcDoc={code} onLoad={handleIframeLoad}></IFrame>) : (
                                    <IFrame src="http://localhost:3000" onLoad={handleIframeLoad}></IFrame>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatUI;
