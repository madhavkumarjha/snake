import { describe, it, expect, beforeEach } from 'vitest';
import { getSettings, saveSettings, DEFAULT_SETTINGS, DIFFICULTY_SPEEDS, clearSettingsStorage } from '../src/utils/settings';
import { recordScore, getLeaderboard, clearLeaderboardStorage } from '../src/utils/leaderboard';

describe('Settings Utility', () => {
  beforeEach(() => {
    clearSettingsStorage();
  });

  it('should return default settings if none saved', () => {
    const settings = getSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it('should save and update difficulty setting', () => {
    saveSettings({ difficulty: 'insane' });
    const settings = getSettings();
    expect(settings.difficulty).toBe('insane');
    expect(DIFFICULTY_SPEEDS[settings.difficulty]).toBe(90);
  });

  it('should save theme and grid size options', () => {
    saveSettings({ theme: 'grass', gridSize: 25 });
    const settings = getSettings();
    expect(settings.theme).toBe('grass');
    expect(settings.gridSize).toBe(25);
  });
});

describe('Leaderboard Utility', () => {
  beforeEach(() => {
    clearLeaderboardStorage();
  });

  it('should record score and sort top scores', () => {
    recordScore(10, 'easy');
    recordScore(25, 'medium');
    recordScore(15, 'hard');

    const leaderboard = getLeaderboard();
    expect(leaderboard.length).toBe(3);
    expect(leaderboard[0].score).toBe(25);
    expect(leaderboard[1].score).toBe(15);
    expect(leaderboard[2].score).toBe(10);
  });

  it('should keep at most top 5 scores', () => {
    [5, 12, 8, 20, 15, 30, 2].forEach(s => recordScore(s, 'medium'));

    const leaderboard = getLeaderboard();
    expect(leaderboard.length).toBe(5);
    expect(leaderboard[0].score).toBe(30);
    expect(leaderboard[4].score).toBe(8);
  });
});
