export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane';
export type Theme = 'cyber' | 'grass' | 'retro' | 'midnight';
export type GridSize = 15 | 20 | 25;

export interface GameSettings {
  difficulty: Difficulty;
  theme: Theme;
  gridSize: GridSize;
  soundEnabled: boolean;
  volume: number; // 0 to 1
}

export const DIFFICULTY_SPEEDS: Record<Difficulty, number> = {
  easy: 250,
  medium: 200,
  hard: 140,
  insane: 90
};

export interface ThemeColors {
  background: string;
  gridLines: number;
  gridAlpha: number;
  snakeHead: number;
  snakeBody: number;
  foodGlow: number;
  foodBody: number;
  cardBg: string;
}

export const THEMES: Record<Theme, ThemeColors> = {
  cyber: {
    background: '#0d0e15',
    gridLines: 0x00ff88,
    gridAlpha: 0.1,
    snakeHead: 0x00ff88,
    snakeBody: 0x00aa55,
    foodGlow: 0xff0055,
    foodBody: 0xff4444,
    cardBg: '#16192b'
  },
  grass: {
    background: '#1b3b1a',
    gridLines: 0x4caf50,
    gridAlpha: 0.15,
    snakeHead: 0xffeb3b,
    snakeBody: 0x8bc34a,
    foodGlow: 0xff5722,
    foodBody: 0xe91e63,
    cardBg: '#254d24'
  },
  retro: {
    background: '#051305',
    gridLines: 0x33ff33,
    gridAlpha: 0.2,
    snakeHead: 0x66ff66,
    snakeBody: 0x22aa22,
    foodGlow: 0xffff33,
    foodBody: 0xffaa00,
    cardBg: '#0a220a'
  },
  midnight: {
    background: '#0a0a12',
    gridLines: 0x61afef,
    gridAlpha: 0.12,
    snakeHead: 0x61afef,
    snakeBody: 0x3b7ebb,
    foodGlow: 0xc678dd,
    foodBody: 0xe06c75,
    cardBg: '#151522'
  }
};

const SETTINGS_KEY = 'snake_v2_settings';
let memorySettings: string | null = null;

export const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'medium',
  theme: 'cyber',
  gridSize: 20,
  soundEnabled: true,
  volume: 0.7
};

export function clearSettingsStorage(): void {
  memorySettings = null;
  try {
    if (typeof localStorage !== 'undefined' && localStorage.removeItem) {
      localStorage.removeItem(SETTINGS_KEY);
    }
  } catch {
    // Ignore
  }
}

export function getSettings(): GameSettings {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem) {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    }
  } catch {
    // Fallback to memory
  }
  if (memorySettings) {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(memorySettings) };
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: Partial<GameSettings>): GameSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  const str = JSON.stringify(updated);
  try {
    if (typeof localStorage !== 'undefined' && localStorage.setItem) {
      localStorage.setItem(SETTINGS_KEY, str);
    }
  } catch {
    // Ignore storage restrictions
  }
  memorySettings = str;
  return updated;
}
