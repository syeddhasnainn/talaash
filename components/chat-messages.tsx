import React from 'react';
import { ScrollArea } from "../components/ui/scroll-area";
import MemoizedMarkdown from "./markdown";
import Spinner from "./spinner";
import { useChatContext } from './chat-provider';

export const ChatMessages: React.FC = () => {
    const { messages, isLoading, handlePreview } = useChatContext();

    return (
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
    );
};