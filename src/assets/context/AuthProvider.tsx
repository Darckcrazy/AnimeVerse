// Importa gli hook React e il tipo ReactNode
import { useState, useEffect, type ReactNode } from 'react';
// Importa il contesto di autenticazione e le interfacce associate
import { AuthContext, type AuthContextType, type User } from './AuthContext';
// Importa il servizio API per le richieste di autenticazione
import { apiService } from '../services/api';

// Provider per l'autenticazione che avvolge l'applicazione
export function AuthProvider({ children }: { children: ReactNode }) {
  // State che traccia se l'utente è loggato
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State per i dati dell'utente loggato
  const [user, setUser] = useState<User | null>(null);
  // State per il token di autenticazione
  const [token, setToken] = useState<string | null>(null);
  // State per il caricamento in corso di operazioni async
  const [loading, setLoading] = useState(false);
  // State per i messaggi di errore
  const [error, setError] = useState<string | null>(null);

  // Effetto che esegue al caricamento per controllare il localStorage per token salvati
  useEffect(() => {
    // Recupera il token e l'utente dal localStorage
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    // Se entrambi esistono, ripristina la sessione
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Funzione per il login dell'utente
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Invia le credenziali al server e riceve il token di autenticazione
      const authResponse = await apiService.login({ email, password });
      const authToken = authResponse.accessToken;

      // Salva il token nel localStorage e nello state
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setIsLoggedIn(true);

      // Recupera i dati dell'utente dal server
      const userData = await apiService.getCurrentUser(authToken);
      // Salva i dati dell'utente nel localStorage e nello state
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      // Gestisce gli errori di login
      const message = err instanceof Error ? err.message : 'Errore durante il login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funzione per la registrazione di un nuovo utente
  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Invia i dati di registrazione al server
      await apiService.signup({ username, email, password });
      // Esegue il login automaticamente dopo la registrazione
      await login(email, password);
    } catch (err) {
      // Gestisce gli errori di registrazione
      const message = err instanceof Error ? err.message : 'Errore durante la registrazione';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funzione per effettuare il logout
  const logout = () => {
    // Rimuove il token e i dati utente dal localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    // Resetta tutti gli state
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
  };

  // Crea l'oggetto valore del contesto con tutte le funzioni e i dati
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

  // Fornisce il contesto a tutti i componenti figli
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
