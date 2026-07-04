// WebAudio sound effects — everything synthesized, no audio files needed.
const Sfx = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  },

  tone({ freq = 440, type = "sine", dur = 0.15, vol = 0.25, when = 0, slide = 0 }) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  },

  // Rising pitch as each letter is added to the selection.
  letterPick(index) {
    this.tone({ freq: 420 * Math.pow(2, index / 12), type: "triangle", dur: 0.09, vol: 0.2 });
  },

  letterUndo() {
    this.tone({ freq: 300, type: "triangle", dur: 0.08, vol: 0.15, slide: -80 });
  },

  // Cheerful arpeggio scaled to word length.
  wordFound(len) {
    const base = 520;
    const steps = Math.min(len, 6);
    for (let i = 0; i < steps; i++) {
      this.tone({ freq: base * Math.pow(2, [0, 4, 7, 12, 16, 19][i] / 12), type: "triangle", dur: 0.16, vol: 0.22, when: i * 0.06 });
    }
  },

  bonusWord() {
    [880, 1175, 1568].forEach((f, i) => this.tone({ freq: f, type: "sine", dur: 0.12, vol: 0.18, when: i * 0.05 }));
  },

  coin() {
    this.tone({ freq: 990, type: "square", dur: 0.07, vol: 0.12 });
    this.tone({ freq: 1320, type: "square", dur: 0.18, vol: 0.12, when: 0.07 });
  },

  wrong() {
    this.tone({ freq: 160, type: "sawtooth", dur: 0.25, vol: 0.18, slide: -60 });
  },

  duplicate() {
    this.tone({ freq: 350, type: "sine", dur: 0.1, vol: 0.15 });
    this.tone({ freq: 350, type: "sine", dur: 0.1, vol: 0.15, when: 0.12 });
  },

  hint() {
    this.tone({ freq: 700, type: "sine", dur: 0.3, vol: 0.2, slide: 500 });
  },

  levelComplete() {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((f, i) => this.tone({ freq: f, type: "triangle", dur: 0.25, vol: 0.25, when: i * 0.12 }));
    notes.forEach((f, i) => this.tone({ freq: f / 2, type: "sine", dur: 0.3, vol: 0.15, when: i * 0.12 }));
  },

  click() {
    this.tone({ freq: 600, type: "sine", dur: 0.05, vol: 0.1 });
  },
};
