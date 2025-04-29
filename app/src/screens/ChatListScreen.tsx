import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { 
  FlatList, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  Modal,
  TextInput
} from 'react-native';

import { useChat } from '~/hooks/useChat';
import { useAuth } from '~/hooks/useAuth';
import { RootStackScreenProps } from '~/types/types';
import { Conversation } from '~/types/chat';

export const ChatListScreen = () => {
  const navigation = useNavigation<RootStackScreenProps<'ChatList'>['navigation']>();
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [newConversationName, setNewConversationName] = useState('');
  
  const { conversations, createConversation, isLoading } = useChat();
  const { user, logout } = useAuth();

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleCreateConversation = () => {
    if (newConversationName.trim()) {
      const newConversationId = createConversation(newConversationName);
      setNewConversationName('');
      setShowNewConversationModal(false);
      
      if (newConversationId) {
        navigation.navigate('ChatRoom', { conversationId: newConversationId });
      }
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    navigation.navigate('ChatRoom', { conversationId });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Conversations',
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} className="mr-4">
          <Text className="text-blue-500">Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-2 text-gray-600">Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Conversation }) => (
            <TouchableOpacity 
              className="p-4 border-b border-gray-200 flex-row justify-between items-center"
              onPress={() => handleSelectConversation(item.id)}
            >
              <View className="flex-1">
                <Text className="text-lg font-semibold">{item.name}</Text>
                {item.lastMessage && (
                  <Text className="text-gray-500" numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                )}
              </View>
              {item.lastMessageTime && (
                <Text className="text-xs text-gray-500">
                  {formatTime(item.lastMessageTime)}
                </Text>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="p-4 items-center">
              <Text className="text-gray-500">No conversations yet</Text>
            </View>
          }
        />
      </View>

      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center"
        onPress={() => setShowNewConversationModal(true)}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>

      <Modal
        visible={showNewConversationModal}
        transparent
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white w-4/5 p-6 rounded-lg">
            <Text className="text-xl font-semibold mb-4">New Conversation</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4"
              placeholder="Conversation Name"
              value={newConversationName}
              onChangeText={setNewConversationName}
            />
            
            <View className="flex-row justify-end">
              <TouchableOpacity 
                className="mr-4"
                onPress={() => setShowNewConversationModal(false)}
              >
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateConversation}>
                <Text className="text-blue-500 font-semibold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
};
