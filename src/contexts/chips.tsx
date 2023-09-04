import { Dispatch, ReactNode, SetStateAction, createContext, useContext } from 'react';

import { useLocalStorage } from '@/hooks/useLocalStorage';

type ChipsData = {
  chips: number;
  setChips: Dispatch<SetStateAction<number>>;
};

type ChipsProviderProps = {
  children: ReactNode;
};

const chipsContext = createContext<ChipsData | null>(null);

export const ChipsProvider = ({ children }: ChipsProviderProps) => {
  const [chips, setChips] = useLocalStorage('chips', 0);

  return <chipsContext.Provider value={{ chips, setChips }}>{children}</chipsContext.Provider>;
};

export const useChips = () => {
  const context = useContext(chipsContext);
  if (!context) {
    throw new Error('useChips must be used within a ChipsProvider');
  }
  return context;
};
