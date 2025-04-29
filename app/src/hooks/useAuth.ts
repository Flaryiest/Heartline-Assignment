import { useEffect } from 'react';
import { useAuthStore } from '~/stores/authStore';

export const useAuth = () => {
  const { 
    user,
    users,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  } = useAuthStore();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  return {
    user,
    users,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };
};
