import { useEffect } from 'react';
import { useChatStore } from '~/stores/chatStore';
import { useAuthStore } from '~/stores/authStore';
import { ChatMessage } from '~/types/chat';

export const useChat = () => {
  const { 
    messages,
    isLoading,
    error,
    sendMessage,
    fetchMessages,
    clearMessages
  } = useChatStore();
  
  const { user } = useAuthStore();

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendNewMessage = (text: string) => {
    if (!text.trim()) return;
    
    const senderName = user ? user.name : 'You';
    sendMessage(text, senderName);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendNewMessage,
    clearMessages
  };
};
