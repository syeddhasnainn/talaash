export interface ChatMessageType {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatType {
  id: string;
  messages: ChatMessageType[];
  title: string;
}
