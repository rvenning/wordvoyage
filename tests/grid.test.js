"use strict";
// Grid + level-data tests for WordVoyage. buildGrid() packs a level's words
// into a connected crossword; these run it over every shipped level and assert
// the invariants that matter, so this doubles as a level-data linter — a typo'd
// word or an unpackable level fails here at commit time instead of in a kid's
// hands.
//
//   cd WordVoyage && node --test
//
// levels.js and grid.js are plain browser scripts using top-level `const`, so
// they're concatenated and run as ONE vm program (separate runs wouldn't share
// the lexical bindings), then the pieces we need are exported to the sandbox.

const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const JS = path.join(__dirname, "..", "js");

function load() {
  const sandbox = { console };
  vm.createContext(sandbox);
  const src =
    fs.readFileSync(path.join(JS, "levels.js"), "utf8") + "\n" +
    fs.readFileSync(path.join(JS, "grid.js"), "utf8") + "\n" +
    ";globalThis.__wv = { DESTINATIONS, LEVELS, buildGrid };";
  vm.runInContext(src, sandbox, { filename: "wv-bundle.js" });
  return sandbox.__wv;
}

const { LEVELS, buildGrid } = load();
const label = (lv) => `${lv.destName} ${lv.indexInDest + 1}`;

// Cell keys a placement occupies, given the grid's H/V convention.
function cellsOf(p) {
  const keys = [];
  for (let i = 0; i < p.word.length; i++) {
    const x = p.x + (p.dir === "H" ? i : 0);
    const y = p.y + (p.dir === "V" ? i : 0);
    keys.push(x + "," + y);
  }
  return keys;
}

// True if `word` can be spelled from the multiset of wheel `letters`.
function formable(word, letters) {
  const pool = {};
  for (const c of letters) pool[c] = (pool[c] || 0) + 1;
  for (const c of word) { if (!pool[c]) return false; pool[c]--; }
  return true;
}

// Collect failures across all levels and assert none, so one run surfaces every
// offending level rather than stopping at the first.
function checkAll(fn) {
  const fails = [];
  for (const lv of LEVELS) {
    try { fn(lv, buildGrid(lv.words)); }
    catch (e) { fails.push(`${label(lv)}: ${e.message}`); }
  }
  assert.equal(fails.length, 0, fails.length ? "\n  - " + fails.join("\n  - ") : "");
}

test(`sanity: ${LEVELS.length} levels loaded`, () => {
  assert.ok(LEVELS.length >= 100, "expected the full level list");
});

test("every level places all its words exactly once", () => {
  checkAll((lv, g) => {
    const placed = g.placements.map((p) => p.word).sort();
    const want = [...lv.words].sort();
    assert.deepEqual(placed, want, `placed ${JSON.stringify(placed)} vs words ${JSON.stringify(want)}`);
  });
});

test("every level's grid is letter-consistent (crossings agree, no orphan cells, tight bounds)", () => {
  checkAll((lv, g) => {
    const claimed = new Set();
    for (const p of g.placements) {
      cellsOf(p).forEach((key, i) => {
        assert.equal(g.cells.get(key), p.word[i], `cell ${key} should be "${p.word[i]}" for ${p.word}`);
        claimed.add(key);
      });
    }
    // no cell exists that isn't part of some placed word
    for (const key of g.cells.keys()) assert.ok(claimed.has(key), `orphan cell ${key}`);
    // bounding box is 0-based and tight
    let maxX = 0, maxY = 0;
    for (const key of g.cells.keys()) {
      const [x, y] = key.split(",").map(Number);
      assert.ok(x >= 0 && y >= 0, `negative coord ${key}`);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
    assert.equal(g.cols, maxX + 1, "cols not tight");
    assert.equal(g.rows, maxY + 1, "rows not tight");
  });
});

// Whether a level's crossword is a single connected component.
function isConnected(g) {
  const n = g.placements.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const sets = g.placements.map(cellsOf).map((ks) => new Set(ks));
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if ([...sets[i]].some((k) => sets[j].has(k))) parent[find(i)] = find(j);
  return new Set(parent.map((_, i) => find(i))).size === 1;
}

// Levels whose words share almost all their letters (mutual anagrams like
// BEAR/BARE/EAR/ARE/BAR) can't be interlocked into one grid by the greedy
// packer, so buildGrid parks the odd word on its own row. These stay fully
// playable — the grid just renders as separate clusters. Known + accepted; the
// test below still fails if a NEW level becomes disconnected.
const KNOWN_DISCONNECTED = new Set([
  "Tokyo 4", "Tokyo 6", "Tokyo 8", "Rome 1", "London 1", "Athens 1", "Nairobi 4",
]);

test("no level is unexpectedly disconnected (regression guard)", () => {
  const surprises = LEVELS
    .filter((lv) => !isConnected(buildGrid(lv.words)) && !KNOWN_DISCONNECTED.has(label(lv)))
    .map(label);
  assert.deepEqual(surprises, [], `newly disconnected level(s): ${surprises.join(", ")}`);
});

test("every word is spellable from the level's wheel letters", () => {
  checkAll((lv) => {
    for (const w of lv.words)
      assert.ok(formable(w, lv.letters), `"${w}" can't be made from "${lv.letters}"`);
  });
});

test("every bonus word is spellable from the level's wheel letters", () => {
  checkAll((lv) => {
    for (const w of lv.bonus)
      assert.ok(formable(w, lv.letters), `bonus "${w}" can't be made from "${lv.letters}"`);
  });
});

test("no word is listed as both a puzzle word and a bonus word", () => {
  checkAll((lv) => {
    const words = new Set(lv.words);
    for (const b of lv.bonus) assert.ok(!words.has(b), `"${b}" is in both words and bonus`);
  });
});
