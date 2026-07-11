// App shell: screen navigation, world map, leaderboard.
// Profiles, PINs, the delete flow and the PWA install button all come from
// gamekit (GK.Profiles / GK.UI / GK.initPWA) — App keeps only what is
// WordVoyage-specific.

const AVATARS = ["🦊", "🐼", "🦄", "🐸", "🐯", "🦁", "🐨", "🐷", "🦋", "🐙", "🦖", "🐹"];

const App = {
  profile: null,

  el(id) { return document.getElementById(id); },

  async init() {
    Sfx.enabled = Storage.getSettings().sound;
    GK.UI.onScreenChange = (name) => { if (name === "splash") this.refreshSplash(); };
    GK.UI.bindSoundToggle(Storage);

    GK.Profiles.init({
      storage: Storage,
      avatars: AVATARS,
      meta: (p, prog) => `⭐ ${Storage.totalScore(prog).toLocaleString()} · 🪙 ${prog.coins}`,
      onEnter: (p) => { this.profile = p; this.showMap(); },
      addLabel: "New Explorer",
    });

    GK.initPWA({ appName: "WordVoyage" });

    this.showScreen("splash");
    // Firebase sync happens in the background; the game is playable immediately.
    Storage.initFirebase().then(ok => {
      this.el("sync-badge").textContent = ok ? "☁️ synced" : "📴 offline";
      // refresh whatever the player is looking at with the merged data
      if (ok && GK.UI.screen === "profiles") GK.Profiles.renderList();
      if (ok && GK.UI.screen === "splash") this.refreshSplash();
    });
  },

  showScreen(name) { GK.UI.showScreen(name); },

  // One-tap "Continue as <last explorer>" on the splash; Start becomes Switch.
  refreshSplash() {
    const last = GK.Profiles.lastProfile();
    const cont = this.el("btn-continue-as"), start = this.el("btn-start");
    if (last) {
      cont.style.display = "";
      cont.textContent = `✈️ Continue as ${last.avatar} ${last.name}`;
      cont.onclick = () => { Sfx.init(); GK.Profiles.select(last); };
      start.classList.add("ghost");
      start.textContent = "👥 Switch Explorer";
    } else {
      cont.style.display = "none";
      start.classList.remove("ghost");
      start.textContent = "✈️ Start the Voyage";
    }
  },

  // ---------- splash ----------
  play() {
    Sfx.init(); Sfx.click();
    GK.Profiles.renderList();
    this.showScreen("profiles");
  },

  // ---------- map ----------
  showMap() {
    if (!this.profile) return this.play();
    const prog = Storage.getProgress(this.profile.id);
    const unlocked = Storage.unlockedLevel(prog);

    this.el("map-player").innerHTML = `${this.profile.avatar} <b>${GK.util.esc(this.profile.name)}</b>
      <span class="pmeta">⭐ ${Storage.totalScore(prog).toLocaleString()} · 🪙 ${prog.coins}</span>`;

    // Continue button: resume an in-progress level, or start the next one.
    const cont = this.el("btn-continue");
    if (prog.current && prog.current.levelIdx < LEVELS.length) {
      const lv = LEVELS[prog.current.levelIdx];
      cont.innerHTML = `▶️ Resume ${lv.emoji} ${lv.destName} ${lv.indexInDest + 1} <small>(${prog.current.found.length}/${lv.words.length} words)</small>`;
      cont.onclick = () => { Sfx.click(); Game.start(this.profile, prog.current.levelIdx, true); };
      cont.style.display = "";
    } else if (unlocked < LEVELS.length) {
      const lv = LEVELS[unlocked];
      cont.innerHTML = `▶️ Play ${lv.emoji} ${lv.destName} ${lv.indexInDest + 1}`;
      cont.onclick = () => { Sfx.click(); Game.start(this.profile, unlocked); };
      cont.style.display = "";
    } else {
      cont.style.display = "none";
    }

    const wrap = this.el("dest-list");
    wrap.innerHTML = "";
    let levelIdx = 0;
    DESTINATIONS.forEach(dest => {
      const start = levelIdx;
      const done = dest.levels.filter((_, i) => prog.levels[start + i]).length;
      const destUnlocked = start <= unlocked;
      const card = document.createElement("div");
      card.className = "dest-card" + (destUnlocked ? "" : " locked");
      card.style.setProperty("--grad-a", dest.theme[0]);
      card.style.setProperty("--grad-b", dest.theme[1]);
      const dots = dest.levels.map((_, i) => {
        const gi = start + i;
        const cls = prog.levels[gi] ? "done" : gi === unlocked ? "next" : gi < unlocked ? "done" : "locked";
        const icon = prog.levels[gi] ? "✓" : gi === unlocked ? "▶" : "🔒";
        return `<button class="lvl-dot ${cls}" data-level="${gi}" ${gi > unlocked ? "disabled" : ""}>${icon}</button>`;
      }).join("");
      card.innerHTML = `
        <div class="dest-head">
          <span class="dest-emoji">${dest.emoji}</span>
          <div><div class="dest-name">${dest.flag} ${dest.name}</div>
          <div class="dest-tag">${destUnlocked ? dest.tagline : "Complete " + "earlier destinations to unlock!"}</div></div>
          <span class="dest-progress">${done}/8</span>
        </div>
        <div class="dots">${dots}</div>`;
      wrap.appendChild(card);
      levelIdx += dest.levels.length;
    });
    wrap.querySelectorAll(".lvl-dot:not([disabled])").forEach(b => {
      b.onclick = () => {
        Sfx.click();
        const gi = Number(b.dataset.level);
        const prog2 = Storage.getProgress(this.profile.id);
        const resume = prog2.current && prog2.current.levelIdx === gi;
        Game.start(this.profile, gi, resume);
      };
    });

    this.showScreen("map");
  },

  // ---------- leaderboard ----------
  showLeaderboard() {
    Sfx.click();
    GK.Profiles.renderLeaderboard("lb-rows", {
      cols: r => `<span class="lb-levels">🗺️ ${Object.keys(r.progress.levels).length}</span>
        <span class="lb-score">⭐ ${Storage.totalScore(r.progress).toLocaleString()}</span>`,
      sort: (a, b) => Storage.totalScore(b.progress) - Storage.totalScore(a.progress),
      meId: this.profile?.id,
      empty: "No explorers yet — play a level!",
    });
    this.showScreen("leaderboard");
  },
};

window.addEventListener("DOMContentLoaded", () => App.init());
