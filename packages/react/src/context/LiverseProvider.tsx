import { LiverseCore } from '@liverse/core';

import React, { createContext, useMemo } from 'react';

const LiverseContext = createContext<LiverseCore | null>(null);

export const LiverseProvider: React.FC<{ apiKey: string; children: React.ReactNode }> = ({ apiKey, children }) => {
  const sdk = useMemo(() => new LiverseCore({ apiKey }), [apiKey]);

  return <LiverseContext.Provider value={sdk}>{children}</LiverseContext.Provider>;
};
