# 🐍 SNAKE GAME — MASTER PRD (V1 → V3)

> **Document Status:** Active Specification & Master Roadmap  
> **Last Updated:** 18 September 2026  
> **Owner:** Developer  
> **Version:** 2.5 (PWA & Offline Arcade Edition)  

---

## 📌 DOCUMENT PURPOSE

This document serves as the **single source of truth** for the Snake Game project:

| Phase | Scope | Platform | Status |
| :--- | :--- | :--- | :--- |
| **V1** | Classic Snake MVP | Web (Phaser 3 + Vite) | 🟢 Completed |
| **V2** | Realistic UI + Sound FX + Settings + Leaderboard | Web (Phaser 3 + Web Audio API) | 🟢 Completed |
| **V2.5** | Progressive Web App (PWA) & Offline Caching | Web / PWA (VitePWA + Workbox) | 🟢 Completed |
| **V3** | Mobile Port & Touch Controls | Expo (Android/iOS APK) | ⚪ Planned |

---

## 1. 🎯 PROJECT OVERVIEW

| Section | Detail |
| :--- | :--- |
| **Project Name** | Snake (Classic Arcade PWA Edition) |
| **Game Type** | 2D Grid-based Arcade |
| **Platform (V1-V2.5)** | Web PWA (Phaser 3 + Vite + TypeScript + vite-plugin-pwa) |
| **Platform (V3)** | Mobile APK (Expo / React Native) |
| **Target Audience** | Web Gamers & Arcade Enthusiasts |
| **Goal** | Build an ultra-responsive, realistic, 100% offline-capable web arcade game |

---

## 2. 🎮 GAME VISION

> *"A classic 2D grid arcade Snake game where players navigate using arrow keys or WASD, eat apples and wild prey to grow, avoid collisions, customize visual themes and speed difficulties, compete on a local leaderboard, and install the app to play fully offline on any device."*

---

## 3. 📊 CORE MECHANICS & PWA FEATURES

| Feature | Detail |
| :--- | :--- |
| **Grid Size** | 15×15, 20×20, 25×25 (Configurable) |
| **Snake Start** | Center cell |
| **Initial Length** | 3 blocks |
| **Movement** | Arrow keys (↑ ↓ ← →) & WASD with 180-degree turn protection |
| **Food Types** | Red Apple (1 pt), Golden Star Apple (3 pts), Wild Prey (Frogs 🐸, Bugs 🦗, Eggs 🥚, Geckos 🦎) |
| **Growth** | +1 block per food eaten |
| **Speed Tiers** | Easy (250ms), Medium (200ms), Hard (140ms), Insane (90ms) |
| **Collision** | Boundary Wall or Self Body → Game Over |
| **PWA Caching** | Workbox pre-caching for HTML/JS/CSS, Web Audio sound synthesis, icons, and Google Fonts |
| **PWA Manifest** | `manifest.webmanifest` with custom 192x192 and 512x512 cyber neon icons |