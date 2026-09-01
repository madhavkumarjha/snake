# 🐍 SNAKE GAME — MASTER PRD (V1 → V3)

> **Document Status:** Living Document  
> **Last Updated:** 1 September 2026  
> **Owner:** Developer  
> **Version:** 1.0  

---

## 📌 DOCUMENT PURPOSE

Ye ek **single source of truth** hai poore Snake Game project ke liye. Isme teen phases cover hain:

| Phase | Kya Hai | Platform | Status |
| :--- | :--- | :--- | :--- |
| **V1** | Classic Snake MVP | Web (Phaser 3) | 🟢 Completed & Live-Ready |
| **V2** | Polish + Extra Features | Web (Same codebase) | ⚪ Not started |
| **V3** | Mobile Port | Expo (Android/iOS APK) | ⚪ Not started |

---

## 1. 🎯 PROJECT OVERVIEW

| Section | Detail |
| :--- | :--- |
| **Project Name** | Snake (Classic) |
| **Game Type** | 2D Grid-based Arcade |
| **Platform (V1-V2)** | Web (Phaser 3 + Vite) |
| **Platform (V3)** | Mobile APK (Expo / React Native WebView) |
| **Target Audience** | Self (Learning) + Friends |
| **Goal** | Learn game development without Unity/C# |
| **Total Timeline** | V1: Completed · V2: TBD · V3: TBD |

---

## 2. 🎮 GAME VISION

> *"Ek classic Snake game jisme arrow keys se snake move kare, food khaye, grow kare, aur wall/body se takraaye toh game over. Web pe pehle banega, phir mobile pe bhi khel sakenge."*

---

## 3. 📊 CORE MECHANICS (V1 Baseline)

| Mechanic | Detail |
| :--- | :--- |
| **Grid Size** | 20×20 |
| **Snake Start** | Center (10,10) |
| **Initial Length** | 3 blocks |
| **Movement** | Arrow keys (↑ ↓ ← →) & WASD |
| **Food Spawn** | Random empty cell |
| **Growth** | +1 block per food |
| **Speed** | Fixed (every 200ms move) |
| **Collision** | Wall or body → Game Over |

---

## 4. 🎨 VISUAL DESIGN

| Element | Design |
| :--- | :--- |
| **Background** | Dark grey (#1a1a2e / #0d0e15 glassmorphism) |
| **Grid** | Light dotted/faint grid lines (20x20) |
| **Snake Head** | Bright green (#00ff88) with eye details |
| **Snake Body** | Light green (#8BC34A) rounded segments |
| **Food** | Glowing red (#FF4444) — Apple shape |
| **Score** | Real-time score counter & High score badge |
| **Game Over** | Glowing red background with restart button |
| **Font** | Outfit / System Sans-serif |

---

## 5. 🕹️ CONTROLS

| Platform | Controls |
| :--- | :--- |
| **Desktop (V1)** | Arrow keys (↑ ↓ ← →) or WASD |
| **Desktop Extra** | Spacebar → Pause/Resume / Restart |
| **Mobile (V3)** | Swipe gestures |
| **Mobile Extra** | On-screen D-pad (fallback) |

---

## 6. 🛠️ TECHNICAL REQUIREMENTS

| Requirement | Detail |
| :--- | :--- |
| **Game Engine** | Phaser 3 (browser) |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **Test Runner** | Vitest (23/23 tests passing) |
| **File Size** | Under 1.5MB (web production build) |
| **Browser Support**| Chrome, Firefox, Edge |
| **Backend** | None — local-only game |
| **Mobile Wrapper**| Expo (React Native WebView around Phaser build) |

### Folder Structure

* **snake/**
  * **src/**
    * **scenes/**
      * `MenuScene.ts` *(Start screen)*
      * `GameScene.ts` *(Main game)*
      * `GameOverScene.ts` *(Game over screen)*
    * **entities/**
      * `Snake.ts` *(Snake logic)*
      * `Food.ts` *(Food spawning)*
    * **utils/**
      * `helpers.ts` *(Utility functions)*
    * `main.ts` *(Game entry point)*
    * `style.css` *(Arcade glassmorphism styles)*
  * **tests/** *(Vitest unit test suite)*
    * `Snake.test.ts`
    * `Food.test.ts`
    * `helpers.test.ts`
  * `index.html`
  * `.gitignore`
  * `package.json`
  * `tsconfig.json`
  * `vite.config.ts`

---

## 7. 📈 FEATURE ROADMAP — VERSION WISE

### 🟢 VERSION 1 (MVP — Web Completed & Live-Ready)

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Grid drawing | ✅ Completed | 20x20 canvas grid |
| Snake movement (arrow keys / WASD) | ✅ Completed | 200ms step tick |
| Food spawning | ✅ Completed | Avoids snake body cells |
| Eating + Growth | ✅ Completed | +1 length & score per food |
| Wall collision | ✅ Completed | Game over trigger |
| Body collision | ✅ Completed | Game over trigger |
| Score display | ✅ Completed | Real-time scoreboard |
| Game Over screen | ✅ Completed | Score + High score comparison |
| Restart button / Key handler | ✅ Completed | Click or Spacebar |
| Unit Test Suite | ✅ Completed | 23/23 Vitest tests passing |
| Production Build | ✅ Completed | `dist/` directory generated |

**V1 Exit Criteria:** Game fully playable, unit-tested, built, and ready for live deployment.

---

### 🌐 V1 LIVE DEPLOYMENT PLAN (Host Live Before V2)

Before moving to V2 polish features, V1 can be published live using any of these simple free hosting options:

#### Option A: Deploy to Vercel (Recommended)
1. Push project to GitHub repository.
2. Connect repo on [Vercel](https://vercel.com).
3. Build Command: `npm run build` | Output Directory: `dist`.
4. Live URL instantly generated (e.g. `https://snake-game.vercel.app`).

#### Option B: Deploy to Netlify
1. Drag & drop `dist/` folder to [Netlify Drop](https://app.netlify.com/drop) or connect GitHub.
2. Build Command: `npm run build` | Publish Directory: `dist`.

#### Option C: GitHub Pages
1. Install `gh-pages`: `npm install -D gh-pages`.
2. Add script to `package.json`: `"deploy": "gh-pages -d dist"`.
3. Run `npm run build && npm run deploy`.

---

### 🟡 VERSION 2 (Web Polish — Future)

| Feature | Status | Notes |
| :--- | :--- | :--- |
| High score save | ✅ Done in V1 | LocalStorage implementation |
| Speed increase | 🔜 Optional | Every 5 foods, slightly faster |
| Pause/Resume | ✅ Done in V1 | Spacebar pause toggle |
| Different food types| 🔜 Optional | Golden food = +3 score |
| Sound effects | 🔜 Optional | Eat, game-over, move |
| Theme toggle | 🔜 Optional | Dark/Light UI setting |
| Grid size selector| 🔜 Optional | 20×20 / 25×25 / 30×30 |
| Difficulty levels | 🔜 Optional | Easy/Medium/Hard presets |
| Leaderboard | 🔜 Optional | Top 5 local scores |

**V2 Exit Criteria:** Polished feel, high replay value.

---

### 🔵 VERSION 3 (Mobile Port — Expo APK)

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Swipe controls | 🔲 Planned | Core mobile requirement |
| Responsive canvas | 🔲 Planned | Handle different screens |
| Touch buttons | 🔲 Planned | Large tap targets |
| APK build | 🔲 Planned | Expo Android build first |
| Offline play | 🔲 Planned | Local-only |
| App branding | 🔲 Planned | App icon + splash screen |
| Play Store listing | 🔲 Optional | If publishing |

**V3 Exit Criteria:** Installable APK runs smoothly on mobile with touch controls.

---

## 8. 💬 OPEN DISCUSSION POINTS

| # | Question | Decision | Decided On |
| :--- | :--- | :--- | :--- |
| 1 | Grid size: 20×20 or 25×25? | ✅ Decided → 20×20 | 1 Sep 2026 |
| 2 | Snake speed: Fixed or gradually increasing? | ✅ Decided → Fixed 200ms | 1 Sep 2026 |
| 3 | High score: Save in LocalStorage? | ✅ Decided → LocalStorage + Memory fallback | 1 Sep 2026 |
| 4 | Mobile support: Now or V3? | ✅ Decided → V3 | 1 Sep 2026 |
| 5 | Art: Code-drawn shapes or sprites? | ✅ Decided → Code-drawn shapes | 1 Sep 2026 |
| 6 | Snake color: Classic green or different? | ✅ Decided → Neon Cyber Green (#00ff88) | 1 Sep 2026 |
| 7 | V3 approach: WebView wrap or native rewrite? | ⬜ Pending | — |

---

## 9. 📅 DEVELOPMENT TIMELINE

### V1 Timeline (Completed)

| Task | Status |
| :--- | :--- |
| Phaser + Vite + TypeScript setup | ✅ Completed |
| Snake class + movement + 180° protection | ✅ Completed |
| Food spawning + eating logic | ✅ Completed |
| Collision detection (wall + body) | ✅ Completed |
| Score display + Game Over screen | ✅ Completed |
| Glassmorphic UI Shell & Restart controls | ✅ Completed |
| Vitest Unit Testing (23/23 tests) | ✅ Completed |
| Production build + Live Deployment Plan | ✅ Completed |

---

## 10. 📊 RESOURCE CHECKLIST

| Resource | Status | Action |
| :--- | :--- | :--- |
| Game Idea | ✅ Clear | — |
| Phaser 3 | ✅ Installed | `phaser ^3.88.0` |
| TypeScript | ✅ Installed | `typescript ^5.7.3` |
| Vite | ✅ Installed | `vite ^6.1.0` |
| Vitest | ✅ Installed | `vitest ^3.0.5` |
| IDE | ✅ Have | Antigravity / VS Code |
| Node.js | ✅ Have | v24.15.0 |
| .gitignore | ✅ Created | Git ignores node_modules & dist |
| Git | ✅ Ready | Set up version control |
| Browser | ✅ Have | Chrome / Firefox |

---

## 11. ✅ IMMEDIATE NEXT STEPS

1. Commit changes to Git: `git init`, `git add .`, `git commit -m "V1 Snake Game MVP with UI & Vitest"`
2. Publish `dist/` live on Vercel / Netlify / GitHub Pages.
3. Share live link with friends for testing before beginning V2 enhancements!

---

## 12. 📝 UPDATE LOG

| Date | Update |
| :--- | :--- |
| 1 Sep 2026 | Master PRD created. V1 (Web) to V3 (Mobile Expo) roadmap finalized. |
| 1 Sep 2026 | V1 Implementation completed: Phaser 3 engine, Arcade UI shell, 23/23 passing Vitest unit tests, `.gitignore` added, and V1 Live Deployment Plan included. |