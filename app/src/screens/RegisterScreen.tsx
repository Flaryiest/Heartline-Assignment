import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';

import { useAuth } from '~/hooks/useAuth';
import { RootStackScreenProps } from '~/types/types';

export const RegisterScreen = () => {
  const navigation = useNavigation<RootStackScreenProps<'Register'>['navigation']>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, isLoading, error } = useAuth();

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
    }
  }, [error]);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }
    
    const result = await register(name, email, password);
    if (result) {
      Alert.alert('Success', 'Registration successful! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="mb-8 text-3xl font-bold">Create Account</Text>
      
      <TextInput
        className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-100 p-4"
        placeholder="Name"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />
      
      <TextInput
        className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-100 p-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      
      <TextInput
        className="mb-6 w-full rounded-lg border border-gray-300 bg-gray-100 p-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#4F46E5" className="mb-4" />
      ) : (
        <TouchableOpacity
          className="mb-4 w-full rounded-lg bg-blue-500 p-4"
          onPress={handleRegister}
        >
          <Text className="text-center text-lg font-semibold text-white">Register</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
        <Text className="text-blue-500">Already have an account? Login</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
};
