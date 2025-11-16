import { useState, useEffect, useCallback } from 'react';
import { Punishment, Difficulty, ActivityType, Gender } from '../types/game.types';
import { loadPunishments } from '../utils/punishmentLoader';

/**
 * Hook for loading and managing punishments
 */
export function usePunishments(difficulty: Difficulty, activity: ActivityType) {
  const [punishments, setPunishments] = useState<Punishment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPunishments = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await loadPunishments(difficulty, activity);
        
        if (isMounted) {
          setPunishments(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load punishments');
          setLoading(false);
        }
      }
    };

    fetchPunishments();

    return () => {
      isMounted = false;
    };
  }, [difficulty, activity]);

  /**
   * Get a random punishment for a specific gender
   */
  const getRandomPunishment = useCallback(
    (gender: Gender): Punishment | null => {
      const filtered = punishments.filter(p => p.gender === gender);
      
      if (filtered.length === 0) {
        console.warn(`No punishments found for gender: ${gender}`);
        return null;
      }

      const randomIndex = Math.floor(Math.random() * filtered.length);
      return filtered[randomIndex];
    },
    [punishments]
  );

  /**
   * Get a specific punishment by ID
   */
  const getPunishmentById = useCallback(
    (id: number): Punishment | undefined => {
      return punishments.find(p => p.id === id);
    },
    [punishments]
  );

  return {
    punishments,
    loading,
    error,
    getRandomPunishment,
    getPunishmentById
  };
}
