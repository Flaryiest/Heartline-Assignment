import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { RootStackScreenProps } from '~/types/types';

export const LoginScreen = () => {
  const navigation = useNavigation<RootStackScreenProps<'Login'>['navigation']>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('ChatRoom');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="mb-8 text-3xl font-bold">Welcome Back</Text>
      
      <TextInput
        className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-100 p-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        className="mb-6 w-full rounded-lg border border-gray-300 bg-gray-100 p-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        className="mb-4 w-full rounded-lg bg-blue-500 p-4"
        onPress={handleLogin}
      >
        <Text className="text-center text-lg font-semibold text-white">Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text className="text-blue-500">Don't have an account? Register</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
};
