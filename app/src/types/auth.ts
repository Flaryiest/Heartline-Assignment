export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  clearError: () => void;
}
