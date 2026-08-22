/**
 * CLINIVA — usePolling Hook
 * Polls a data-fetching function on a given interval.
 * Automatically stops on unmount. Tracks loading, error, and last-updated time.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export function usePolling(fetchFn, intervalMs = 10000, options = {}) {
  const { immediate = true, onUpdate } = options;

  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const intervalRef = useRef(null);
  const mountedRef  = useRef(true);

  const runFetch = useCallback(async (isBackground = false) => {
    if (!mountedRef.current) return;
    if (isBackground) setIsRefreshing(true);
    else setLoading(true);

    try {
      const result = await fetchFn();
      if (!mountedRef.current) return;
      setData(result);
      setError(null);
      setLastUpdated(new Date());
      if (onUpdate) onUpdate(result);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || 'Failed to fetch');
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchFn, onUpdate]);

  useEffect(() => {
    mountedRef.current = true;

    if (immediate) runFetch(false);

    intervalRef.current = setInterval(() => runFetch(true), intervalMs);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs, immediate, runFetch]);

  const refresh = useCallback(() => runFetch(true), [runFetch]);

  return { data, loading, error, lastUpdated, isRefreshing, refresh };
}

export default usePolling;
