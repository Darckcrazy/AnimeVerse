import { useContext } from 'react';
import { ListContext, type ListContextType } from '../context/ListContext';

export function useList(): ListContextType {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useList must be used within ListProvider');
  }
  return context;
}
