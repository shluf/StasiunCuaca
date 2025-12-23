/**
 * useLocalStorage Hook
 * Persistent state management with localStorage
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Wrap version of useState's setter function
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Dispatch a custom event for same-tab updates
          window.dispatchEvent(new Event('local-storage'));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Listen for changes to this key in other tabs/windows AND current tab
  useEffect(() => {
    const handleStorageChange = () => {
      // For custom event, we need to read directly from localStorage since no event details
      try {
        const item = window.localStorage.getItem(key);
        const newValue = item ? JSON.parse(item) : initialValue;

        // Compare stringified values to avoid unnecessary re-renders with new object references
        setStoredValue((currentValue) => {
          if (JSON.stringify(currentValue) === JSON.stringify(newValue)) {
            return currentValue;
          }
          return newValue;
        });
      } catch (error) {
        console.error(`Error parsing storage event for key "${key}":`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}
