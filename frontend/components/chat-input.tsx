'use client'
import React, { useRef } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Paperclip, StopCircle } from "lucide-react";
import { useChatContext } from './chat-provider';

export const ChatInput: React.FC = () => {
    const { input, handleInputChange, handleSubmit, isLoading, stop, limit, file, handleFileChange } = useChatContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            {limit && <div className="text-red-700 text-xs mb-1 text-end">Limit Reached!</div>}
            {file && (
                <div className="text-red-700 text-xs mb-1 text-end">
                    Selected file: {file.name}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
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
        </>
    );
};