// Importa createContext di React per creare un contesto di autenticazione
import { createContext } from 'react';

// Interfaccia che definisce la struttura dei dati utente
export interface User {
  id: number;                    // ID univoco dell'utente
  username: string;              // Nome utente
  email: string;                 // Email dell'utente
  avatarURL?: string;            // URL dell'avatar (opzionale)
  favoriteGenres?: string[];     // Generi preferiti (opzionale)
  password?: string;             // Password (opzionale)
  bio?: string;                  // Biografia (opzionale)
  location?: string;             // Posizione geografica (opzionale)
  website?: string;              // Sito web (opzionale)
  joinDate?: string;             // Data di iscrizione (opzionale)
}

// Interfaccia che definisce il tipo del contesto di autenticazione
export interface AuthContextType {
  isLoggedIn: boolean;           // Flag che indica se l'utente è loggato
  user: User | null;             // Dati dell'utente loggato o null
  token: string | null;          // Token di autenticazione o null
  setUser: (user: User | null) => void;  // Funzione per impostare l'utente
  login: (email: string, password: string) => Promise<void>;     // Funzione per il login
  signup: (username: string, email: string, password: string) => Promise<void>;  // Funzione per la registrazione
  logout: () => void;            // Funzione per il logout
  loading: boolean;              // Flag che indica se il caricamento è in corso
  error: string | null;          // Messaggio di errore o null
}

// Crea il contesto di autenticazione con tipo AuthContextType
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
