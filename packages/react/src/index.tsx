import { LiverseCore } from '@liverse/core';
import React, { createContext, useContext, useMemo } from 'react';

const LiverseContext = createContext<LiverseCore | null>(null);

export const LiverseProvider: React.FC<{ apiKey: string; signalingUrl?: string; children: React.ReactNode }> = ({
  apiKey,
  signalingUrl,
  children
}) => {
  const sdk = useMemo(() => new LiverseCore({ apiKey, signalingUrl }), [apiKey, signalingUrl]);

  return (
    <LiverseContext.Provider value={sdk} >
      {children}
    </LiverseContext.Provider>
  );
};

export const useLiverse = () => {
  const context = useContext(LiverseContext);
  if (!context) {
    throw new Error('useLiverse must be used within a LiverseProvider');
  }
  return context;
};

export * from './hooks/usePublisher';
