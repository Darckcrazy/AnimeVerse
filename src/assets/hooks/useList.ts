// Importa l'hook useContext di React e il contesto delle liste
import { useContext } from 'react';
import { ListContext, type ListContextType } from '../context/ListContext';

// Hook personalizzato per accedere al contesto delle liste (watchlist e readlist)
// Deve essere usato all'interno di un componente che è figlio di ListProvider
export function useList(): ListContextType {
  // Ottiene il contesto delle liste
  const context = useContext(ListContext);
  // Se il contesto è undefined, significa che il componente non è dentro ListProvider
  if (context === undefined) {
    throw new Error('useList must be used within ListProvider');
  }
  // Ritorna il contesto delle liste
  return context;
}
