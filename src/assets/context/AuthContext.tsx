import { createContext } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  avatarURL?: string;
  favoriteGenres?: string[];
  password?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
