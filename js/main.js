// App shell: screen navigation, profiles, world map, leaderboard.

const AVATARS = ["🦊", "🐼", "🦄", "🐸", "🐯", "🦁", "🐨", "🐷", "🦋", "🐙", "🦖", "🐹"];

const App = {
  profile: null,

  el(id) { return document.getElementById(id); },

  async init() {
    const settings = Storage.getSettings();
    Sfx.enabled = settings.sound;
    this.updateSoundButton();

    this.showScreen("splash");
    // Firebase sync happens in the background; the game is playable immediately.
    Storage.initFirebase().then(ok => {
      this.el("sync-badge").textContent = ok ? "☁️ synced" : "📴 offline";
      if (ok && document.querySelector("#screen-profiles.active")) this.renderProfiles();
    });
  },

  showScreen(name) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    this.el("screen-" + name).classList.add("active");
  },

  // ---------- splash ----------
  play() {
    Sfx.init(); Sfx.click();
    this.renderProfiles();
    this.showScreen("profiles");
  },

  // ---------- profiles ----------
  renderProfiles() {
    const wrap = this.el("profile-list");
    wrap.innerHTML = "";
    for (const p of Storage.getProfiles()) {
      const prog = Storage.getProgress(p.id);
      const div = document.createElement("div");
      div.className = "profile-card";
      div.setAttribute("role", "button");
      div.innerHTML = `<span class="avatar">${p.avatar}</span><span class="pname">${this.esc(p.name)}</span>
        <span class="pmeta">⭐ ${Storage.totalScore(prog).toLocaleString()} · 🪙 ${prog.coins}</span>
        <button class="pdelete" title="Delete profile">🗑️</button>`;
      div.onclick = () => this.selectProfile(p);
      div.querySelector(".pdelete").onclick = (ev) => this.askDeleteProfile(p, ev);
      wrap.appendChild(div);
    }
    const add = document.createElement("div");
    add.className = "profile-card add";
    add.setAttribute("role", "button");
    add.innerHTML = `<span class="avatar">➕</span><span class="pname">New Explorer</span>`;
    add.onclick = () => this.showNewProfile();
    wrap.appendChild(add);
  },

  // ---------- delete profile ----------
  askDeleteProfile(p, ev) {
    ev.stopPropagation();
    Sfx.click();
    this._deleting = p;
    this.el("del-title").textContent = `Delete ${p.avatar} ${p.name}?`;
    this.el("del-name").textContent = p.name;
    this.el("del-confirm").value = "";
    this.el("btn-delete-confirm").disabled = true;
    this.el("delete-modal").classList.add("visible");
    this.el("del-confirm").focus();
  },

  updateDeleteButton() {
    const typed = this.el("del-confirm").value.trim().toLowerCase();
    const target = (this._deleting?.name || "").toLowerCase();
    this.el("btn-delete-confirm").disabled = typed !== target;
  },

  confirmDeleteProfile() {
    const p = this._deleting;
    if (!p) return;
    if (this.el("del-confirm").value.trim().toLowerCase() !== p.name.toLowerCase()) return;
    Storage.deleteProfile(p.id);
    if (this.profile && this.profile.id === p.id) this.profile = null;
    this._deleting = null;
    this.el("delete-modal").classList.remove("visible");
    Sfx.wrong(); // sombre "gone" sound
    this.renderProfiles();
  },

  showNewProfile() {
    Sfx.click();
    const grid = this.el("avatar-grid");
    grid.innerHTML = "";
    AVATARS.forEach((a, i) => {
      const b = document.createElement("button");
      b.className = "avatar-choice" + (i === 0 ? " selected" : "");
      b.textContent = a;
      b.onclick = () => {
        grid.querySelectorAll(".selected").forEach(n => n.classList.remove("selected"));
        b.classList.add("selected");
        Sfx.click();
      };
      grid.appendChild(b);
    });
    this.el("new-name").value = "";
    this.el("new-profile-modal").classList.add("visible");
    this.el("new-name").focus();
  },

  createProfile() {
    const name = this.el("new-name").value.trim();
    if (!name) { this.el("new-name").focus(); return; }
    const avatar = document.querySelector(".avatar-choice.selected")?.textContent || AVATARS[0];
    const p = Storage.addProfile(name.slice(0, 14), avatar);
    this.el("new-profile-modal").classList.remove("visible");
    Sfx.wordFound(4);
    this.selectProfile(p);
  },

  selectProfile(p) {
    Sfx.click();
    this.profile = p;
    const s = Storage.getSettings();
    s.lastProfile = p.id;
    Storage.saveSettings(s);
    this.showMap();
  },

  // ---------- map ----------
  showMap() {
    if (!this.profile) return this.play();
    const prog = Storage.getProgress(this.profile.id);
    const unlocked = Storage.unlockedLevel(prog);

    this.el("map-player").innerHTML = `${this.profile.avatar} <b>${this.esc(this.profile.name)}</b>
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
    const rows = Storage.leaderboard();
    const wrap = this.el("lb-rows");
    wrap.innerHTML = "";
    const medals = ["🥇", "🥈", "🥉"];
    rows.forEach((r, i) => {
      const div = document.createElement("div");
      div.className = "lb-row" + (this.profile && r.id === this.profile.id ? " me" : "");
      div.innerHTML = `<span class="lb-rank">${medals[i] || (i + 1)}</span>
        <span class="lb-avatar">${r.avatar}</span>
        <span class="lb-name">${this.esc(r.name)}</span>
        <span class="lb-levels">🗺️ ${r.levelsDone}</span>
        <span class="lb-score">⭐ ${r.score.toLocaleString()}</span>`;
      wrap.appendChild(div);
    });
    if (!rows.length) wrap.innerHTML = `<div class="lb-empty">No explorers yet — play a level!</div>`;
    this.showScreen("leaderboard");
  },

  toggleSound() {
    Sfx.enabled = !Sfx.enabled;
    const s = Storage.getSettings();
    s.sound = Sfx.enabled;
    Storage.saveSettings(s);
    this.updateSoundButton();
    Sfx.click();
  },

  updateSoundButton() {
    document.querySelectorAll(".btn-sound").forEach(b => b.textContent = Sfx.enabled ? "🔊" : "🔇");
  },

  esc(s) { return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); },
};

window.addEventListener("DOMContentLoaded", () => App.init());
