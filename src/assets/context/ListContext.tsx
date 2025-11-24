import { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { apiService, Watchlist, Readlist } from '../services/api';

export interface ListContextType {
  watchlist: Watchlist[];
  readlist: Readlist[];
  loading: boolean;
  error: string | null;
  fetchWatchlist: (token: string) => Promise<void>;
  fetchReadlist: (token: string) => Promise<void>;
  addToWatchlist: (token: string, animeId: number, status: string) => Promise<void>;
  removeFromWatchlist: (token: string, watchlistId: number) => Promise<void>;
  updateWatchlistStatus: (token: string, watchlistId: number, status: string) => Promise<void>;
  addToReadlist: (token: string, mangaId: number, status: string) => Promise<void>;
  removeFromReadlist: (token: string, readlistId: number) => Promise<void>;
  updateReadlistStatus: (token: string, readlistId: number, status: string) => Promise<void>;
  isInWatchlist: (animeId: number) => boolean;
  isInReadlist: (mangaId: number) => boolean;
}

export const ListContext = createContext<ListContextType | undefined>(undefined);

interface ListProviderProps {
  children: ReactNode;
  token?: string | null;
}

export function ListProvider({ children, token }: ListProviderProps) {
  const [watchlist, setWatchlist] = useState<Watchlist[]>([]);
  const [readlist, setReadlist] = useState<Readlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMyWatchlist(token);
      setWatchlist(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch watchlist';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReadlist = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMyReadlist(token);
      setReadlist(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch readlist';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchWatchlist(token);
      fetchReadlist(token);
    } else {
      setWatchlist([]);
      setReadlist([]);
    }
  }, [token, fetchWatchlist, fetchReadlist]);

  const addToWatchlist = useCallback(async (token: string, animeId: number, status: string) => {
    try {
      setError(null);
      const newItem = await apiService.addToWatchlist(token, animeId, status);
      setWatchlist(prev => [...prev, newItem]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add to watchlist';
      setError(message);
      throw err;
    }
  }, []);

  const removeFromWatchlist = useCallback(async (token: string, watchlistId: number) => {
    try {
      setError(null);
      await apiService.removeFromWatchlist(token, watchlistId);
      setWatchlist(prev => prev.filter(item => item.watchlistId !== watchlistId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove from watchlist';
      setError(message);
      throw err;
    }
  }, []);

  const updateWatchlistStatus = useCallback(async (token: string, watchlistId: number, status: string) => {
    try {
      setError(null);
      const updated = await apiService.updateWatchlistStatus(token, watchlistId, status);
      setWatchlist(prev => prev.map(item => item.watchlistId === watchlistId ? updated : item));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update watchlist status';
      setError(message);
      throw err;
    }
  }, []);

  const addToReadlist = useCallback(async (token: string, mangaId: number, status: string) => {
    try {
      setError(null);
      const newItem = await apiService.addToReadlist(token, mangaId, status);
      setReadlist(prev => [...prev, newItem]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add to readlist';
      setError(message);
      throw err;
    }
  }, []);

  const removeFromReadlist = useCallback(async (token: string, readlistId: number) => {
    try {
      setError(null);
      await apiService.removeFromReadlist(token, readlistId);
      setReadlist(prev => prev.filter(item => item.readlistId !== readlistId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove from readlist';
      setError(message);
      throw err;
    }
  }, []);

  const updateReadlistStatus = useCallback(async (token: string, readlistId: number, status: string) => {
    try {
      setError(null);
      const updated = await apiService.updateReadlistStatus(token, readlistId, status);
      setReadlist(prev => prev.map(item => item.readlistId === readlistId ? updated : item));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update readlist status';
      setError(message);
      throw err;
    }
  }, []);

  const isInWatchlist = useCallback((animeId: number) => {
    return watchlist.some(item => item.animeId === animeId);
  }, [watchlist]);

  const isInReadlist = useCallback((mangaId: number) => {
    return readlist.some(item => item.mangaId === mangaId);
  }, [readlist]);

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
      }}
    >
      {children}
    </ListContext.Provider>
  );
}
