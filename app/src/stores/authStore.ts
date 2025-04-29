import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '~/types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          if (email === 'test@example.com' && password === 'password') {
            set({
              user: {
                id: 1,
                name: 'Test User',
                email,
                token: 'mock-jwt-token',
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed', isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Registration failed', isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
