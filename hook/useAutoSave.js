// /hooks/useAutoSave.js
import { useEffect, useRef } from 'react';

export function useAutoSave(payload, saveFn, setLastSaved, delay = 3000) {
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  useEffect(() => {
    if (!saveFn) return;
    const id = setTimeout(() => {
      saveFn();
      setLastSaved?.(new Date());
    }, delay);
    return () => clearTimeout(id);
  }, [payloadRef.current, saveFn, setLastSaved, delay]);
}