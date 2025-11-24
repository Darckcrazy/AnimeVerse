import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthContextType, type User } from './AuthContext';
import { apiService } from '../services/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const authResponse = await apiService.login({ email, password });
      const authToken = authResponse.accessToken;

      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setIsLoggedIn(true);

      const userData = await apiService.getCurrentUser(authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.signup({ username, email, password });
      await login(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante la registrazione';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    token,
    setUser,
    login,
    signup,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
