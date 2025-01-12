import { create } from 'zustand'

export type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ConversationStore {
  conversation: Message[];
  setConversation: (newMessage: Message) => void;
  updateLastMessage: (content: string) => void;
  question: string;
  setQuestion: (newQuestion: string) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  conversation: [],
  setConversation: (newMessage: Message) => set((state) => ({
    conversation: [...state.conversation, newMessage]
  })),
  updateLastMessage: (content: string) => set((state) => ({
    conversation: state.conversation.map((msg, index) => 
      index === state.conversation.length - 1 ? { ...msg, content } : msg
    )
  })),
  question: "",
  setQuestion: (newQuestion: string) => set((state) => ({
    question: newQuestion,
  })),
})); 