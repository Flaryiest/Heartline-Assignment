import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { ChatRoomScreen } from '~/screens/ChatRoomScreen';
import { HomeScreen } from '~/screens/HomeScreen';
import { LoginScreen } from '~/screens/LoginScreen';
import { RegisterScreen } from '~/screens/RegisterScreen';
import { useAuthStore } from '~/stores/authStore';

import { RootStackParamList } from '../types/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {!isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Create Account' }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ title: 'Sign In' }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="ChatRoom" 
            component={ChatRoomScreen}
            options={{ 
              title: 'Chat Room',
              headerBackVisible: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
