"use client";

import { useState, useEffect, useCallback } from "react";
import { useShareableStateContext } from "@/contexts/ShareableStateContext";

/**
 * A hook that combines shareable state with the context to automatically
 * register/unregister state keys and handle restoration from shared URLs
 *
 * @param key - The key to store the state under
 * @param initialValue - The initial value if no stored value exists
 * @returns [state, setState] - Similar to useState
 */
export function useSharedState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const { registerState, unregisterState, isRestored } =
    useShareableStateContext();
  const [state, setState] = useState<T>(initialValue);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Register this state key on mount
  useEffect(() => {
    registerState(key);
    return () => unregisterState(key);
  }, [key, registerState, unregisterState]);

  // Load from localStorage once restoration is complete
  useEffect(() => {
    if (!isRestored || typeof window === "undefined" || hasLoaded) return;

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(parsed);
      }
    } catch (error) {
      console.error(`Error loading state for key "${key}":`, error);
    } finally {
      setHasLoaded(true);
    }
  }, [key, isRestored, hasLoaded]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === "undefined" || !hasLoaded) return;

    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving state for key "${key}":`, error);
    }
  }, [key, state, hasLoaded]);

  // Wrapper for setState to handle function updates
  const setStateWrapper = useCallback((value: T | ((prev: T) => T)) => {
    setState(value);
  }, []);

  return [state, setStateWrapper];
}

/**
 * Hook for components that just need to know when restoration is complete
 */
export function useRestorationStatus() {
  const { isRestored } = useShareableStateContext();
  return { isRestored };
}
