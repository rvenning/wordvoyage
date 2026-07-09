# WordVoyage 🌍

A family word-puzzle adventure. Swipe letters on the wheel to spell words, fill the
crossword grid, and travel through 7 destinations and 56 levels — Sydney to Rio.

**Play it:** https://rvenning.github.io/wordvoyage/

## Features
- 🎡 Swipe-the-wheel word building (touch + mouse)
- 🗺️ 7 destinations × 8 levels with a gentle-to-tricky difficulty curve
- ✨ Bonus words, coins, and hints (💡 costs 100 coins)
- 👨‍👩‍👧 Pick-a-name family profiles — no passwords
- 🔒 Optional 4-digit PIN per profile (guards playing, PIN changes, and deletion); admin override code unlocks any profile
- 🏆 Shared family leaderboard
- 💾 Auto-save: quit mid-level and resume on any device
- 🔊 All sound effects synthesized with WebAudio (no asset downloads)
- ☁️ Firebase Firestore sync (falls back to localStorage offline)
- 📲 Installable PWA: "Add to Home Screen" button (native prompt on Chrome/Android, guided steps on iOS Safari), offline play via service worker

## PWA files
- `manifest.json` — app identity: name, icons, standalone display, theme colours
- `sw.js` — service worker; precaches the app shell, then network-first with cache fallback (online players always get the newest deploy, offline players get the last one they loaded)
- `js/pwa.js` — registers the worker and drives the install button (`beforeinstallprompt` / `appinstalled` on Chrome, instruction modal on iOS)
- `icons/` — 192/512 PNG app icons plus a maskable variant for Android adaptive icons

## Local development
No build step — it's plain HTML/CSS/JS. Serve the folder with any static server:

```powershell
powershell -ExecutionPolicy Bypass -File tools/serve.ps1   # http://localhost:8080
```

## Storage
Progress lives in `localStorage` and mirrors to Cloud Firestore
(collection `wordvoyage`, config in `js/firebase-config.js`). The Firebase API key
is public by design; access is limited by Firestore security rules. Set
`window.FIREBASE_CONFIG = null` to run fully offline.
