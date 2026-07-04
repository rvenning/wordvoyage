// Core gameplay: letter wheel, crossword grid, scoring, hints, celebrations.

const Game = {
  profile: null,
  progress: null,
  levelIdx: 0,
  level: null,
  grid: null,
  cellEls: new Map(),   // "x,y" -> element
  wordCells: new Map(), // word -> ["x,y", ...]
  found: new Set(),
  foundBonus: new Set(),
  hintCells: new Set(),
  levelScore: 0,
  wheelLetters: [],
  selection: [],
  dragging: false,

  el(id) { return document.getElementById(id); },

  start(profile, levelIdx, resume = false) {
    this.profile = profile;
    this.progress = Storage.getProgress(profile.id);
    this.levelIdx = levelIdx;
    this.level = LEVELS[levelIdx];
    this.found = new Set();
    this.foundBonus = new Set();
    this.hintCells = new Set();
    this.levelScore = 0;

    if (resume && this.progress.current && this.progress.current.levelIdx === levelIdx) {
      const c = this.progress.current;
      this.found = new Set(c.found || []);
      this.foundBonus = new Set(c.foundBonus || []);
      this.hintCells = new Set(c.hintCells || []);
      this.levelScore = c.score || 0;
    }

    this.grid = buildGrid(this.level.words);
    this.buildGridDom();
    this.buildWheel();
    this.updateHud();
    this.saveState();

    document.body.style.setProperty("--theme-a", this.level.theme[0]);
    document.body.style.setProperty("--theme-b", this.level.theme[1]);
    App.showScreen("game");
  },

  // ---------- grid ----------
  buildGridDom() {
    const wrap = this.el("game-grid");
    wrap.innerHTML = "";
    wrap.style.setProperty("--cols", this.grid.cols);
    wrap.style.setProperty("--rows", this.grid.rows);
    this.cellEls.clear();
    this.wordCells.clear();

    for (const p of this.grid.placements) {
      const keys = [];
      for (let i = 0; i < p.word.length; i++) {
        const x = p.x + (p.dir === "H" ? i : 0);
        const y = p.y + (p.dir === "V" ? i : 0);
        keys.push(x + "," + y);
      }
      this.wordCells.set(p.word, keys);
    }

    for (const [k, letter] of this.grid.cells) {
      const [x, y] = k.split(",").map(Number);
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.gridColumn = x + 1;
      cell.style.gridRow = y + 1;
      cell.dataset.letter = letter;
      wrap.appendChild(cell);
      this.cellEls.set(k, cell);
    }

    // Restore already-found words and hint letters (for resumed games).
    for (const w of this.found) this.revealWord(w, false);
    for (const k of this.hintCells) this.revealCell(k, false);
  },

  revealCell(key, animate = true) {
    const cell = this.cellEls.get(key);
    if (!cell || cell.classList.contains("filled")) return;
    cell.textContent = cell.dataset.letter;
    cell.classList.add("filled", "hinted");
    if (animate) cell.classList.add("pop");
  },

  revealWord(word, animate = true) {
    const keys = this.wordCells.get(word) || [];
    keys.forEach((k, i) => {
      const cell = this.cellEls.get(k);
      if (!cell) return;
      const doFill = () => {
        cell.textContent = cell.dataset.letter;
        cell.classList.remove("hinted");
        cell.classList.add("filled");
        if (animate) {
          cell.classList.remove("pop");
          void cell.offsetWidth; // restart animation
          cell.classList.add("pop");
        }
      };
      animate ? setTimeout(doFill, i * 70) : doFill();
    });
  },

  // ---------- wheel ----------
  buildWheel() {
    this.wheelLetters = this.level.letters.split("");
    this.shuffleWheel(false);
    const wheel = this.el("wheel");
    if (!wheel.dataset.bound) {
      wheel.dataset.bound = "1";
      wheel.addEventListener("pointerdown", e => this.onPointerDown(e));
      wheel.addEventListener("pointermove", e => this.onPointerMove(e));
      wheel.addEventListener("pointerup", () => this.onPointerUp());
      wheel.addEventListener("pointercancel", () => this.onPointerUp());
    }
  },

  shuffleWheel(sound = true) {
    if (sound) Sfx.click();
    for (let i = this.wheelLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.wheelLetters[i], this.wheelLetters[j]] = [this.wheelLetters[j], this.wheelLetters[i]];
    }
    const wheel = this.el("wheel");
    wheel.querySelectorAll(".wheel-letter").forEach(n => n.remove());
    const n = this.wheelLetters.length;
    const rect = wheel.clientWidth || 260, R = rect / 2 - 34, cx = rect / 2, cy = rect / 2;
    this.wheelLetters.forEach((letter, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const div = document.createElement("div");
      div.className = "wheel-letter";
      div.textContent = letter;
      div.dataset.index = i;
      div.style.left = (cx + R * Math.cos(angle) - 26) + "px";
      div.style.top = (cy + R * Math.sin(angle) - 26) + "px";
      wheel.appendChild(div);
    });
    this.clearSelection();
  },

  letterAt(e) {
    const wheel = this.el("wheel");
    const r = wheel.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    let best = null, bestD = 34;
    wheel.querySelectorAll(".wheel-letter").forEach(el => {
      const cx = el.offsetLeft + 26, cy = el.offsetTop + 26;
      const d = Math.hypot(px - cx, py - cy);
      if (d < bestD) { bestD = d; best = el; }
    });
    return best;
  },

  onPointerDown(e) {
    Sfx.init();
    const el = this.letterAt(e);
    if (!el) return;
    this.dragging = true;
    this.el("wheel").setPointerCapture(e.pointerId);
    this.clearSelection();
    this.addToSelection(el);
  },

  onPointerMove(e) {
    if (!this.dragging) return;
    const el = this.letterAt(e);
    this.drawLines(e);
    if (!el) return;
    const idx = Number(el.dataset.index);
    const pos = this.selection.indexOf(idx);
    if (pos === -1) {
      this.addToSelection(el);
    } else if (pos === this.selection.length - 2) {
      // Dragged back onto the previous letter: undo the last one.
      const removed = this.selection.pop();
      this.el("wheel").querySelector(`.wheel-letter[data-index="${removed}"]`).classList.remove("selected");
      Sfx.letterUndo();
      this.updateCurrentWord();
    }
  },

  onPointerUp() {
    if (!this.dragging) return;
    this.dragging = false;
    this.submitSelection();
  },

  addToSelection(el) {
    const idx = Number(el.dataset.index);
    this.selection.push(idx);
    el.classList.add("selected");
    Sfx.letterPick(this.selection.length - 1);
    this.updateCurrentWord();
    this.drawLines();
  },

  clearSelection() {
    this.selection = [];
    this.el("wheel").querySelectorAll(".wheel-letter.selected").forEach(n => n.classList.remove("selected"));
    this.updateCurrentWord();
    this.drawLines();
  },

  currentWord() {
    return this.selection.map(i => this.wheelLetters[i]).join("");
  },

  updateCurrentWord() {
    const el = this.el("current-word");
    el.textContent = this.currentWord();
    el.classList.toggle("visible", this.selection.length > 0);
  },

  drawLines(e) {
    const svg = this.el("wheel-lines");
    const wheel = this.el("wheel");
    let pts = this.selection.map(i => {
      const el = wheel.querySelector(`.wheel-letter[data-index="${i}"]`);
      return (el.offsetLeft + 26) + "," + (el.offsetTop + 26);
    });
    if (e && this.dragging) {
      const r = wheel.getBoundingClientRect();
      pts.push((e.clientX - r.left) + "," + (e.clientY - r.top));
    }
    svg.innerHTML = pts.length > 1 ? `<polyline points="${pts.join(" ")}" />` : "";
  },

  // ---------- word submission ----------
  submitSelection() {
    const word = this.currentWord();
    this.clearSelection();
    if (word.length < 2) return;

    if (this.found.has(word) || this.foundBonus.has(word)) {
      Sfx.duplicate();
      this.toast("Already found!", "dup");
      return;
    }
    if (this.level.words.includes(word)) {
      this.wordFound(word);
    } else if (this.level.bonus.includes(word)) {
      this.bonusFound(word);
    } else {
      Sfx.wrong();
      const cw = this.el("current-word");
      cw.textContent = word;
      cw.classList.add("visible", "shake");
      setTimeout(() => { cw.classList.remove("shake", "visible"); }, 450);
    }
  },

  wordFound(word, silent = false) {
    this.found.add(word);
    const pts = wordScore(word);
    const coins = wordCoins(word);
    this.levelScore += pts;
    this.progress.coins += coins;
    if (!silent) {
      Sfx.wordFound(word.length);
      this.revealWord(word);
      this.floatScore("+" + pts);
    }
    this.updateHud();
    this.saveState();
    if (this.found.size === this.level.words.length) {
      setTimeout(() => this.levelComplete(), word.length * 70 + 400);
    }
  },

  bonusFound(word) {
    this.foundBonus.add(word);
    this.levelScore += BONUS_SCORE;
    this.progress.coins += BONUS_COINS;
    Sfx.bonusWord();
    Sfx.coin();
    this.toast("✨ Bonus word! +" + BONUS_COINS + " coins", "bonus");
    this.updateHud();
    this.saveState();
  },

  useHint() {
    Sfx.init();
    if (this.progress.coins < HINT_COST) {
      this.toast("Need " + HINT_COST + " coins for a hint!", "dup");
      Sfx.wrong();
      return;
    }
    // Random unfilled cell.
    const open = [...this.cellEls.entries()].filter(([, el]) => !el.classList.contains("filled"));
    if (!open.length) return;
    const [key] = open[Math.floor(Math.random() * open.length)];
    this.progress.coins -= HINT_COST;
    this.hintCells.add(key);
    this.revealCell(key);
    Sfx.hint();
    this.updateHud();

    // A word entirely revealed by hints counts as found.
    for (const [word, keys] of this.wordCells) {
      if (this.found.has(word)) continue;
      if (keys.every(k => this.cellEls.get(k).classList.contains("filled"))) {
        this.found.add(word);
        this.levelScore += wordScore(word);
        this.updateHud();
        if (this.found.size === this.level.words.length) {
          setTimeout(() => this.levelComplete(), 500);
          break;
        }
      }
    }
    this.saveState();
  },

  // ---------- persistence ----------
  saveState() {
    this.progress.current = {
      levelIdx: this.levelIdx,
      found: [...this.found],
      foundBonus: [...this.foundBonus],
      hintCells: [...this.hintCells],
      score: this.levelScore,
    };
    Storage.saveProgress(this.profile.id, this.progress);
  },

  levelComplete() {
    const best = this.progress.levels[this.levelIdx];
    if (!best || this.levelScore > best.score) {
      this.progress.levels[this.levelIdx] = { score: this.levelScore, bonus: this.foundBonus.size };
    }
    this.progress.current = null;
    Storage.saveProgress(this.profile.id, this.progress);

    Sfx.levelComplete();
    Confetti.burst();
    this.el("lc-score").textContent = this.levelScore.toLocaleString();
    this.el("lc-bonus").textContent = this.foundBonus.size;
    this.el("lc-title").textContent = this.level.emoji + " Level " + (this.levelIdx + 1) + " complete!";
    const next = this.levelIdx + 1;
    this.el("btn-next-level").style.display = next < LEVELS.length ? "" : "none";
    this.el("lc-finished").style.display = next < LEVELS.length ? "none" : "";
    this.el("level-complete").classList.add("visible");
  },

  nextLevel() {
    this.el("level-complete").classList.remove("visible");
    Sfx.click();
    const next = this.levelIdx + 1;
    if (next < LEVELS.length) this.start(this.profile, next);
    else App.showMap();
  },

  // ---------- hud + fx ----------
  updateHud() {
    this.el("hud-coins").textContent = this.progress.coins;
    this.el("hud-score").textContent = this.levelScore.toLocaleString();
    this.el("hud-level").textContent = this.level.emoji + " " + this.level.destName + " " + (this.level.indexInDest + 1) + "/8";
    this.el("hud-bonus").textContent = "✨" + this.foundBonus.size;
  },

  toast(msg, kind) {
    const t = document.createElement("div");
    t.className = "toast " + (kind || "");
    t.textContent = msg;
    this.el("screen-game").appendChild(t);
    setTimeout(() => t.remove(), 1600);
  },

  floatScore(text) {
    const f = document.createElement("div");
    f.className = "float-score";
    f.textContent = text;
    this.el("screen-game").appendChild(f);
    setTimeout(() => f.remove(), 1100);
  },
};

// ---------- confetti ----------
const Confetti = {
  burst() {
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");
    canvas.width = innerWidth; canvas.height = innerHeight;
    const colors = ["#ff5252", "#ffb142", "#fffa65", "#32ff7e", "#18dcff", "#cd84f1", "#ffcccc"];
    const parts = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 10,
      vy: 2 + Math.random() * 3.5,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      vr: -0.15 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    const t0 = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (t - t0 < 3200) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    })(t0);
  },
};
