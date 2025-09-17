import { useState, useEffect } from 'react';

/**
 * useLocalStorage hook
 * - key: localStorage key
 * - initialValue: default value if no key found
 *
 * Returns [value, setValue]
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (err) {
      console.error('useLocalStorage read error', err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error('useLocalStorage write error', err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
