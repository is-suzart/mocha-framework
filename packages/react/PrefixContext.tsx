import React, { createContext, useContext } from 'react';

const PrefixContext = createContext<string>('');

export const PrefixProvider: React.FC<{ prefix: string; children: React.ReactNode }> = ({ prefix, children }) => (
  <PrefixContext.Provider value={prefix}>
    {children}
  </PrefixContext.Provider>
);

export const usePrefix = () => useContext(PrefixContext);
