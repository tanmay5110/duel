import { GameState, StoredGameData } from '../types/game.types';

const STORAGE_KEY = 'duel_game_state';

/**
 * Save game state to sessionStorage (only persists during browser session)
 */
export function saveGameState(state: GameState): void {
  try {
    const dataToStore: StoredGameData = {
      players: state.players,
      difficulty: state.difficulty,
      currentActivity: state.currentActivity,
      currentTurn: state.currentTurn,
      history: state.history,
      lastUpdated: Date.now()
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

/**
 * Load game state from sessionStorage
 */
export function loadGameState(): GameState | null {
  try {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    
    if (!storedData) {
      return null;
    }

    const parsed: StoredGameData = JSON.parse(storedData);

    return {
      players: parsed.players,
      difficulty: parsed.difficulty,
      currentActivity: parsed.currentActivity,
      isGameActive: true,
      currentTurn: parsed.currentTurn,
      history: parsed.history
    };
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

/**
 * Clear game state from sessionStorage
 */
export function clearGameState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
}

/**
 * Check if there's a saved game
 */
export function hasSavedGame(): boolean {
  try {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    return storedData !== null;
  } catch (error) {
    console.error('Error checking for saved game:', error);
    return false;
  }
}
