import { useEffect } from 'react';
import { useChatStore } from '~/stores/chatStore';
import { useAuthStore } from '~/stores/authStore';

export const useChat = (conversationId?: string) => {
  const { 
    messages,
    conversations,
    activeConversationId,
    isLoading,
    error,
    sendMessage,
    fetchMessages,
    fetchConversations,
    createConversation,
    setActiveConversation,
    clearMessages
  } = useChatStore();
  
  const { user } = useAuthStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages, setActiveConversation]);

  const sendNewMessage = (text: string, targetConversationId?: string) => {
    if (!text.trim() || !user) return;
    
    const chatId = targetConversationId || activeConversationId;
    if (!chatId) return;
    
    sendMessage(chatId, text, user.name);
  };

  const createNewConversation = (name: string) => {
    if (!name.trim() || !user) return null;
    return createConversation(name, [user.id]);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  return {
    messages: currentMessages,
    conversations,
    activeConversationId,
    activeConversation,
    isLoading,
    error,
    sendMessage: sendNewMessage,
    createConversation: createNewConversation,
    setActiveConversation,
    clearMessages
  };
};
