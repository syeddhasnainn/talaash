'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import React from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24,
      }
    }
  });

  const localStoragePersister = typeof window !== "undefined" ? createSyncStoragePersister({
    storage: window.localStorage,
  }): null;

  if (!localStoragePersister) return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

  return (
    <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister: localStoragePersister }}
  >
    {children}
    </PersistQueryClientProvider>
  );
}
