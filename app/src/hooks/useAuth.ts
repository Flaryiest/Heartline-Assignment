import { useEffect } from 'react';
import { useAuthStore } from '~/stores/authStore';

export const useAuth = () => {
  const { 
    user,
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
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };
};
