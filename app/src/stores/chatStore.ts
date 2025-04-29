import { create } from 'zustand';
import { ChatMessage, ChatState } from '~/types/chat';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Welcome to the global chat room!',
    sender: 'System',
    timestamp: Date.now() - 60000 * 5,
  },
  {
    id: '2',
    text: 'Hey everyone! How are you all doing today?',
    sender: 'Sarah',
    timestamp: Date.now() - 60000 * 3,
  },
  {
    id: '3',
    text: 'I just joined HeartLine. This looks awesome!',
    sender: 'Michael',
    timestamp: Date.now() - 60000,
  },
];

export const useChatStore = create<ChatState>((set) => ({
  messages: initialMessages,
  isLoading: false,
  error: null,

  sendMessage: (text, sender) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  fetchMessages: async () => {
    set({ isLoading: true });
    try {
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
        isLoading: false 
      });
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
