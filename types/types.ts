export interface ChatMessageType {
  role: "user" | "assistant" | "system";
  content: string;
}
