"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * A hook that works like useState but automatically syncs with localStorage
 * and can be shared via URL
 * 
 * @param key - The key to store the state under
 * @param initialValue - The initial value if no stored value exists
 * @returns [state, setState, isLoading] - Similar to useState but with loading state
 */
export function useShareableState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(parsed);
      }
    } catch (error) {
      console.error(`Error loading state for key "${key}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return;

    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving state for key "${key}":`, error);
    }
  }, [key, state, isLoading]);

  // Wrapper for setState to handle function updates
  const setStateWrapper = useCallback((value: T | ((prev: T) => T)) => {
    setState(value);
  }, []);

  return [state, setStateWrapper, isLoading];
}

