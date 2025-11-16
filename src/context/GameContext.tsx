import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, Player, ActivityType, Difficulty, GameHistoryEntry } from '../types/game.types';
import { loadGameState, saveGameState, clearGameState } from '../utils/storage';

// ============================================
// CONTEXT TYPES
// ============================================

interface GameContextType {
  state: GameState;
  initializePlayers: (player1: Player, player2: Player, difficulty: Difficulty) => void;
  setActivity: (activity: ActivityType) => void;
  recordPunishment: (entry: GameHistoryEntry) => void;
  switchTurn: () => void;
  endGame: () => void;
  resetGame: () => void;
  changeDifficulty: (difficulty: Difficulty) => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: GameState = {
  players: [
    { id: '', name: '', gender: 'male' },
    { id: '', name: '', gender: 'female' }
  ],
  difficulty: 'medium',
  currentActivity: null,
  isGameActive: false,
  currentTurn: 0,
  history: []
};

// ============================================
// ACTION TYPES
// ============================================

type GameAction =
  | { type: 'INITIALIZE_PLAYERS'; payload: { player1: Player; player2: Player; difficulty: Difficulty } }
  | { type: 'SET_ACTIVITY'; payload: ActivityType }
  | { type: 'RECORD_PUNISHMENT'; payload: GameHistoryEntry }
  | { type: 'SWITCH_TURN' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'CHANGE_DIFFICULTY'; payload: Difficulty }
  | { type: 'LOAD_STATE'; payload: GameState };

// ============================================
// REDUCER
// ============================================

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_PLAYERS':
      return {
        ...state,
        players: [action.payload.player1, action.payload.player2],
        difficulty: action.payload.difficulty,
        isGameActive: true
      };

    case 'SET_ACTIVITY':
      return {
        ...state,
        currentActivity: action.payload
      };

    case 'RECORD_PUNISHMENT':
      return {
        ...state,
        history: [...state.history, action.payload],
        currentActivity: null
      };

    case 'SWITCH_TURN':
      return {
        ...state,
        currentTurn: state.currentTurn === 0 ? 1 : 0
      };

    case 'END_GAME':
      return {
        ...state,
        isGameActive: false
      };

    case 'RESET_GAME':
      clearGameState();
      return initialState;

    case 'CHANGE_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

// ============================================
// CONTEXT CREATION
// ============================================

const GameContext = createContext<GameContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.isGameActive) {
      saveGameState(state);
    }
  }, [state]);

  const value: GameContextType = {
    state,
    initializePlayers: (player1, player2, difficulty) => {
      dispatch({ type: 'INITIALIZE_PLAYERS', payload: { player1, player2, difficulty } });
    },
    setActivity: (activity) => {
      dispatch({ type: 'SET_ACTIVITY', payload: activity });
    },
    recordPunishment: (entry) => {
      dispatch({ type: 'RECORD_PUNISHMENT', payload: entry });
    },
    switchTurn: () => {
      dispatch({ type: 'SWITCH_TURN' });
    },
    endGame: () => {
      dispatch({ type: 'END_GAME' });
    },
    resetGame: () => {
      clearGameState();
      dispatch({ type: 'RESET_GAME' });
    },
    changeDifficulty: (difficulty) => {
      dispatch({ type: 'CHANGE_DIFFICULTY', payload: difficulty });
    }
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
