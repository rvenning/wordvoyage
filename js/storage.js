// Persistence: gamekit storage (lib/gk-storage.js) configured for WordVoyage.
// Same wv_* localStorage keys and "wordvoyage" Firestore collection as the
// pre-gamekit implementation, so all existing profiles and progress carry
// over unchanged. WordVoyage-specific scoring helpers live below.

const Storage = GK.createStorage({
  prefix: "wv",
  collection: "wordvoyage",
  firebaseConfig: window.FIREBASE_CONFIG, // from js/firebase-config.js; null = offline
  blankProgress: () => ({ coins: 0, levels: {}, current: null, updated: 0 }),
  // levels: { [levelIdx]: { score, bonus } } best results per level
  // current: { levelIdx, found: [], foundBonus: [], score, hintCells: [] }
  // Cross-device merge: best score per level, max coins, newest in-progress game.
  mergeProgress: (a, b) => {
    const levels = { ...a.levels };
    for (const [idx, lv] of Object.entries(b.levels || {})) {
      if (!levels[idx] || (lv.score || 0) > (levels[idx].score || 0)) levels[idx] = lv;
    }
    return {
      coins: Math.max(a.coins || 0, b.coins || 0),
      levels,
      current: (b.updated || 0) > (a.updated || 0) ? b.current : a.current,
    };
  },
});

/* ----- WordVoyage-specific helpers on top of the kit storage ----- */
Object.assign(Storage, {
  totalScore(progress) {
    return Object.values(progress.levels).reduce((s, l) => s + (l.score || 0), 0);
  },

  leaderboard() {
    return this.getProfiles().map(p => {
      const prog = this.getProgress(p.id);
      return {
        ...p,
        score: this.totalScore(prog),
        levelsDone: Object.keys(prog.levels).length,
        coins: prog.coins,
      };
    }).sort((a, b) => b.score - a.score);
  },

  // Highest completed level index + 1 = next unlocked level.
  unlockedLevel(progress) {
    let max = -1;
    for (const k of Object.keys(progress.levels)) max = Math.max(max, Number(k));
    return max + 1;
  },
});
