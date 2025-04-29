import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert, ScrollView } from 'react-native';

import { useAuth } from '~/hooks/useAuth';
import { RootStackScreenProps } from '~/types/types';

export const LoginScreen = () => {
  const navigation = useNavigation<RootStackScreenProps<'Login'>['navigation']>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isAuthenticated, isLoading, error, users } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ChatList' }],
      });
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
    }
  }, [error]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }
    
    await login(email, password);
  };

  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('password');
  };

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingVertical: 20 }}>
        <Text className="mb-8 text-3xl font-bold text-center">Welcome Back</Text>
        
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
            onPress={handleLogin}
          >
            <Text className="text-center text-lg font-semibold text-white">Login</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          className="mb-6 w-full rounded-lg border-blue-500 border p-4"
          onPress={fillDemoCredentials}
          disabled={isLoading}
        >
          <Text className="text-center text-lg font-semibold text-blue-500">Use Demo Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')} 
          disabled={isLoading}
          className="mb-8"
        >
          <Text className="text-blue-500 text-center">Don't have an account? Register</Text>
        </TouchableOpacity>
        
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="font-bold text-lg mb-2">Available Test Users:</Text>
          {users.map((u) => (
            <View key={u.id} className="mb-2">
              <Text>• {u.name} ({u.email})</Text>
              <Text className="text-gray-500 ml-2">Password: {u.password}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <StatusBar style="auto" />
    </View>
  );
};
