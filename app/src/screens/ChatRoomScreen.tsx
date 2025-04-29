import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { RootStackScreenProps } from '~/types/types';

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

// Sample messages for demonstration
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

export const ChatRoomScreen = () => {
  const navigation = useNavigation<RootStackScreenProps<'ChatRoom'>['navigation']>();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'You', // In a real app, this would be the user's name
      timestamp: Date.now(),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-4 pt-2">
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View 
              className={`mb-2 rounded-lg p-3 ${
                item.sender === 'You' ? 'bg-blue-500 ml-auto' : 'bg-gray-200'
              }`}
              style={{ maxWidth: '80%' }}
            >
              <Text 
                className={`font-bold ${
                  item.sender === 'You' ? 'text-white' : 'text-black'
                }`}
              >
                {item.sender}
              </Text>
              <Text 
                className={`${
                  item.sender === 'You' ? 'text-white' : 'text-black'
                }`}
              >
                {item.text}
              </Text>
              <Text 
                className={`text-xs text-right ${
                  item.sender === 'You' ? 'text-white/70' : 'text-gray-500'
                }`}
              >
                {formatTime(item.timestamp)}
              </Text>
            </View>
          )}
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
          onPress={sendMessage}
        >
          <Text className="text-xl font-bold text-white">→</Text>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
};
