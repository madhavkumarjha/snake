# 🐍 SNAKE GAME — MASTER PRD (V1 → V3)

> **Document Status:** Active Specification & Master Roadmap
> **Last Updated:** 2 September 2026
> **Version:** 2.0 (Realistic Web Edition)

---

## 📌 DOCUMENT PURPOSE

This document serves as the **single source of truth** for the Snake Game project across all three production phases:

| Phase | Scope | Platform | Status |
|---|---|---|---|
| **V1** | Classic Grid Arcade Snake MVP | Web (Phaser 3 + Vite) | ✅ Completed |
| **V2** | Realistic Visuals + 60 FPS Lerp + Audio FX + Settings + Leaderboard | Web (Phaser 3 + Web Audio API) | ✅ Completed |
| **V3** | Mobile Port & Touch Controls | Expo (Android / iOS APK) | ⚪ Planned |

---

## 1. 🎯 PROJECT OVERVIEW

| Section | Detail |
|---|---|
| Project Name | Snake Classic Arcade |
| Game Type | 2D Grid-based Action Arcade |
| Engine (V1-V2) | Phaser 3 + Vite + TypeScript |
| Engine (V3) | Expo (Android/iOS APK wrapper or Native Canvas) |
| Architecture | Pure Frontend Client-Side Storage |
| Test Suite | Vitest (28/28 Unit Tests Passing) |

---

## 2. 🎮 GAME VISION

> "A polished, ultra-responsive 2D grid arcade Snake Game featuring sub-cell 60 FPS interpolation crawling, dynamic sound FX synthesis, multiple visual themes, configurable difficulty speeds, particle explosion feedback, and local leaderboard persistence."

---

## 3. 📊 CORE MECHANICS

| Mechanic | Detail |
|---|---|
| Grid Sizes | 15×15 (Tight), 20×20 (Standard), 25×25 (Wide) |
| Snake Spawn | Grid Center (Default: 10, 10) |
| Initial Length | 3 segments |
| Movement | Arrow keys (↑ ↓ ← →), WASD, 180-degree turn prevention |
| Food Varieties | Normal Red Apple (1 pt) & Golden Star Apple (3 pts, 15% spawn chance) |
| Speed Tiers | Easy (250ms), Medium (200ms), Hard (140ms), Insane (90ms) |
| Collision Logic | Grid Boundary Wall Collision or Self-Body Collision → Game Over |

---

## 4. 🎨 VISUAL THEMES & DESIGN SYSTEM

| Theme | Background | Grid Lines | Snake Skin | Food Aura |
|---|---|---|---|---|
| **Cyber Neon** | `#0d0e15` | `#00ff88` (10%) | Bright Green (`#00ff88`) | Glowing Red (`#ff0055`) |
| **Grass Arena** | `#112810` | `#4caf50` (15%) | Lime Green (`#8bc34a`) | Deep Orange (`#ff5722`) |
| **Retro Arcade** | `#030c03` | `#33ff33` (20%) | CRT Green (`#66ff66`) | Neon Amber (`#ffaa00`) |
| **Midnight** | `#080811` | `#61afef` (12%) | Sapphire Blue (`#61afef`) | Amethyst Purple (`#c678dd`) |

---

## 5. 🛠️ TECHNICAL ARCHITECTURE

```
snake-game/
├── src/
│   ├── entities/
│   │   ├── Snake.ts          # Snake entity with sub-cell lerp interpolation state
│   │   └── Food.ts           # Food spawning algorithm & points system
│   ├── scenes/
│   │   ├── MenuScene.ts      # Main menu UI scene with settings badges
│   │   ├── GameScene.ts      # 60 FPS smooth game loop, particle FX & sound triggers
│   │   └── GameOverScene.ts  # Game over screen with leaderboard recording & celebration
│   ├── utils/
│   │   ├── audio.ts          # Web Audio API sound synthesizer (zero external asset delay)
│   │   ├── helpers.ts        # Position calculations & storage fallbacks
│   │   ├── leaderboard.ts    # Top 5 score recorder & persistence
│   │   └── settings.ts       # Difficulty, theme, grid size, and volume preferences
│   ├── main.ts               # Phaser game initialization & DOM modal bindings
│   └── style.css             # Glassmorphism UI layout & theme stylesheets
├── tests/
│   ├── Food.test.ts          # Unit tests for Food spawning
│   ├── Snake.test.ts         # Unit tests for Snake movement & collision
│   ├── helpers.test.ts       # Unit tests for grid utilities & position helpers
│   └── settings.test.ts      # Unit tests for settings & leaderboard persistence
├── index.html                # Main web application entry point & modals
└── package.json              # Project dependencies & npm scripts
```

---

## 6. 📈 FEATURE ROADMAP STATUS

### 🟢 VERSION 1 (MVP — Completed)
- ✅ Grid drawing and rendering
- ✅ Snake movement & 180-degree turn prevention
- ✅ Food spawning & growth mechanics
- ✅ Wall and self-collision detection
- ✅ Live score display & game over screen

### 🟡 VERSION 2 (Realistic Web Edition — Completed)
- ✅ **60 FPS Smooth Movement**: Sub-cell position lerp interpolation between grid steps
- ✅ **Realistic Snake Rendering**: Directional eye orientation, pupils, and animated flickering tongue
- ✅ **Textured Food & Particle FX**: Shiny apples, golden star bonus apples, eat sparkles, floating `+1`/`+3` score text, and collision camera screen-shake
- ✅ **Synthesized Audio System**: Web Audio API synthesizer for eat pops, golden chimes, bass crash thud, and button ticks
- ✅ **Glassmorphic Settings Modal**: Configurable difficulty levels, 4 visual themes, 3 grid sizes, sound toggles, and volume slider
- ✅ **Top 5 Local Leaderboard**: Automated score recording with difficulty badges and date stamps

### 🔵 VERSION 3 (Mobile Port — Planned)
- 🔲 Touch swipe gestures & on-screen virtual D-Pad
- 🔲 Mobile responsive canvas auto-scaling
- 🔲 Expo build pipeline for Android & iOS APK

---

## 📝 UPDATE LOG

| Date | Update Details |
|---|---|
| 1 Sep 2026 | PRD created. V1-V3 roadmap defined. Mobile support targeted for V3. |
| 2 Sep 2026 | ✅ **V1 Completed**: Phaser 3 + TypeScript + Vite + Vitest baseline. 23/23 tests passing. |
| 2 Sep 2026 | 🎉 **V2 Realistic Edition Completed**: Added 60 FPS sub-cell lerp interpolation, realistic snake head with directional pupils & flickering tongue, shiny red & golden bonus apples, Web Audio API synthesizer, particle explosion FX, collision screen-shake, interactive Settings modal, and Top 5 Local Leaderboard. 28/28 unit tests passing, production bundle built. |