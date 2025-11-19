import { useState, useEffect, useCallback } from 'react';
import { Punishment, Difficulty, ActivityType, Gender } from '../types/game.types';
import { loadPunishments } from '../utils/punishmentLoader';
import { useGame } from '../context/GameContext';

/**
 * Hook for loading and managing punishments
 */
export function usePunishments(difficulty: Difficulty, activity: ActivityType) {
  const { state } = useGame();
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
          // Apply focus mode filtering (except for body-explorer and strip-game)
          const shouldApplyFocusFilter = 
            state.gameMode === 'focus' && 
            state.focusCategories.length > 0 &&
            activity !== 'body-explorer' &&
            activity !== 'strip-game';

          console.log('=== FOCUS MODE DEBUG ===');
          console.log('Game Mode:', state.gameMode);
          console.log('Selected Categories:', state.focusCategories);
          console.log('Current Activity:', activity);
          console.log('Should Apply Filter:', shouldApplyFocusFilter);
          console.log('Total Tasks Loaded:', data.length);

          if (shouldApplyFocusFilter) {
            // Filter tasks that match ANY of the selected categories
            const filtered = data.filter(punishment => {
              const hasCategories = !!punishment.categories;
              const matchesCategory = hasCategories && 
                punishment.categories.some(cat => state.focusCategories.includes(cat));
              
              // Log first few for debugging
              if (data.indexOf(punishment) < 3) {
                console.log(`Task ${punishment.id}:`, {
                  hasCategories,
                  taskCategories: punishment.categories,
                  matchesCategory
                });
              }
              
              return matchesCategory;
            });

            console.log(`Filtered Tasks: ${filtered.length}/${data.length}`);

            if (filtered.length === 0) {
              console.warn(`No tasks found for selected categories in ${activity}, showing all tasks`);
              setPunishments(data);
            } else {
              console.log(`✓ Focus mode active: Showing ${filtered.length} matching tasks`);
              setPunishments(filtered);
            }
          } else {
            console.log('Using all tasks (no filter applied)');
            setPunishments(data);
          }
          console.log('======================');
          
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
  }, [difficulty, activity, state.gameMode, state.focusCategories]);

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
