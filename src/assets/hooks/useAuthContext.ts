// Importa l'hook useContext di React e il contesto di autenticazione
import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../context/AuthContext';

// Hook personalizzato per accedere al contesto di autenticazione
// Deve essere usato all'interno di un componente che è figlio di AuthProvider
export function useAuth(): AuthContextType {
  // Ottiene il contesto di autenticazione
  const context = useContext(AuthContext);
  // Se il contesto è undefined, significa che il componente non è dentro AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  // Ritorna il contesto di autenticazione
  return context;
}
