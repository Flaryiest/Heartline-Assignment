export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, sender: string) => void;
  fetchMessages: () => Promise<void>;
  clearMessages: () => void;
}
