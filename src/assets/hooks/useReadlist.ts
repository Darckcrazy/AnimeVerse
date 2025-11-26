import { useContext } from 'react';
import { ListContext } from '../context/ListContext';

export function useReadlist() {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('useReadlist must be used within a ListProvider');
  }

  // Process the readlist items
  const processedReadlist = context.readlist.map((item) => {
    // Usa i dati del manga se disponibili, altrimenti usa i campi diretti
    const manga = item.manga || {};
    return {
      id: item.readlistId,
      mangaId: item.mangaId,
      type: 'manga' as const,
      title: manga.title || item.mangaTitolo || 'Senza titolo',
      status: item.status,
      image: manga.imageUrl || item.imageUrl || 'https://via.placeholder.com/200x300?text=Manga',
      score: item.score || manga.score,
      progress: item.progress || 0,
      totalEpisodes: item.chapters || manga.chapters || 0,
      synopsis: manga.synopsis,
      year: manga.year,
    };
  });

  return {
    readlist: processedReadlist,
    addToReadlist: async (token: string, mangaId: number, status: string, mangaData?: any) => {
      try {
        await context.addToReadlist(token, mangaId, status, mangaData);
        await context.refreshLists(); // Refresh after adding
      } catch (error) {
        console.error('Error adding to readlist:', error);
        throw error;
      }
    },
    removeFromReadlist: async (token: string, readlistId: number) => {
      try {
        await context.removeFromReadlist(token, readlistId);
        await context.refreshLists(); // Refresh after removing
      } catch (error) {
        console.error('Error removing from readlist:', error);
        throw error;
      }
    },
    updateEntry: async (id: number, type: 'anime' | 'manga', updates: { status?: string }) => {
      if (type === 'manga' && updates.status !== undefined) {
        try {
          await context.updateReadlistStatus('', id, updates.status);
          await context.refreshLists(); // Refresh after updating status
        } catch (error) {
          console.error('Error updating readlist status:', error);
          throw error;
        }
      } else {
        return Promise.reject(new Error('Tipo di aggiornamento non supportato o stato mancante'));
      }
    },
    isInReadlist: context.isInReadlist,
    refreshLists: context.refreshLists,
  } as {
    readlist: {
      id: number;
      mangaId: number;
      type: 'manga';
      title: string;
      status: string;
      image: string;
      score?: number;
      progress: number;
      totalEpisodes: number;
      synopsis?: string;
      year?: number;
    }[];
    addToReadlist: (token: string, mangaId: number, status: string, mangaData?: {
      title?: string;
      imageUrl?: string;
      synopsis?: string;
      status?: string;
      chapters?: number;
      score?: number;
      year?: number;
    }) => Promise<void>;
    removeFromReadlist: (token: string, readlistId: number) => Promise<void>;
    updateEntry: (id: number, type: 'anime' | 'manga', updates: { status?: string }) => Promise<void>;
    isInReadlist: (id: number) => boolean;
    refreshLists: () => Promise<void>;
  };
}
