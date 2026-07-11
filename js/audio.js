// WebAudio sound effects — gamekit synth core (lib/gk-audio.js) plus
// WordVoyage's own jingles. Everything synthesized, no audio files needed.
// click/coin/wrong come from the kit defaults; levelComplete is the kit win.
const Sfx = GK.Sfx;

Object.assign(Sfx, {
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

  duplicate() {
    this.tone({ freq: 350, type: "sine", dur: 0.1, vol: 0.15 });
    this.tone({ freq: 350, type: "sine", dur: 0.1, vol: 0.15, when: 0.12 });
  },

  hint() {
    this.tone({ freq: 700, type: "sine", dur: 0.3, vol: 0.2, slide: 500 });
  },

  levelComplete() { this.win(); },
});
