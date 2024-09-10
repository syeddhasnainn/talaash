'use client'
import React, { useState } from 'react';
import { CircleX } from "lucide-react";
import { IFrame } from "./iframe";
import { useChatContext } from './chat-provider';

export const CodePreview: React.FC = () => {
    const { preview, code, setPreview } = useChatContext();
    const [iframeLoaded, setIframeLoaded] = useState(false);

    if (!preview) return null;

    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    return (
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
    );
};