import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, ChatState, Conversation } from '~/types/chat';

const initialConversations: Conversation[] = [
  {
    id: 'global',
    name: 'Global Chat',
    participants: ['all'],
    lastMessage: 'Welcome to HeartLine!',
    lastMessageTime: Date.now() - 60000 * 60,
  },
  {
    id: 'support',
    name: 'Support Channel',
    participants: ['all'],
    lastMessage: 'Need help? Ask here!',
    lastMessageTime: Date.now() - 60000 * 30,
  }
];

const initialMessages: Record<string, ChatMessage[]> = {
  'global': [
    {
      id: '1',
      conversationId: 'global',
      text: 'Welcome to the global chat room!',
      sender: 'System',
      senderEmail: 'system@heartline.com',
      timestamp: Date.now() - 60000 * 5,
    },
    {
      id: '2',
      conversationId: 'global',
      text: 'Hey everyone! How are you all doing today?',
      sender: 'Sarah',
      senderEmail: 'sarah@example.com',
      timestamp: Date.now() - 60000 * 3,
    },
    {
      id: '3',
      conversationId: 'global',
      text: 'I just joined HeartLine. This looks awesome!',
      sender: 'Michael',
      senderEmail: 'michael@example.com',
      timestamp: Date.now() - 60000,
    },
  ],
  'support': [
    {
      id: '1',
      conversationId: 'support',
      text: 'Welcome to the support channel!',
      sender: 'Support',
      senderEmail: 'support@heartline.com',
      timestamp: Date.now() - 60000 * 30,
    },
    {
      id: '2',
      conversationId: 'support',
      text: 'How can we help you today?',
      sender: 'Support',
      senderEmail: 'support@heartline.com',
      timestamp: Date.now() - 60000 * 25,
    },
  ]
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: initialConversations,
      messages: initialMessages,
      activeConversationId: null,
      isLoading: false,
      error: null,

      sendMessage: (conversationId, text, sender, senderEmail) => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          conversationId,
          text,
          sender,
          senderEmail,
          timestamp: Date.now(),
        };

        set((state) => {
          const conversationMessages = state.messages[conversationId] || [];
          const updatedMessages = {
            ...state.messages,
            [conversationId]: [...conversationMessages, newMessage],
          };
          
          const updatedConversations = state.conversations.map(conv => 
            conv.id === conversationId 
              ? { 
                  ...conv, 
                  lastMessage: text,
                  lastMessageTime: newMessage.timestamp
                }
              : conv
          );
          
          return {
            messages: updatedMessages,
            conversations: updatedConversations,
          };
        });
      },

      fetchMessages: async (conversationId) => {
        set({ isLoading: true });
        try {
          await new Promise(r => setTimeout(r, 300));
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch messages',
            isLoading: false 
          });
        }
      },

      fetchConversations: async () => {
        set({ isLoading: true });
        try {
          await new Promise(r => setTimeout(r, 300));
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch conversations',
            isLoading: false 
          });
        }
      },

      createConversation: (name, participants) => {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          name,
          participants,
        };

        set((state) => ({
          conversations: [...state.conversations, newConversation],
          messages: {
            ...state.messages,
            [newConversation.id]: [],
          }
        }));
        
        return newConversation.id;
      },

      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId });
      },

      clearMessages: () => {
        set({ messages: {} });
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
