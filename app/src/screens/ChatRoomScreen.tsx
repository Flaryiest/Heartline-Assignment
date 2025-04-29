import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { 
  FlatList, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator 
} from 'react-native';

import { useChat } from '~/hooks/useChat';
import { useAuth } from '~/hooks/useAuth';
import { RootStackScreenProps } from '~/types/types';
import { ChatMessage } from '~/types/chat';

export const ChatRoomScreen = () => {
  const navigation = useNavigation<RootStackScreenProps<'ChatRoom'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'ChatRoom'>['route']>();
  const { conversationId } = route.params;
  
  const [newMessage, setNewMessage] = useState('');
  const { 
    messages, 
    activeConversation,
    isLoading, 
    sendMessage 
  } = useChat(conversationId);
  
  const { user } = useAuth();

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    sendMessage(newMessage);
    setNewMessage('');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBack = () => {
    navigation.navigate('ChatList');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: activeConversation?.name || 'Chat',
      headerLeft: () => (
        <TouchableOpacity 
          onPress={handleBack}
          className="ml-4"
        >
          <Text className="text-blue-500 mr-2">Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, activeConversation]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-2 text-gray-600">Loading messages...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-4 pt-2">
        <FlatList
          data={messages}
          keyExtractor={(item: ChatMessage) => item.id}
          renderItem={({ item }) => {
            const isCurrentUser = item.sender === user?.name;
            return (
              <View 
                className={`mb-2 rounded-lg p-3 ${
                  isCurrentUser ? 'bg-blue-500 ml-auto' : 'bg-gray-200'
                }`}
                style={{ maxWidth: '80%' }}
              >
                <Text 
                  className={`font-bold ${
                    isCurrentUser ? 'text-white' : 'text-black'
                  }`}
                >
                  {item.sender}
                </Text>
                <Text 
                  className={`${
                    isCurrentUser ? 'text-white' : 'text-black'
                  }`}
                >
                  {item.text}
                </Text>
                <Text 
                  className={`text-xs text-right ${
                    isCurrentUser ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {formatTime(item.timestamp)}
                </Text>
              </View>
            );
          }}
        />
      </View>
      
      <View className="flex-row border-t border-gray-200 p-2">
        <TextInput
          className="flex-1 rounded-full border border-gray-300 bg-gray-100 p-2 px-4"
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity
          className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-blue-500"
          onPress={handleSendMessage}
        >
          <Text className="text-xl font-bold text-white">→</Text>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
};
