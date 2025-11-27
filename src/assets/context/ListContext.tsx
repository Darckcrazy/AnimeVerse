// Importa gli hook React necessari
import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
// Importa il servizio API e i tipi di dato
import { apiService, type Watchlist, type Readlist } from '../services/api';

// Interfaccia che definisce il tipo del contesto per le liste di visualizzazione
export interface ListContextType {
  watchlist: Watchlist[];        // Array di anime in watchlist
  readlist: Readlist[];          // Array di manga in readlist
  loading: boolean;              // Flag per lo stato di caricamento
  error: string | null;          // Messaggio di errore o null
  fetchWatchlist: (token: string) => Promise<void>;  // Carica la lista di visualizzazione
  fetchReadlist: (token: string) => Promise<void>;   // Carica la lista di lettura
  refreshLists: () => Promise<void>;  // Ricarica entrambe le liste
  addToWatchlist: (token: string, animeId: number, status: string, animeData?: any) => Promise<void>;  // Aggiunge un anime alla watchlist
  removeFromWatchlist: (token: string, watchlistId: number) => Promise<void>;  // Rimuove un anime dalla watchlist
  updateWatchlistStatus: (token: string, watchlistId: number, status: string) => Promise<void>;  // Aggiorna lo stato di un anime
  addToReadlist: (token: string, mangaId: number, status: string, mangaData?: any) => Promise<void>;  // Aggiunge un manga alla readlist
  removeFromReadlist: (token: string, readlistId: number) => Promise<void>;  // Rimuove un manga dalla readlist
  updateReadlistStatus: (token: string, readlistId: number, status: string) => Promise<void>;  // Aggiorna lo stato di un manga
  isInWatchlist: (animeId: number) => boolean;  // Controlla se un anime è in watchlist
  isInReadlist: (mangaId: number) => boolean;   // Controlla se un manga è in readlist
}

// Crea il contesto per le liste
export const ListContext = createContext<ListContextType | undefined>(undefined);

// Interfaccia per le proprietà del provider
interface ListProviderProps {
  children: ReactNode;    // Componenti figli
  token?: string | null;  // Token di autenticazione
}

// Provider per le liste di visualizzazione e lettura
export function ListProvider({ children, token }: ListProviderProps) {
  // State per la lista di anime da guardare
  const [watchlist, setWatchlist] = useState<Watchlist[]>([]);
  // State per la lista di manga da leggere
  const [readlist, setReadlist] = useState<Readlist[]>([]);
  // State per il caricamento in corso
  const [loading, setLoading] = useState(false);
  // State per i messaggi di errore
  const [error, setError] = useState<string | null>(null);

  // Funzione per recuperare la lista di anime da guardare
  const fetchWatchlist = useCallback(async (token: string) => {
    try {
      console.log('Fetching watchlist with token:', token ? 'token exists' : 'no token');
      setLoading(true);
      setError(null);
      // Chiama l'API per ottenere la watchlist
      const data = await apiService.getMyWatchlist(token);
      console.log('Watchlist data received:', data);
      // Verifica che i dati siano un array
      if (!Array.isArray(data)) {
        console.error('Expected an array but received:', data);
        throw new Error('Invalid watchlist data format');
      }
      setWatchlist(data);
    } catch (err) {
      // Gestisce gli errori
      const message = err instanceof Error ? err.message : 'Failed to fetch watchlist';
      console.error('Error fetching watchlist:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Funzione per recuperare la lista di manga da leggere
  const fetchReadlist = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      // Chiama l'API per ottenere la readlist
      const data = await apiService.getMyReadlist(token);
      setReadlist(data);
    } catch (err) {
      // Gestisce gli errori
      const message = err instanceof Error ? err.message : 'Failed to fetch readlist';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effetto che esegue quando il token cambia
  useEffect(() => {
    if (token) {
      // Se esiste il token, carica entrambe le liste
      fetchWatchlist(token);
      fetchReadlist(token);
    } else {
      // Se non c'è token, svuota le liste
      setWatchlist([]);
      setReadlist([]);
    }
  }, [token, fetchWatchlist, fetchReadlist]);

  // Funzione per aggiungere un anime alla watchlist
  const addToWatchlist = useCallback(async (token: string, animeId: number, status: string, animeData?: any) => {
    try {
      setError(null);
      // Chiama l'API per aggiungere l'anime
      const newItem = await apiService.addToWatchlist(token, animeId, status, animeData);
      // Aggiunge il nuovo elemento alla lista locale
      setWatchlist(prev => [...prev, newItem]);
    } catch (err) {
      // Gestisce gli errori
      const message = err instanceof Error ? err.message : 'Failed to add to watchlist';
      setError(message);
      throw err;
    }
  }, []);

  // Funzione per rimuovere un anime dalla watchlist
  const removeFromWatchlist = useCallback(async (token: string, watchlistId: number) => {
    try {
      setError(null);
      // Chiama l'API per rimuovere l'anime
      await apiService.removeFromWatchlist(token, watchlistId);
      // Rimuove l'elemento dalla lista locale
      setWatchlist(prev => prev.filter(item => item.watchlistId !== watchlistId));
    } catch (err) {
      // Gestisce gli errori
      const message = err instanceof Error ? err.message : 'Failed to remove from watchlist';
      setError(message);
      throw err;
    }
  }, []);

  // Funzione per aggiornare lo stato di un anime nella watchlist
  const updateWatchlistStatus = useCallback(async (token: string, watchlistId: number, status: string) => {
    try {
      setError(null);
      // Chiama l'API per aggiornare lo stato
      const updated = await apiService.updateWatchlistStatus(token, watchlistId, status);
      // Aggiorna l'elemento nella lista locale
      setWatchlist(prev => prev.map(item => item.watchlistId === watchlistId ? updated : item));
    } catch (err) {
      // Gestisce gli errori
      const message = err instanceof Error ? err.message : 'Failed to update watchlist status';
      setError(message);
      throw err;
    }
  }, []);

  // Funzione per aggiungere un manga alla readlist
  const addToReadlist = useCallback(async (token: string, mangaId: number, status: string, mangaData?: any) => {
    try {
      setError(null);
      // Chiama l'API per aggiungere il manga
      const newItem = await apiService.addToReadlist(token, mangaId, status, mangaData);
      // Aggiunge il nuovo elemento alla lista locale
      setReadlist(prev => [...prev, newItem]);
    } catch (err) {
      // Gestisce gli errori
      const message = err instanceof Error ? err.message : 'Failed to add to readlist';
      setError(message);
      throw err;
    }
  }, []);

  // Funzione per rimuovere un manga dalla readlist
  const removeFromReadlist = useCallback(async (token: string, readlistId: number) => {
    try {
      setError(null);
      // Chiama l'API per rimuovere il manga
      await apiService.removeFromReadlist(token, readlistId);
      // Rimuove l'elemento dalla lista locale
      setReadlist(prev => prev.filter(item => item.readlistId !== readlistId));
    } catch (err) {
      // Gestisce gli errori
      const message = err instanceof Error ? err.message : 'Failed to remove from readlist';
      setError(message);
      throw err;
    }
  }, []);

  // Funzione per aggiornare lo stato di un manga nella readlist
  const updateReadlistStatus = useCallback(async (token: string, readlistId: number, status: string) => {
    try {
      setError(null);
      // Chiama l'API per aggiornare lo stato
      const updated = await apiService.updateReadlistStatus(token, readlistId, status);
      // Aggiorna l'elemento nella lista locale
      setReadlist(prev => prev.map(item => item.readlistId === readlistId ? updated : item));
    } catch (err) {
      // Gestisce gli errori
      const message = err instanceof Error ? err.message : 'Failed to update readlist status';
      setError(message);
      throw err;
    }
  }, []);

  // Funzione per controllare se un anime è in watchlist
  const isInWatchlist = useCallback((animeId: number) => {
    return watchlist.some(item => item.animeId === animeId);
  }, [watchlist]);

  // Funzione per controllare se un manga è in readlist
  const isInReadlist = useCallback((mangaId: number) => {
    return readlist.some(item => item.mangaId === mangaId);
  }, [readlist]);

  // Funzione per ricaricare entrambe le liste
  const refreshLists = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      // Carica entrambe le liste in parallelo
      await Promise.all([
        fetchWatchlist(token),
        fetchReadlist(token)
      ]);
    } catch (error) {
      // Gestisce gli errori
      console.error('Error refreshing lists:', error);
      setError('Failed to refresh lists');
    } finally {
      setLoading(false);
    }
  }, [token, fetchWatchlist, fetchReadlist]);

  // Fornisce il contesto con tutte le funzioni e i dati a tutti i componenti figli
  return (
    <ListContext.Provider
      value={{
        watchlist,
        readlist,
        loading,
        error,
        fetchWatchlist,
        fetchReadlist,
        addToWatchlist,
        removeFromWatchlist,
        updateWatchlistStatus,
        addToReadlist,
        removeFromReadlist,
        updateReadlistStatus,
        isInWatchlist,
        isInReadlist,
        refreshLists,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}
