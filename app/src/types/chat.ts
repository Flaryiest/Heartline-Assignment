export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  senderEmail: string; // New property for email
  timestamp: number;
  conversationId: string;
}

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: number;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (conversationId: string, text: string, sender: string, senderEmail: string) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
  createConversation: (name: string, participants: string[]) => void;
  setActiveConversation: (conversationId: string) => void;
  clearMessages: () => void;
}
