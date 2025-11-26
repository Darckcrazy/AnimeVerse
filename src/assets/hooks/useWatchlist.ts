
import { useContext } from 'react';
import { ListContext } from '../context/ListContext';
import { API_BASE } from '../services/api';

// Default image as base64-encoded SVG
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExZDI5Ii8+PHRleHQgeD0iNTAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iYm9sZCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';

interface AnimeImages {
  jpg?: {
    image_url?: string;
    large_image_url?: string;
  };
  webp?: {
    image_url?: string;
    large_image_url?: string;
  };
}

interface AnimeData {
  mal_id?: number;
  title?: string;
  imageUrl?: string;
  synopsis?: string;
  status?: string;
  episodes?: number;
  score?: number;
  year?: number;
  images?: AnimeImages;
}

interface WatchlistItem {
  id?: number;
  watchlistId?: number;
  animeId?: number;
  type?: 'anime';
  title?: string;
  status?: string;
  image?: string;
  imageUrl?: string;
  score?: number;
  progress?: number;
  episodes?: number;
  totalEpisodes?: number;
  synopsis?: string;
  year?: number;
  animeTitolo?: string;
  anime?: AnimeData;
}

interface AddToWatchlistParams {
  title?: string;
  imageUrl?: string;
  synopsis?: string;
  status?: string;
  episodes?: number;
  score?: number;
  year?: number;
  images?: AnimeImages;
}

/**
 * Safely processes an image URL to ensure it's valid and properly formatted
 */
const getSafeImageUrl = (url: string | undefined): string => {
  if (!url) return DEFAULT_IMAGE;
  
  try {
    // If it's already a data URL, return as is
    if (url.startsWith('data:')) {
      // Make sure the data URL is properly formatted
      return url.includes('base64,') ? url : DEFAULT_IMAGE;
    }
    
    // If it's a relative URL that starts with /api, remove the /api prefix
    if (url.startsWith('/api')) {
      const base = API_BASE.endsWith('/') ? API_BASE : `${API_BASE}/`;
      return `${base}${url.replace(/^\/+/, '')}`;
    }
    
    // If it's a relative URL, prepend the API base URL
    if (url.startsWith('/')) {
      const base = API_BASE.endsWith('/') ? API_BASE : API_BASE;
      return url.startsWith(base) ? url : `${base}${url}`;
    }
    
    // If it's already a full URL, return as is
    if (url.startsWith('http')) {
      return url;
    }
    
    // If it looks like a base64 string, prepend data:image/svg+xml;base64,
    if (url.includes('base64')) {
      return `data:image/svg+xml;base64,${url}`;
    }
    
    // If we get here, it's an invalid URL
    return DEFAULT_IMAGE;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return DEFAULT_IMAGE;
  }
};

// Aggiungi questo all'inizio del file, dopo gli import
console.log('API_BASE:', API_BASE);

/**
 * Custom hook to manage the anime watchlist
 */
export function useWatchlist() {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('useWatchlist must be used within a ListProvider');
  }

  // Process each item in the watchlist
  const processWatchlistItem = (item: any) => {
    try {
      console.log('Processing watchlist item:', item);
      
      // Usa i campi diretti dall'oggetto principale
      const title = item.animeTitle || item.title || item.anime?.title || item.animeTitolo || 'Senza titolo';
      
      // Prendi l'URL dell'immagine dall'oggetto principale
      let imageUrl = item.animeImageUrl || item.imageUrl || item.image;
      
      // Se l'immagine è un percorso relativo, aggiungi il base URL
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        imageUrl = `${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }
      
      // Se non c'è un'immagine, usa quella di default
      imageUrl = imageUrl || DEFAULT_IMAGE;
      
      // Crea l'oggetto risultante
      const result = {
        ...item,
        id: item.id || item.watchlistId || 0,
        type: 'anime' as const,
        title,
        image: imageUrl,
        animeId: item.animeId || item.anime?.mal_id || 0,
        status: item.status || 'planning',
        score: item.score || item.anime?.score || 0,
        progress: item.progress || 0,
        totalEpisodes: item.episodes || item.anime?.episodes || 0,
        synopsis: item.synopsis || item.anime?.synopsis,
        year: item.year || item.anime?.year,
        anime: {
          ...(item.anime || {}),
          title: item.animeTitle || item.anime?.title || title,
          imageUrl: imageUrl,
          mal_id: item.anime?.mal_id || item.animeId
        }
      };
      
      console.log('Processed item:', result);
      return result;
      
    } catch (error) {
      console.error('Error processing watchlist item:', error, { item });
      return {
        ...item,
        id: item.id || item.watchlistId || 0,
        type: 'anime' as const,
        title: item.title || 'Senza titolo',
        image: DEFAULT_IMAGE,
        animeId: item.animeId || 0,
        status: item.status || 'unknown',
        score: 0,
        progress: 0,
        totalEpisodes: 0,
        anime: {}
      };
    }
  };

  // Process the entire watchlist
  const processedWatchlist = context.watchlist.map(processWatchlistItem);
  
  // Log the processed watchlist for debugging
  console.log('Processed watchlist:', processedWatchlist);

  // Return the watchlist with all the necessary methods
  return {
    watchlist: processedWatchlist,
    addToWatchlist: async (token: string, animeId: number, status: string, animeData?: any) => {
      try {
        await context.addToWatchlist(token, animeId, status, animeData);
        await context.refreshLists(); // Refresh after adding
      } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw error;
      }
    },
    removeFromWatchlist: async (token: string, watchlistId: number) => {
      try {
        await context.removeFromWatchlist(token, watchlistId);
        await context.refreshLists(); // Refresh after removing
      } catch (error) {
        console.error('Error removing from watchlist:', error);
        throw error;
      }
    },
    loading: context.loading,
    error: context.error,
    updateEntry: async (id: number, type: 'anime' | 'manga', updates: { status?: string }) => {
      if (type === 'anime' && updates.status !== undefined) {
        try {
          await context.updateWatchlistStatus('', id, updates.status);
          await context.refreshLists(); // Refresh after updating status
        } catch (error) {
          console.error('Error updating watchlist status:', error);
          throw error;
        }
      } else {
        return Promise.reject(new Error('Tipo di aggiornamento non supportato o stato mancante'));
      }
    },
    isInWatchlist: context.isInWatchlist,
    refreshLists: context.refreshLists,
  };
}
