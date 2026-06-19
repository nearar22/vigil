import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchFlame, fetchStats, fetchOfferings, fetchEras } from '../lib/contract.js';

// Loads the one shared flame plus its offering log, sealed eras, and stats,
// then refreshes on a slow background interval. The poll can be paused while a
// tend transaction is in flight so it does not fight the write confirmation.
export function useVigil(pollMs = 90000) {
  const [flame, setFlame] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [eras, setEras] = useState([]);
  const [stats, setStats] = useState({ era: 0, vitality: 0, tendings: 0, offerings: 0, deaths: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const mounted = useRef(true);
  const paused = useRef(false);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const [fl, st, offs, ers] = await Promise.all([
        fetchFlame(),
        fetchStats(),
        fetchOfferings(60),
        fetchEras(60),
      ]);
      if (!mounted.current) return;
      setFlame(fl);
      setStats(st);
      setOfferings(offs);
      setEras(ers);
      setError(null);
      setLastUpdated(Date.now());
    } catch (e) {
      if (!mounted.current) return;
      setError('The flame could not be read from the chain. Retrying shortly.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load(false);
    const id = setInterval(() => {
      if (!paused.current) load(true);
    }, pollMs);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [load, pollMs]);

  const pausePolling = useCallback(() => {
    paused.current = true;
  }, []);
  const resumePolling = useCallback(() => {
    paused.current = false;
  }, []);

  return {
    flame,
    offerings,
    eras,
    stats,
    loading,
    error,
    lastUpdated,
    refresh: () => load(true),
    pausePolling,
    resumePolling,
  };
}
