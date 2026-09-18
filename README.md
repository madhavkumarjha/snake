# 🐍 Snake Classic V2.5 — Realistic Arcade PWA Edition

> A modern, ultra-responsive 2D grid arcade Snake Game built with **Phaser 3**, **TypeScript**, **Vite**, **vite-plugin-pwa**, and **Web Audio API**. Works 100% **Offline** and is **Installable** on Mobile & Desktop as a Progressive Web App!

![V2.5 PWA Status](https://img.shields.io/badge/Status-V2.5%20PWA%20Completed-00ff88?style=for-the-badge)
![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-00ccff?style=for-the-badge)
![Phaser 3](https://img.shields.io/badge/Engine-Phaser%203-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge)
![Vitest](https://img.shields.io/badge/Tests-29%2F29%20Passing-green?style=for-the-badge)

---

## 🌟 Key Features (V2.5 PWA Edition)

- **📱 Full PWA & Offline Support**: Integrated `vite-plugin-pwa` with Workbox caching strategy for HTML, CSS, JavaScript bundle, Phaser canvas assets, Web Audio synthesized sound effects, and Google Fonts. Installable directly to Home Screen / Desktop.
- **⚡ 60 FPS Sub-cell Smooth Interpolation**: Fluid snake crawling physics powered by sub-cell position lerp algorithms.
- **🎨 Glassmorphic Cyber Arcade Design**: Rich themes (Cyber Neon 🟢, Grass Arena 🌿, Retro Arcade 🕹️, Midnight 🌌), glowing particle FX, floating score popups, and screen-shake collision feedback.
- **🦎 Wild Snake Wildlife & Prey Upgrade**: Green Tree Frogs 🐸, Forest Bugs 🦗, Bird Eggs 🥚, and Golden Geckos 🦎 with synthesized gulp/crunch sound synthesis & hiss audio FX.
- **🔊 Synthesized Web Audio API Engine**: Zero-delay browser audio synthesizer for eats, golden star chimes, and crash impacts with adjustable volume slider.
- **⚙️ Interactive Settings & Leaderboard**: Custom speed difficulties (Easy, Medium, Hard, Insane), 3 grid sizes (15×15, 20×20, 25×25), and persistent Top 5 Local Leaderboard.
- **🧪 100% Passing Automated Unit Test Suite**: 29 Vitest tests covering `Snake`, `Food`, `settings`, `leaderboard`, and position helper logic.

---

## 🛠️ Project Architecture

```
snake/
├── public/                   # PWA App Icons & Web Manifest Assets
│   ├── apple-touch-icon.png  # iOS Safari bookmark icon (180x180)
│   ├── favicon.ico           # Browser tab favicon (64x64)
│   ├── pwa-192x192.png       # Android Home Screen icon (192x192)
│   └── pwa-512x512.png       # Splash Screen & Maskable icon (512x512)
├── src/
│   ├── entities/
│   │   ├── Snake.ts          # Snake entity with lerp interpolation state machine
│   │   └── Food.ts           # Food & wild prey spawning algorithm
│   ├── scenes/
│   │   ├── MenuScene.ts      # Menu UI scene with dynamic badges
│   │   ├── GameScene.ts      # Main game loop, rendering & audio triggers
│   │   └── GameOverScene.ts  # Game over screen & leaderboard recorder
│   ├── utils/
│   │   ├── audio.ts          # Web Audio API sound synthesizer
│   │   ├── helpers.ts        # Grid math, position utilities & storage
│   │   ├── leaderboard.ts    # Top 5 score recorder & persistence
│   │   └── settings.ts       # Theme, difficulty, grid & volume preferences
│   ├── main.ts               # Phaser game init, PWA Service Worker & modal bindings
│   └── style.css             # Glassmorphic cyber layout & theme variables
├── tests/
│   ├── Food.test.ts          # Unit tests for food & prey logic
│   ├── Snake.test.ts         # Unit tests for snake movement & collision
│   ├── helpers.test.ts       # Unit tests for grid math
│   └── settings.test.ts      # Unit tests for settings & leaderboard storage
├── agaent1.md                # Master PRD Specification (V1 -> V3 Roadmap)
├── agent2.md                 # Detailed Architecture & Feature Specifications
├── index.html                # Main HTML entry point with settings/leaderboard modals
├── package.json              # Project dependencies & npm build scripts
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Vite & VitePWA configuration
```

---

## ⚡ Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Run Automated Vitest Test Suite
```bash
npm run test
```

### 4. Build Production PWA Bundle
```bash
npm run build
```
Generates minified assets in `dist/` including `dist/sw.js` (Service Worker) and `dist/manifest.webmanifest`.

### 5. Preview Production PWA Build
```bash
npm run preview
```

---

## 📱 Installing as a PWA

1. Open the game in **Google Chrome**, **Microsoft Edge**, **Brave**, or **Safari**.
2. Click the **Install Icon (📥 / ➕)** in your browser's address bar or menu.
3. The game will install as a native desktop/mobile app and function fully **offline**!
