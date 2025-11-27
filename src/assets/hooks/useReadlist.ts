// Importa l'hook useContext di React e il contesto delle liste
import { useContext } from 'react';
import { ListContext } from '../context/ListContext';

// Hook personalizzato per gestire la readlist (lista di manga da leggere)
// Elabora i dati della readlist e fornisce funzioni per aggiungere/rimuovere elementi
export function useReadlist() {
  // Ottiene il contesto delle liste
  const context = useContext(ListContext);

  // Se il contesto è undefined, significa che il componente non è dentro ListProvider
  if (!context) {
    throw new Error('useReadlist must be used within a ListProvider');
  }

  // Elabora gli elementi della readlist per normalizzare la struttura dei dati
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

  // Ritorna la readlist elaborata e le funzioni per gestirla
  return {
    // Array di manga elaborati
    readlist: processedReadlist,
    // Funzione per aggiungere un manga alla readlist
    addToReadlist: async (token: string, mangaId: number, status: string, mangaData?: any) => {
      try {
        // Chiama la funzione del contesto per aggiungere il manga
        await context.addToReadlist(token, mangaId, status, mangaData);
        // Ricarica le liste dopo l'aggiunta
        await context.refreshLists();
      } catch (error) {
        // Gestisce gli errori
        console.error('Error adding to readlist:', error);
        throw error;
      }
    },
    // Funzione per rimuovere un manga dalla readlist
    removeFromReadlist: async (token: string, readlistId: number) => {
      try {
        // Chiama la funzione del contesto per rimuovere il manga
        await context.removeFromReadlist(token, readlistId);
        // Ricarica le liste dopo la rimozione
        await context.refreshLists();
      } catch (error) {
        // Gestisce gli errori
        console.error('Error removing from readlist:', error);
        throw error;
      }
    },
    // Funzione per aggiornare lo stato di un elemento nella readlist
    updateEntry: async (id: number, type: 'anime' | 'manga', updates: { status?: string }) => {
      if (type === 'manga' && updates.status !== undefined) {
        try {
          // Chiama la funzione del contesto per aggiornare lo stato
          await context.updateReadlistStatus('', id, updates.status);
          // Ricarica le liste dopo l'aggiornamento
          await context.refreshLists();
        } catch (error) {
          // Gestisce gli errori
          console.error('Error updating readlist status:', error);
          throw error;
        }
      } else {
        // Ritorna un errore se il tipo non è supportato
        return Promise.reject(new Error('Tipo di aggiornamento non supportato o stato mancante'));
      }
    },
    // Espone la funzione per controllare se un manga è in readlist
    isInReadlist: context.isInReadlist,
    // Espone la funzione per ricaricare le liste
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
