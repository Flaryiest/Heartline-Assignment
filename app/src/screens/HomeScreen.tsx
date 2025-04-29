import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { RootStackScreenProps } from '~/types/types';

export const HomeScreen = () => {
  const navigation = useNavigation<RootStackScreenProps<'Home'>['navigation']>();

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="mb-8 text-3xl font-bold">Welcome</Text>
      
      <Text className="mb-6 text-center text-gray-600">
        Connect with others through our global chat platform
      </Text>
      
      <TouchableOpacity
        className="mb-4 w-full rounded-lg bg-blue-500 p-4"
        onPress={() => navigation.navigate('Register')}
      >
        <Text className="text-center text-lg font-semibold text-white">Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="mb-4 w-full rounded-lg border border-blue-500 p-4"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-center text-lg font-semibold text-blue-500">Login</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
};
