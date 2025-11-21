import { useState } from 'react';

export type WatchlistEntry = {
  id: number;
  type: 'anime' | 'manga';
  title: string;
  image: string;
  status: 'watching' | 'completed' | 'on-hold' | 'planning';
  score?: number;
  progress?: number;
  totalEpisodes?: number;
};

const STORAGE_KEY = 'animeverse_watchlist';

const MOCK_DATA: WatchlistEntry[] = [
  {
    id: 40960,
    type: 'anime',
    title: 'Jujutsu Kaisen',
    image: 'https://api.jikan.moe/images/anime/13/105518.webp',
    status: 'watching',
    score: 8,
    progress: 24,
    totalEpisodes: 24,
  },
  {
    id: 16498,
    type: 'anime',
    title: 'Attack on Titan',
    image: 'https://api.jikan.moe/images/anime/16/40384.webp',
    status: 'completed',
    score: 9,
    progress: 4,
    totalEpisodes: 4,
  },
];

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_DATA;
      }
    }
    return MOCK_DATA;
  });

  const saveWatchlist = (items: WatchlistEntry[]) => {
    setWatchlist(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addToWatchlist = (entry: WatchlistEntry) => {
    const exists = watchlist.some((item) => item.id === entry.id && item.type === entry.type);
    if (!exists) {
      saveWatchlist([...watchlist, entry]);
    }
  };

  const removeFromWatchlist = (id: number, type: 'anime' | 'manga') => {
    const updated = watchlist.filter((item) => !(item.id === id && item.type === type));
    saveWatchlist(updated);
  };

  const updateEntry = (id: number, type: 'anime' | 'manga', updates: Partial<WatchlistEntry>) => {
    const updated = watchlist.map((item) =>
      item.id === id && item.type === type ? { ...item, ...updates } : item
    );
    saveWatchlist(updated);
  };

  const isInWatchlist = (id: number, type: 'anime' | 'manga') => {
    return watchlist.some((item) => item.id === id && item.type === type);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateEntry,
    isInWatchlist,
  };
}
