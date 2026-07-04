// WordVoyage level data.
// Each level: letters (the wheel), words (placed in the crossword grid, all
// buildable from the letters), bonus (valid extra words that earn coins).
// Levels run easy → hard across destinations for a middle (8-12) difficulty curve.

const DESTINATIONS = [
  {
    name: "Sydney", emoji: "🦘", flag: "🇦🇺", tagline: "G'day! Start your voyage down under.",
    theme: ["#f6d365", "#fda085"],
    levels: [
      { letters: "CAT",  words: ["CAT", "ACT"],                                   bonus: [] },
      { letters: "TEA",  words: ["TEA", "EAT", "ATE"],                            bonus: [] },
      { letters: "PIN",  words: ["PIN", "NIP"],                                   bonus: [] },
      { letters: "TOP",  words: ["TOP", "POT", "OPT"],                            bonus: [] },
      { letters: "NET",  words: ["NET", "TEN"],                                   bonus: [] },
      { letters: "STAR", words: ["STAR", "RATS", "ART", "TAR", "SAT"],            bonus: ["ARTS", "RAT"] },
      { letters: "SAND", words: ["SAND", "AND", "SAD", "ADS"],                    bonus: [] },
      { letters: "RAIN", words: ["RAIN", "RAN", "AIR"],                           bonus: [] },
    ],
  },
  {
    name: "Tokyo", emoji: "🗾", flag: "🇯🇵", tagline: "Neon lights and tricky letters!",
    theme: ["#a18cd1", "#fbc2eb"],
    levels: [
      { letters: "RICE",  words: ["RICE", "ICE", "IRE"],                          bonus: [] },
      { letters: "FIRE",  words: ["FIRE", "RIFE", "IRE"],                         bonus: ["FIR"] },
      { letters: "LAKE",  words: ["LAKE", "LEAK", "KALE", "ALE"],                 bonus: ["ELK"] },
      { letters: "BEAR",  words: ["BEAR", "BARE", "EAR", "ARE", "BAR"],           bonus: ["ERA"] },
      { letters: "TIME",  words: ["TIME", "ITEM", "EMIT", "TIE", "MET"],          bonus: ["MITE"] },
      { letters: "SNOW",  words: ["SNOW", "NOW", "OWN", "WON", "SON"],            bonus: ["SOW"] },
      { letters: "STONE", words: ["STONE", "NOTES", "NEST", "TONE", "SENT"],      bonus: ["TONES", "TENS", "NETS", "NOTE", "ONES", "NOSE", "TEN", "NET", "SET", "TOE", "NOT", "TON", "ONE", "SON"] },
      { letters: "TIGER", words: ["TIGER", "TIRE", "TIER", "GET", "RIG"],         bonus: ["RITE", "GRIT", "IRE"] },
    ],
  },
  {
    name: "Cairo", emoji: "🐪", flag: "🇪🇬", tagline: "Sandy secrets in the shadow of pyramids.",
    theme: ["#f5af19", "#f12711"],
    levels: [
      { letters: "HEART", words: ["HEART", "EARTH", "HEAT", "RATE", "TEAR", "HAT"], bonus: ["HEAR", "HATE", "HART", "ART", "EAR", "ERA", "EAT", "ATE", "HER", "THE", "RAT", "TAR"] },
      { letters: "PLANE", words: ["PLANE", "PANEL", "LANE", "LEAP", "PLAN"],      bonus: ["PANE", "LEAN", "PLEA", "PALE", "PEAL", "NAP", "PAN", "PEN", "APE", "ALE"] },
      { letters: "BREAD", words: ["BREAD", "BEARD", "READ", "DARE", "BEAD"],      bonus: ["BARED", "BEAR", "BARE", "DEAR", "DRAB", "BARD", "BAD", "BED", "RED", "EAR", "ERA", "ARE", "DAB"] },
      { letters: "SMILE", words: ["SMILE", "MILES", "LIME", "ISLE", "SLIM"],      bonus: ["LIMES", "SLIME", "MILE", "ELMS", "LIES"] },
      { letters: "OCEAN", words: ["OCEAN", "CANOE", "ONCE", "CONE", "CANE"],      bonus: ["ACE", "CAN", "EON", "ONE", "CON"] },
      { letters: "LIGHT", words: ["LIGHT", "HILT", "HIT", "LIT"],                 bonus: ["GILT"] },
      { letters: "CHAIR", words: ["CHAIR", "HAIR", "RICH", "CHAR", "AIR", "CAR"], bonus: ["ARC"] },
      { letters: "TRAIN", words: ["TRAIN", "RAIN", "RANT", "ANT", "ART", "TIN"],  bonus: ["AIR", "RAT", "TAN", "TAR", "RAN", "NIT"] },
    ],
  },
  {
    name: "Paris", emoji: "🗼", flag: "🇫🇷", tagline: "Ooh là là — the words are getting fancier!",
    theme: ["#89f7fe", "#66a6ff"],
    levels: [
      { letters: "WATER", words: ["WATER", "WEAR", "RATE", "TEAR", "WART"],       bonus: ["WARE", "WET", "WAR", "RAW", "AWE", "EAR", "EAT", "ATE", "ART", "RAT", "TAR", "ERA"] },
      { letters: "HORSE", words: ["HORSE", "SHORE", "ROSE", "HERO", "HOSE"],      bonus: ["SORE", "HERS", "SHE", "HER", "ORE", "HOE"] },
      { letters: "DANCE", words: ["DANCE", "CANE", "DEAN", "AND", "END"],         bonus: ["CANED", "ACNE", "ACED", "ACE", "CAN", "DEN"] },
      { letters: "NIGHT", words: ["NIGHT", "THING", "THIN", "HINT", "TIN"],       bonus: ["NIGH", "GIN", "HIT", "NIT"] },
      { letters: "HOUSE", words: ["HOUSE", "HOSE", "SHOE", "USE", "HUE"],         bonus: ["HUES", "SUE"] },
      { letters: "GRAPE", words: ["GRAPE", "PAGE", "PEAR", "RAGE", "GEAR", "GAP"], bonus: ["PAGER", "REAP", "GAPE", "PARE", "APE", "AGE", "PEA", "RAG", "RAP", "EAR", "ERA", "PAR"] },
      { letters: "CLOUD", words: ["CLOUD", "COULD", "LOUD", "COLD", "OLD"],       bonus: ["CLOD", "DUO", "CUD"] },
      { letters: "BEACH", words: ["BEACH", "EACH", "ACHE", "CAB"],                bonus: ["ACE"] },
    ],
  },
  {
    name: "Rome", emoji: "🏛️", flag: "🇮🇹", tagline: "When in Rome, spell as the Romans do.",
    theme: ["#fad0c4", "#ff9a9e"],
    levels: [
      { letters: "GARDEN", words: ["GARDEN", "DANGER", "GRAND", "RANGE", "ANGER", "GRADE"], bonus: ["GANDER", "RAGED", "DARE", "DEAR", "READ", "NEAR", "EARN", "RANG", "GEAR", "RAGE", "AND", "AGE", "DEN", "END", "EAR", "ERA", "NAG", "RAN", "RED", "RAG"] },
      { letters: "PLANET", words: ["PLANET", "PLANT", "PLANE", "PLATE", "PETAL", "PANEL"],  bonus: ["PLEAT", "LEAPT", "LANE", "LEAN", "NEAT", "PANE", "PLAN", "PLEA", "LEAP", "PALE", "TALE", "TEAL", "LATE", "TAPE", "PANT", "PEAT", "ANT", "APE", "ATE", "EAT", "NAP", "NET", "PAN", "PAT", "PEA", "PEN", "PET", "TAN", "TAP", "TEA", "TEN"] },
      { letters: "FLOWER", words: ["FLOWER", "LOWER", "FLOW", "WOLF", "FLEW", "OWL"],       bonus: ["FOWL", "LORE", "ROLE", "WORE", "FEW", "LOW", "OWE", "ROW", "ORE", "ELF", "FOE", "WOE"] },
      { letters: "SILVER", words: ["SILVER", "SLIVER", "LIVER", "EVIL", "LIVE", "RISE"],    bonus: ["LIVES", "VEILS", "VILE", "ISLE", "LIES", "VEIL", "VIES", "LIE", "IRE"] },
      { letters: "ORANGE", words: ["ORANGE", "GROAN", "ORGAN", "RANGE", "ANGER", "GONE"],   bonus: ["ARGON", "RAGE", "NEAR", "EARN", "RANG", "GEAR", "AGO", "AGE", "EAR", "ERA", "NAG", "ONE", "ORE", "RAN", "EON", "OAR", "RAG"] },
      { letters: "WINTER", words: ["WINTER", "WRITE", "TWINE", "WINE", "WIRE", "RENT"],     bonus: ["INTER", "TIRE", "TIER", "RITE", "TERN", "NEW", "TEN", "TIN", "WIN", "WET", "WIT", "NET", "TIE", "IRE", "NIT"] },
      { letters: "ROCKET", words: ["ROCKET", "ROCK", "CORK", "CORE", "TORE", "TREK"],       bonus: ["ROTE", "ROT", "COT", "TOE", "ORE"] },
      { letters: "CASTLE", words: ["CASTLE", "SCALE", "SLATE", "STEAL", "LEAST", "TALE"],   bonus: ["CLEATS", "CLEAT", "STALE", "TALES", "LACES", "CAST", "SALT", "LAST", "SEAL", "SALE", "TEAL", "LATE", "LACE", "CASE", "SEAT", "EAST", "ACE", "ACT", "CAT", "EAT", "ATE", "LET", "SAT", "SEA", "SET", "TEA"] },
    ],
  },
  {
    name: "New York", emoji: "🗽", flag: "🇺🇸", tagline: "Big city, big words!",
    theme: ["#30cfd0", "#330867"],
    levels: [
      { letters: "MONKEY", words: ["MONKEY", "MONEY", "MONK", "YOKE", "KEY", "YEN"],        bonus: ["ONE", "MEN", "EON"] },
      { letters: "DRAGON", words: ["DRAGON", "GROAN", "ORGAN", "GRAND", "ROAD", "DOG"],     bonus: ["ARGON", "RADON", "RANG", "DARN", "NAG", "RAG", "RAN", "ROD", "AGO", "AND", "DON", "OAR", "NOD", "GOD", "ADO"] },
      { letters: "THUNDER", words: ["THUNDER", "HUNTER", "TURNED", "UNDER", "HUNT", "TUNE"], bonus: ["HUNTED", "HURT", "RUDE", "DUNE", "TEND", "RENT", "HERD", "TRUE", "TURN", "HEN", "HUT", "NUT", "RED", "RUN", "TEN", "THE", "DEN", "END", "DUE", "HER", "HUE", "NET", "RUT"] },
      { letters: "PIRATES", words: ["PIRATES", "STRIPE", "PIRATE", "SPEAR", "PAIR", "STAR"], bonus: ["PARTIES", "SPRITE", "PRIEST", "TRAIPSE", "PASTE", "PEARS", "SPARE", "RAISE", "ARISE", "STRAP", "TRAPS", "PARTS", "PAIRS", "PAST", "RATS", "ARTS", "TIPS", "SPIT", "PITS", "RISE", "RIPE", "PIER", "TIES", "SITE", "RATE", "TEAR", "SEAR", "PEAR", "REAP", "TAPE", "PEAT", "RAT", "TAR", "SAT", "SEA", "TEA", "EAT", "SIP", "TIP", "PIT", "PIE", "PET", "PAT", "APE", "AIR", "ART", "ATE", "EAR", "ERA"] },
      { letters: "CAPTAIN", words: ["CAPTAIN", "PAINT", "PANIC", "PAIN", "CAT", "TIP"],     bonus: ["CATNIP", "ANTIC", "PANT", "ANTI", "PACT", "TAP", "ANT", "CAP", "CAN", "TAN", "NAP", "PIT", "TIN", "PAN", "PAT", "NIP", "ACT"] },
      { letters: "JOURNEY", words: ["JOURNEY", "ENJOY", "YOUR", "JOY", "RUN", "ONE"],       bonus: ["EON", "ORE", "RYE", "URN", "YEN", "OUR"] },
      { letters: "DOLPHIN", words: ["DOLPHIN", "LION", "IDOL", "POND", "HOLD", "OIL"],      bonus: ["LOIN", "PLOD", "HIP", "HOP", "LIP", "PIN", "OLD", "NOD", "POD", "LID", "HID", "ION", "DIP", "DIN", "DON"] },
      { letters: "DIAMOND", words: ["DIAMOND", "DOMAIN", "NOMAD", "MAID", "MIND", "MOAN"],  bonus: ["AMID", "MAIN", "AID", "AND", "MAD", "DID", "ADD", "DAM", "DIM", "MAN", "NOD", "DON", "ADO", "ION"] },
    ],
  },
  {
    name: "Rio", emoji: "🎉", flag: "🇧🇷", tagline: "Carnival finale — the toughest puzzles!",
    theme: ["#f093fb", "#f5576c"],
    levels: [
      { letters: "RAINBOW", words: ["RAINBOW", "BROWN", "BRAIN", "ROBIN", "IRON", "RAIN"],  bonus: ["BRAWN", "BARN", "BORN", "WORN", "ROAN", "BOW", "ROW", "WIN", "WON", "NOW", "OWN", "AIR", "WAR", "RAW", "RAN", "RIB", "BAR", "BAN", "BIN", "NAB", "OAR", "ION"] },
      { letters: "HOLIDAY", words: ["HOLIDAY", "DAILY", "HALO", "LADY", "DIAL", "IDOL"],    bonus: ["DOILY", "HAIL", "HOLD", "LAID", "OILY", "HAY", "DAY", "LAY", "OIL", "OLD", "AID", "LID", "HID", "ADO"] },
      { letters: "CRYSTAL", words: ["CRYSTAL", "SCARY", "SALTY", "STRAY", "CLAY", "TRAY"],  bonus: ["CARTS", "SCAR", "CART", "CAST", "CATS", "RATS", "STAR", "ARTS", "LACY", "RACY", "STAY", "SLAY", "SCAT", "LAST", "SALT", "CRY", "SLY", "SAY", "RAT", "CAR", "CAT", "ACT", "ART", "SAT", "TAR", "TRY", "LAY"] },
      { letters: "VOLCANO", words: ["VOLCANO", "VOCAL", "COOL", "COAL", "LOAN", "OVAL"],    bonus: ["NOVA", "CLAN", "COLA", "CAN", "VAN", "CON"] },
      { letters: "MONSTER", words: ["MONSTER", "SERMON", "STORM", "STONE", "NOTES", "SNORE"], bonus: ["MENTOR", "MENTORS", "METRO", "TERMS", "TONES", "MOST", "NEST", "REST", "SORT", "TERM", "TORN", "NORM", "ONES", "NOSE", "ROSE", "SORE", "TORE", "NOTE", "TONE", "NETS", "TENS", "SENT", "EON", "MEN", "NET", "NOT", "ONE", "ORE", "ROT", "SET", "SON", "TEN", "TOE", "TON"] },
      { letters: "PENGUIN", words: ["PENGUIN", "UNPIN", "NINE", "PINE", "GUN", "PIG"],      bonus: ["PEN", "PIN", "PUN", "GIN", "PEG", "PIE", "NUN", "PUG", "NIP"] },
      { letters: "TREASURE", words: ["TREASURE", "ERASER", "ARREST", "STARE", "TRUE", "SURE"], bonus: ["ERASURE", "RATES", "TEARS", "TEASE", "REUSE", "EATER", "EATERS", "ASTER", "RUST", "USER", "RARE", "REAR", "EAST", "SEAT", "TSAR", "EAT", "SEA", "TEA", "USE", "RAT", "ART", "ATE", "EAR", "ERA", "SAT", "SET", "SUE", "TAR", "RUE", "RUT"] },
      { letters: "FIREWORK", words: ["FIREWORK", "WORKER", "FIRE", "WORK", "FORK", "WIRE"], bonus: ["WORE", "RIFE", "WEIR", "IRK", "ORE", "ROW", "FEW", "FOE", "OWE", "IRE", "FIR", "FOR", "ROE"] },
    ],
  },
];

// Flat list of all levels with destination info attached.
const LEVELS = [];
DESTINATIONS.forEach((dest, di) => {
  dest.levels.forEach((lv, li) => {
    LEVELS.push({ ...lv, dest: di, destName: dest.name, emoji: dest.emoji, theme: dest.theme, indexInDest: li });
  });
});

const WORD_SCORES = { 3: 90, 4: 160, 5: 250, 6: 360, 7: 490, 8: 640 };
const BONUS_SCORE = 50;
const BONUS_COINS = 15;
const HINT_COST = 100;

function wordScore(w) { return WORD_SCORES[w.length] || w.length * w.length * 10; }
function wordCoins(w) { return w.length * 5; }
