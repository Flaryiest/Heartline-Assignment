import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '~/types/auth';

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: initialUsers,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 500));
          
          const { users } = get();
          const foundUser = users.find(u => 
            u.email === email && u.password === password
          );
          
          if (foundUser) {
            set({
              user: {
                ...foundUser,
                password: ''
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
          await new Promise(r => setTimeout(r, 500));
          
          const { users } = get();
          
          if (users.some(u => u.email === email)) {
            throw new Error('Email already registered');
          }
          
          const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            password,
          };
          
          set({ 
            users: [...users, newUser],
            isLoading: false 
          });
          
          return newUser;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Registration failed', isLoading: false });
          return null;
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
