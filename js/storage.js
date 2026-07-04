// Persistence: localStorage is the always-available store; when Firebase is
// configured, profiles + progress are mirrored to Firestore (collection
// "wordvoyage") so the family shares one leaderboard across devices.

const Storage = {
  fb: null, // { db, doc, setDoc, getDocs, collection } when Firebase is live
  online: false,

  // ---------- local ----------
  _get(k, fallback) {
    try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
  },
  _set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },

  getSettings() { return this._get("wv_settings", { sound: true, lastProfile: null }); },
  saveSettings(s) { this._set("wv_settings", s); },

  getProfiles() { return this._get("wv_profiles", []); },
  saveProfiles(profiles) { this._set("wv_profiles", profiles); },

  blankProgress() {
    return { coins: 0, levels: {}, current: null, updated: 0 };
    // levels: { [levelIdx]: { score, bonus } } best results per level
    // current: { levelIdx, found: [], foundBonus: [], score, hintCells: [] }
  },

  getProgress(profileId) { return this._get("wv_progress_" + profileId, this.blankProgress()); },

  saveProgress(profileId, progress) {
    progress.updated = Date.now();
    this._set("wv_progress_" + profileId, progress);
    this._pushProgress(profileId, progress);
  },

  addProfile(name, avatar) {
    const profiles = this.getProfiles();
    const p = { id: "p" + Date.now() + Math.floor(Math.random() * 1e4), name, avatar, created: Date.now() };
    profiles.push(p);
    this.saveProfiles(profiles);
    this._pushProfile(p);
    return p;
  },

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

  // ---------- Firebase sync ----------
  async initFirebase() {
    const cfg = window.FIREBASE_CONFIG;
    if (!cfg || !cfg.apiKey) return false;
    try {
      const appMod = await import("https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js");
      const fsMod = await import("https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js");
      const app = appMod.initializeApp(cfg);
      const db = fsMod.getFirestore(app);
      this.fb = { db, ...fsMod };
      await this._syncDown();
      this.online = true;
      return true;
    } catch (e) {
      console.warn("Firebase unavailable, running on localStorage only:", e);
      return false;
    }
  },

  async _syncDown() {
    const { db, collection, getDocs } = this.fb;
    const snap = await getDocs(collection(db, "wordvoyage"));
    const remoteProfiles = [];
    const remoteProgress = {};
    snap.forEach(d => {
      const v = d.data();
      if (d.id.startsWith("profile_")) remoteProfiles.push(v);
      if (d.id.startsWith("progress_")) remoteProgress[d.id.slice(9)] = v;
    });

    // Merge profiles by id.
    const local = this.getProfiles();
    const byId = new Map(local.map(p => [p.id, p]));
    let changed = false;
    for (const rp of remoteProfiles) {
      if (!byId.has(rp.id)) { byId.set(rp.id, rp); changed = true; }
    }
    if (changed || remoteProfiles.length !== local.length) this.saveProfiles([...byId.values()]);

    // Push any local-only profiles up.
    const remoteIds = new Set(remoteProfiles.map(p => p.id));
    for (const p of byId.values()) if (!remoteIds.has(p.id)) this._pushProfile(p);

    // Merge progress: best score per level, max coins, newest in-progress game.
    for (const [pid, remote] of Object.entries(remoteProgress)) {
      const loc = this.getProgress(pid);
      const merged = this._mergeProgress(loc, remote);
      this._set("wv_progress_" + pid, merged);
    }
  },

  _mergeProgress(a, b) {
    const levels = { ...a.levels };
    for (const [idx, lv] of Object.entries(b.levels || {})) {
      if (!levels[idx] || (lv.score || 0) > (levels[idx].score || 0)) levels[idx] = lv;
    }
    return {
      coins: Math.max(a.coins || 0, b.coins || 0),
      levels,
      current: (b.updated || 0) > (a.updated || 0) ? b.current : a.current,
      updated: Math.max(a.updated || 0, b.updated || 0),
    };
  },

  _pushProfile(p) {
    if (!this.fb) return;
    const { db, doc, setDoc } = this.fb;
    setDoc(doc(db, "wordvoyage", "profile_" + p.id), p).catch(e => console.warn("sync profile failed", e));
  },

  _pushProgress(pid, progress) {
    if (!this.fb) return;
    const { db, doc, setDoc } = this.fb;
    setDoc(doc(db, "wordvoyage", "progress_" + pid), progress).catch(e => console.warn("sync progress failed", e));
  },
};
