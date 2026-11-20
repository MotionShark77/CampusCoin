import { useState, useCallback } from 'react';

/**
 * useLocalStorage(key, initialValue)
 * Returns [value, setValue, removeValue]
 *
 * - Reads/writes JSON to localStorage
 * - Handles parse/stringify errors gracefully
 * - setValue accepts a plain value OR an updater function (like React setState)
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item);
    } catch (err) {
      console.warn(`useLocalStorage: failed to read key "${key}"`, err);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (valueOrUpdater) => {
      try {
        setStoredValue(prev => {
          const next =
            typeof valueOrUpdater === 'function'
              ? valueOrUpdater(prev)
              : valueOrUpdater;
          localStorage.setItem(key, JSON.stringify(next));
          return next;
        });
      } catch (err) {
        console.warn(`useLocalStorage: failed to write key "${key}"`, err);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.warn(`useLocalStorage: failed to remove key "${key}"`, err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
