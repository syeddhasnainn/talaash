import React from 'react';
import { UserButton } from "@clerk/nextjs";

export const ChatHeader: React.FC = () => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-semibold text-gray-800">Chat</h2>
    <UserButton afterSignOutUrl="/" />
  </div>
);