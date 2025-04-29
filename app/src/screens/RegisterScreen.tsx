import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { RootStackScreenProps } from '~/navigation/types';

export const RegisterScreen = () => {
  const navigation = useNavigation<RootStackScreenProps<'Register'>['navigation']>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Registration logic would go here
    // For now, just navigate to login on success
    navigation.navigate('Login');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="mb-8 text-3xl font-bold">Create Account</Text>
      
      <TextInput
        className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-100 p-4"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      
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
        onPress={handleRegister}
      >
        <Text className="text-center text-lg font-semibold text-white">Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text className="text-blue-500">Already have an account? Login</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
};
