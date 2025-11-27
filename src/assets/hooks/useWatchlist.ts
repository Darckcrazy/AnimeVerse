// Importa l'hook useContext di React e il contesto delle liste
import { useContext } from 'react';
import { ListContext } from '../context/ListContext';
import { API_BASE } from '../services/api';

// Immagine SVG di default con codifica base64 da usare quando l'immagine non è disponibile
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExZDI5Ii8+PHRleHQgeD0iNTAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iYm9sZCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';

// Interfaccia per le immagini dell'anime (con URL JPG e WebP)
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

// Interfaccia per i dati dell'anime
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

// Interfaccia per un elemento della watchlist
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

// Interfaccia per i parametri quando si aggiunge un anime alla watchlist
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

// Funzione per elaborare in sicurezza gli URL delle immagini
// Verifica se l'URL è valido e correttamente formattato
const getSafeImageUrl = (url: string | undefined): string => {
  // Se non c'è URL, ritorna l'immagine di default
  if (!url) return DEFAULT_IMAGE;
  
  try {
    // Se è già un data URL, ritorna come è (dopo verifica)
    if (url.startsWith('data:')) {
      // Assicurati che il data URL sia correttamente formattato
      return url.includes('base64,') ? url : DEFAULT_IMAGE;
    }
    
    // Se è un URL relativo che inizia con /api, rimuovi il prefisso /api
    if (url.startsWith('/api')) {
      const base = API_BASE.endsWith('/') ? API_BASE : `${API_BASE}/`;
      return `${base}${url.replace(/^\/+/, '')}`;
    }
    
    // Se è un URL relativo, aggiungi l'URL base dell'API
    if (url.startsWith('/')) {
      const base = API_BASE.endsWith('/') ? API_BASE : API_BASE;
      return url.startsWith(base) ? url : `${base}${url}`;
    }
    
    // Se è già un URL completo, ritorna come è
    if (url.startsWith('http')) {
      return url;
    }
    
    // Se sembra una stringa base64, aggiungi il prefisso data:image/svg+xml;base64,
    if (url.includes('base64')) {
      return `data:image/svg+xml;base64,${url}`;
    }
    
    // Se arriviamo qui, è un URL non valido, ritorna l'immagine di default
    return DEFAULT_IMAGE;
  } catch (error) {
    // Gestisce gli errori di elaborazione dell'URL
    console.error('Error processing image URL:', error);
    return DEFAULT_IMAGE;
  }
};

// Log dell'URL base dell'API per il debug
console.log('API_BASE:', API_BASE);

// Hook personalizzato per gestire la watchlist (lista di anime da guardare)
// Elabora i dati della watchlist e fornisce funzioni per aggiungere/rimuovere elementi
export function useWatchlist() {
  // Ottiene il contesto delle liste
  const context = useContext(ListContext);

  // Se il contesto è undefined, significa che il componente non è dentro ListProvider
  if (!context) {
    throw new Error('useWatchlist must be used within a ListProvider');
  }

  // Funzione per elaborare ogni elemento della watchlist
  const processWatchlistItem = (item: any) => {
    try {
      console.log('Processing watchlist item:', item);
      
      // Estrae il titolo dell'anime dai vari campi disponibili
      const title = item.animeTitle || item.title || item.anime?.title || item.animeTitolo || 'Senza titolo';
      
      // Estrae l'URL dell'immagine dell'anime
      let imageUrl = item.animeImageUrl || item.imageUrl || item.image;
      
      // Se l'immagine è un percorso relativo, aggiungi l'URL base dell'API
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        imageUrl = `${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }
      
      // Se non c'è un'immagine, usa quella di default
      imageUrl = imageUrl || DEFAULT_IMAGE;
      
      // Crea l'oggetto normalizzato con tutti i dati dell'anime
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
      // Gestisce gli errori nell'elaborazione con dati di fallback
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

  // Elabora l'intera watchlist mappando ogni elemento
  const processedWatchlist = context.watchlist.map(processWatchlistItem);
  
  // Log della watchlist elaborata per il debug
  console.log('Processed watchlist:', processedWatchlist);

  // Ritorna la watchlist elaborata e tutte le funzioni necessarie per gestirla
  return {
    // Array di anime elaborati
    watchlist: processedWatchlist,
    // Funzione per aggiungere un anime alla watchlist
    addToWatchlist: async (token: string, animeId: number, status: string, animeData?: any) => {
      try {
        // Chiama la funzione del contesto per aggiungere l'anime
        await context.addToWatchlist(token, animeId, status, animeData);
        // Ricarica le liste dopo l'aggiunta
        await context.refreshLists();
      } catch (error) {
        // Gestisce gli errori
        console.error('Error adding to watchlist:', error);
        throw error;
      }
    },
    // Funzione per rimuovere un anime dalla watchlist
    removeFromWatchlist: async (token: string, watchlistId: number) => {
      try {
        // Chiama la funzione del contesto per rimuovere l'anime
        await context.removeFromWatchlist(token, watchlistId);
        // Ricarica le liste dopo la rimozione
        await context.refreshLists();
      } catch (error) {
        // Gestisce gli errori
        console.error('Error removing from watchlist:', error);
        throw error;
      }
    },
    // Flag per indicare se il caricamento è in corso
    loading: context.loading,
    // Messaggio di errore se c'è stato un problema
    error: context.error,
    // Funzione per aggiornare lo stato di un elemento nella watchlist
    updateEntry: async (id: number, type: 'anime' | 'manga', updates: { status?: string }) => {
      if (type === 'anime' && updates.status !== undefined) {
        try {
          // Chiama la funzione del contesto per aggiornare lo stato
          await context.updateWatchlistStatus('', id, updates.status);
          // Ricarica le liste dopo l'aggiornamento
          await context.refreshLists();
        } catch (error) {
          // Gestisce gli errori
          console.error('Error updating watchlist status:', error);
          throw error;
        }
      } else {
        // Ritorna un errore se il tipo non è supportato
        return Promise.reject(new Error('Tipo di aggiornamento non supportato o stato mancante'));
      }
    },
    // Espone la funzione per controllare se un anime è in watchlist
    isInWatchlist: context.isInWatchlist,
    // Espone la funzione per ricaricare le liste
    refreshLists: context.refreshLists,
  };
}
