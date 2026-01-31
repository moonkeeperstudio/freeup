"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { restoreLocalStorageFromUrl } from '@/utils/urlState';

interface ShareableStateContextType {
  /** Register a state key with the shareable state manager */
  registerState: (key: string) => void;
  /** Unregister a state key */
  unregisterState: (key: string) => void;
  /** Get all registered state keys */
  getRegisteredKeys: () => string[];
  /** Whether initial restoration from URL has completed */
  isRestored: boolean;
}

const ShareableStateContext = createContext<ShareableStateContextType | undefined>(undefined);

interface ShareableStateProviderProps {
  children: ReactNode;
  /** Whether to automatically restore state from URL on mount */
  autoRestore?: boolean;
}

export function ShareableStateProvider({ 
  children, 
  autoRestore = true 
}: ShareableStateProviderProps) {
  const [registeredKeys, setRegisteredKeys] = useState<Set<string>>(new Set());
  const [isRestored, setIsRestored] = useState(false);

  // Restore state from URL on mount
  useEffect(() => {
    if (!autoRestore || typeof window === 'undefined') {
      setIsRestored(true);
      return;
    }

    try {
      // Check if there's a shared parameter in the URL
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('shared')) {
        restoreLocalStorageFromUrl(true);
        console.log('State restored from shared URL');
      }
    } catch (error) {
      console.error('Error restoring state from URL:', error);
    } finally {
      setIsRestored(true);
    }
  }, [autoRestore]);

  const registerState = useCallback((key: string) => {
    setRegisteredKeys(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const unregisterState = useCallback((key: string) => {
    setRegisteredKeys(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const getRegisteredKeys = useCallback(() => {
    return Array.from(registeredKeys);
  }, [registeredKeys]);

  return (
    <ShareableStateContext.Provider
      value={{
        registerState,
        unregisterState,
        getRegisteredKeys,
        isRestored,
      }}
    >
      {children}
    </ShareableStateContext.Provider>
  );
}

export function useShareableStateContext() {
  const context = useContext(ShareableStateContext);
  if (!context) {
    throw new Error('useShareableStateContext must be used within ShareableStateProvider');
  }
  return context;
}

