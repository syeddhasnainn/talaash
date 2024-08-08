'use client'
import React, { createContext, useContext, useState } from 'react';
import { useChat } from '../hooks/useChat';

const ChatContext = createContext<ReturnType<typeof useChat> | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode, initialMessages: any, uuid: string, userId: string, initialChats: any }> = 
  ({ children, initialMessages, uuid, userId, initialChats }) => {
  const chatHook = useChat({ chats: initialChats, chatMessages: initialMessages, uuid, user_id: userId });

  return (
    <ChatContext.Provider value={chatHook}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};