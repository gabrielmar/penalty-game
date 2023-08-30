import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { useChips } from '@/hooks/useChips';

type ChipsContextData = {
  chips: number;
  setChips: Dispatch<SetStateAction<number>>;
};
export const chipsContext = createContext({} as ChipsContextData);

type ChipsProviderProps = {
  children: ReactNode;
};
export const ChipsProvider = ({ children }: ChipsProviderProps) => {
  const [chips, setChips] = useChips(0);

  return <chipsContext.Provider value={{ chips, setChips }}>{children}</chipsContext.Provider>;
};
