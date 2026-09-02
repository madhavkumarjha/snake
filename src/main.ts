import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { CANVAS_WIDTH, CANVAS_HEIGHT, getHighScore } from './utils/helpers';
import { getSettings, saveSettings, Difficulty, Theme, GridSize } from './utils/settings';
import { getLeaderboard } from './utils/leaderboard';
import { soundManager } from './utils/audio';
import './style.css';

let game: Phaser.Game | null = null;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#0d0e15',
  scene: [MenuScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

function getActiveGameScene(): GameScene | null {
  if (!game) return null;
  const scene = game.scene.getScene('GameScene') as GameScene;
  if (scene && scene.scene.isActive()) {
    return scene;
  }
  return null;
}

function syncUIWithSettings(): void {
  const settings = getSettings();

  // 1. Sync Body Theme Class
  document.body.className = `theme-${settings.theme}`;

  // 2. Sync Header Stats
  const scoreEl = document.getElementById('high-score-display');
  if (scoreEl) scoreEl.textContent = getHighScore().toString();

  const diffEl = document.getElementById('difficulty-display');
  if (diffEl) diffEl.textContent = settings.difficulty.toUpperCase();

  const gridEl = document.getElementById('grid-size-display');
  if (gridEl) gridEl.textContent = `${settings.gridSize} × ${settings.gridSize}`;

  // 3. Sync Sound Toggle Button
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (soundBtn) {
    soundBtn.textContent = settings.soundEnabled ? '🔊' : '🔇';
  }

  // 4. Sync Settings Modal UI Active States
  syncActiveOptionButtons('opt-difficulty', settings.difficulty);
  syncActiveOptionButtons('opt-theme', settings.theme);
  syncActiveOptionButtons('opt-grid', settings.gridSize.toString());

  const volSlider = document.getElementById('volume-slider') as HTMLInputElement;
  const volVal = document.getElementById('volume-val');
  if (volSlider) volSlider.value = settings.volume.toString();
  if (volVal) volVal.textContent = `${Math.round(settings.volume * 100)}%`;
}

function syncActiveOptionButtons(containerId: string, activeVal: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btns = container.querySelectorAll('.opt-btn');
  btns.forEach(btn => {
    if (btn.getAttribute('data-val') === activeVal) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function setupDOMListeners(): void {
  const modalSettings = document.getElementById('modal-settings');
  const modalLeaderboard = document.getElementById('modal-leaderboard');

  // Open Settings Modal & AUTO-PAUSE game
  document.getElementById('btn-settings')?.addEventListener('click', () => {
    soundManager.playClickSound();

    const activeScene = getActiveGameScene();
    if (activeScene) {
      activeScene.pauseGame();
    }

    syncUIWithSettings();
    modalSettings?.classList.remove('hidden');
  });

  // Close Settings Modal
  document.getElementById('close-settings')?.addEventListener('click', () => {
    soundManager.playClickSound();
    modalSettings?.classList.add('hidden');
  });

  // Open Leaderboard Modal & AUTO-PAUSE game
  document.getElementById('btn-leaderboard')?.addEventListener('click', () => {
    soundManager.playClickSound();

    const activeScene = getActiveGameScene();
    if (activeScene) {
      activeScene.pauseGame();
    }

    renderLeaderboardUI();
    modalLeaderboard?.classList.remove('hidden');
  });

  // Close Leaderboard Modal
  document.getElementById('close-leaderboard')?.addEventListener('click', () => {
    soundManager.playClickSound();
    modalLeaderboard?.classList.add('hidden');
  });

  // Toggle Sound Button
  document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
    const settings = getSettings();
    saveSettings({ soundEnabled: !settings.soundEnabled });
    soundManager.playClickSound();
    syncUIWithSettings();
  });

  // Volume Slider
  const volSlider = document.getElementById('volume-slider') as HTMLInputElement;
  volSlider?.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    const vol = parseFloat(target.value);
    saveSettings({ volume: vol });
    syncUIWithSettings();
  });

  // Option Grid Click Handlers
  setupOptionGroup('opt-difficulty', (val) => saveSettings({ difficulty: val as Difficulty }));
  setupOptionGroup('opt-theme', (val) => saveSettings({ theme: val as Theme }));
  setupOptionGroup('opt-grid', (val) => saveSettings({ gridSize: parseInt(val, 10) as GridSize }));

  // Save Settings & Resume / Restart Button
  document.getElementById('save-settings-btn')?.addEventListener('click', () => {
    soundManager.playClickSound();
    modalSettings?.classList.add('hidden');
    syncUIWithSettings();

    const activeScene = getActiveGameScene();
    if (activeScene) {
      activeScene.resumeGame();
    } else if (game) {
      game.scene.start('MenuScene');
    }
  });

  // Clear Leaderboard Button
  document.getElementById('clear-leaderboard-btn')?.addEventListener('click', () => {
    soundManager.playClickSound();
    try {
      localStorage.removeItem('snake_v2_leaderboard');
      localStorage.removeItem('snake_classic_highscore');
    } catch {
      // Ignore
    }
    renderLeaderboardUI();
    syncUIWithSettings();
  });
}

function setupOptionGroup(containerId: string, onChange: (val: string) => void): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btns = container.querySelectorAll('.opt-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundManager.playClickSound();
      const val = (e.currentTarget as HTMLElement).getAttribute('data-val');
      if (val) {
        onChange(val);
        syncUIWithSettings();
      }
    });
  });
}

function renderLeaderboardUI(): void {
  const listEl = document.getElementById('leaderboard-list');
  if (!listEl) return;

  const leaderboard = getLeaderboard();
  if (leaderboard.length === 0) {
    listEl.innerHTML = '<p style="text-align: center; color: #8888aa; padding: 20px;">No high scores recorded yet! Play a game to set a record.</p>';
    return;
  }

  let html = '';
  leaderboard.forEach((entry, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
    html += `
      <div class="leader-item">
        <span class="leader-rank">${medal}</span>
        <span class="leader-score">${entry.score} pts</span>
        <span class="leader-tag">${entry.difficulty.toUpperCase()} • ${entry.date}</span>
      </div>
    `;
  });

  listEl.innerHTML = html;
}

window.addEventListener('load', () => {
  game = new Phaser.Game(config);
  setupDOMListeners();
  syncUIWithSettings();
  setInterval(syncUIWithSettings, 1000);
});
