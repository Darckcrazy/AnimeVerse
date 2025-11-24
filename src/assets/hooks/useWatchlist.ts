
import { useContext } from 'react';
import { ListContext } from '../context/ListContext';
import type { ListContextType } from '../context/ListContext';

export function useWatchlist() {
  const context = useContext(ListContext);


  if (!context) {
    throw new Error('useWatchlist must be used within a ListProvider');
  }

  return {
    watchlist: context.watchlist.map((item) => ({
      id: item.watchlistId,
      type: 'anime' as const,
      title: item.animeTitolo,
      status: item.status,
      // Add additional fields as available if necessary
    })),
    addToWatchlist: context.addToWatchlist,
    removeFromWatchlist: context.removeFromWatchlist,
    updateEntry: (id: number, type: 'anime' | 'manga', updates: { status?: string }) => {
      if (type === 'anime' && updates.status !== undefined) {
        return context.updateWatchlistStatus('', id, updates.status); // token to be handled by caller or context
      }
      return Promise.reject(new Error('Unsupported update type or missing status'));
    },
    isInWatchlist: context.isInWatchlist,
  } as {
    watchlist: { id: number; type: 'anime'; title: string; status: string }[];
    addToWatchlist: (token: string, animeId: number, status: string) => Promise<void>;
    removeFromWatchlist: (token: string, watchlistId: number) => Promise<void>;
    updateEntry: (id: number, type: 'anime' | 'manga', updates: { status?: string }) => Promise<void>;
    isInWatchlist: (id: number) => boolean;
  };
}
