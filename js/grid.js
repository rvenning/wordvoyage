// Crossword layout generator: packs a level's words into a connected grid.
// Returns { cols, rows, cells: Map "x,y"->letter, placements: [{word,x,y,dir}] }.

function buildGrid(words) {
  const sorted = [...words].sort((a, b) => b.length - a.length);
  const cells = new Map(); // "x,y" -> letter
  const placements = [];

  const key = (x, y) => x + "," + y;
  const at = (x, y) => cells.get(key(x, y));

  function canPlace(word, x, y, dir) {
    const dx = dir === "H" ? 1 : 0, dy = dir === "H" ? 0 : 1;
    // Cell immediately before and after the word must be empty.
    if (at(x - dx, y - dy) !== undefined) return false;
    if (at(x + dx * word.length, y + dy * word.length) !== undefined) return false;
    let crossings = 0;
    for (let i = 0; i < word.length; i++) {
      const cx = x + dx * i, cy = y + dy * i;
      const existing = at(cx, cy);
      if (existing !== undefined) {
        if (existing !== word[i]) return false;
        crossings++;
      } else {
        // New cell: neighbours perpendicular to our direction must be empty,
        // so we never create accidental side-by-side words.
        if (at(cx + dy, cy + dx) !== undefined) return false;
        if (at(cx - dy, cy - dx) !== undefined) return false;
      }
    }
    return crossings > 0 ? crossings : false;
  }

  function place(word, x, y, dir) {
    const dx = dir === "H" ? 1 : 0, dy = dir === "H" ? 0 : 1;
    for (let i = 0; i < word.length; i++) cells.set(key(x + dx * i, y + dy * i), word[i]);
    placements.push({ word, x, y, dir });
  }

  place(sorted[0], 0, 0, "H");

  for (let w = 1; w < sorted.length; w++) {
    const word = sorted[w];
    let best = null;
    for (const [k, letter] of cells) {
      const [cx, cy] = k.split(",").map(Number);
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== letter) continue;
        for (const dir of ["V", "H"]) {
          const x = dir === "H" ? cx - i : cx;
          const y = dir === "H" ? cy : cy - i;
          const crossings = canPlace(word, x, y, dir);
          if (crossings && (!best || crossings > best.crossings)) {
            best = { x, y, dir, crossings };
          }
        }
      }
    }
    if (best) {
      place(word, best.x, best.y, best.dir);
    } else {
      // No crossing possible: park it on a fresh row below everything.
      let maxY = -Infinity;
      for (const k of cells.keys()) maxY = Math.max(maxY, Number(k.split(",")[1]));
      place(word, 0, maxY + 2, "H");
    }
  }

  // Normalise to a 0-based bounding box.
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const k of cells.keys()) {
    const [x, y] = k.split(",").map(Number);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  const norm = new Map();
  for (const [k, v] of cells) {
    const [x, y] = k.split(",").map(Number);
    norm.set((x - minX) + "," + (y - minY), v);
  }
  const normPlacements = placements.map(p => ({ ...p, x: p.x - minX, y: p.y - minY }));

  return { cols: maxX - minX + 1, rows: maxY - minY + 1, cells: norm, placements: normPlacements };
}
