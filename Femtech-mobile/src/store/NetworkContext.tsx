import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { offlineStorage } from '../services/OfflineStorage';

interface NetworkContextType {
  isOnline: boolean;
  pendingActionsCount: number;
  syncPending: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActionsCount, setPendingActionsCount] = useState(0);

  useEffect(() => {
    // Check initial state
    offlineStorage.checkOnline().then(setIsOnline);
    
    // Load pending actions count
    loadPendingCount();

    // Subscribe to network changes
    const unsubscribe = offlineStorage.onNetworkChange((online) => {
      setIsOnline(online);
      if (online) {
        loadPendingCount();
      }
    });

    return unsubscribe;
  }, []);

  const loadPendingCount = async () => {
    const pending = await offlineStorage.getPendingActions();
    setPendingActionsCount(pending.length);
  };

  const syncPending = async () => {
    await offlineStorage.syncPendingActions();
    await loadPendingCount();
  };

  return (
    <NetworkContext.Provider value={{ isOnline, pendingActionsCount, syncPending }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}
