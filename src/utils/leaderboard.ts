import { Difficulty } from './settings';

export interface LeaderboardEntry {
  score: number;
  date: string;
  difficulty: Difficulty;
}

const LEADERBOARD_KEY = 'snake_v2_leaderboard';
let memoryLeaderboard: string | null = null;

export function clearLeaderboardStorage(): void {
  memoryLeaderboard = null;
  try {
    if (typeof localStorage !== 'undefined' && localStorage.removeItem) {
      localStorage.removeItem(LEADERBOARD_KEY);
    }
  } catch {
    // Ignore
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem) {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch {
    // Fallback
  }
  if (memoryLeaderboard) {
    return JSON.parse(memoryLeaderboard);
  }
  return [];
}

export function recordScore(score: number, difficulty: Difficulty): LeaderboardEntry[] {
  if (score <= 0) return getLeaderboard();

  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    score,
    difficulty,
    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  };

  const updated = [...current, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Keep top 5

  const str = JSON.stringify(updated);
  try {
    if (typeof localStorage !== 'undefined' && localStorage.setItem) {
      localStorage.setItem(LEADERBOARD_KEY, str);
    }
  } catch {
    // Ignore storage issues
  }
  memoryLeaderboard = str;

  return updated;
}
