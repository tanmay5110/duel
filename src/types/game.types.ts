// ============================================
// PLAYER & GAME TYPES
// ============================================

export type Gender = 'male' | 'female';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ActivityType = 'mini-game' | 'scratch-card' | 'spin-wheel' | 'body-explorer' | 'would-you-rather' | 'strip-game';

export interface Player {
  id: string;
  name: string;
  gender: Gender;
}

// ============================================
// PUNISHMENT TYPES
// ============================================

export interface Punishment {
  id: number;
  description: string;
  gender: Gender;
  difficulty: Difficulty;
  activity: ActivityType;
  timer?: number; // in seconds, 0 or undefined means no timer
}

// ============================================
// GAME STATE TYPES
// ============================================

export interface GameState {
  players: [Player, Player];
  difficulty: Difficulty;
  currentActivity: ActivityType | null;
  isGameActive: boolean;
  currentTurn: 0 | 1; // Index of player whose turn it is
  history: GameHistoryEntry[];
}

export interface GameHistoryEntry {
  activity: ActivityType;
  playerId: string; // Player who received punishment
  playerName: string; // For display purposes
  punishment: Punishment;
  timestamp: number;
}

// ============================================
// ACTIVITY RESULT TYPES
// ============================================

export interface ActivityResult {
  playerId: string;
  punishment: Punishment;
}

// ============================================
// SETTINGS TYPES
// ============================================

export interface GameSettings {
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  timerEnabled: boolean;
}

// ============================================
// LOCAL STORAGE TYPES
// ============================================

export interface StoredGameData {
  players: [Player, Player];
  difficulty: Difficulty;
  currentActivity: ActivityType | null;
  currentTurn: 0 | 1;
  history: GameHistoryEntry[];
  lastUpdated: number;
}
