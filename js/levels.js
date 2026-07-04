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
    name: "Rio", emoji: "🎉", flag: "🇧🇷", tagline: "Carnival time — samba with your letters!",
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
  {
    name: "London", emoji: "🎡", flag: "🇬🇧", tagline: "Mind the gap — and the tricky letters!",
    theme: ["#c9d6ff", "#5b73df"],
    levels: [
      { letters: "CROWN",   words: ["CROWN", "CORN", "WORN", "COW", "NOW"],                       bonus: ["OWN", "WON", "ROW", "CON", "NOR"] },
      { letters: "GUARD",   words: ["GUARD", "DRAG", "RUG", "DUG", "RAG"],                        bonus: [] },
      { letters: "TOWER",   words: ["TOWER", "WROTE", "WORE", "TORE", "TWO", "WET"],              bonus: ["ROTE", "TOW", "ROW", "TOE", "ORE", "OWE", "ROE"] },
      { letters: "BRIDGE",  words: ["BRIDGE", "RIDGE", "BRIDE", "BIRD", "RIDE", "BIG"],           bonus: ["BRIG", "BRED", "DIRE", "RIB", "RID", "RED", "BID", "DIG", "IRE"] },
      { letters: "PALACE",  words: ["PALACE", "PLACE", "CAPE", "LACE", "PACE", "CLAP"],           bonus: ["PLEA", "PALE", "PEAL", "LEAP", "PAL", "LAP", "ALE", "APE", "ACE", "CAP", "PEA"] },
      { letters: "MARKET",  words: ["MARKET", "MAKER", "TEAM", "TAKE", "RATE", "TRAM"],           bonus: ["TAKER", "MEAT", "MATE", "TAME", "MAKE", "RAKE", "MARE", "TEAR", "MART", "ARK", "ARM", "ART", "EAR", "EAT", "ERA", "MAT", "MET", "RAM", "RAT", "TAR", "TEA"] },
      { letters: "DOUBLE",  words: ["DOUBLE", "BLUE", "LOUD", "DUEL", "BOLD", "OLD"],             bonus: ["LOBE", "BLED", "BODE", "DOLE", "LODE", "DUE", "DUO", "BED", "BUD", "LOB", "ODE"] },
      { letters: "SOLDIER", words: ["SOLDIER", "SLIDER", "SOLID", "SLIDE", "OLDER", "RIDE"],      bonus: ["RIDES", "OILED", "LOSER", "RODE", "ROLE", "SOLE", "SOLD", "SLID", "DIRE", "SIDE", "ISLE", "LIDS", "OILS", "REDS", "RODS", "ROSE", "SORE", "DOES", "DOSE", "IDLE", "LORE", "ODES", "OLD", "LID", "LIE", "OIL", "RED", "RID", "ROD", "SIR"] },
    ],
  },
  {
    name: "Athens", emoji: "🏺", flag: "🇬🇷", tagline: "Ancient wisdom, timeless words.",
    theme: ["#e8f5ff", "#4a90d9"],
    levels: [
      { letters: "OLIVE",   words: ["OLIVE", "LIVE", "EVIL", "VEIL", "OIL"],                      bonus: ["VILE", "LIE", "VIE"] },
      { letters: "TEMPLE",  words: ["TEMPLE", "PELT", "MELT", "PEEL", "EEL", "PET"],              bonus: ["TEMP", "ELM", "LET", "MET"] },
      { letters: "MARBLE",  words: ["MARBLE", "BLAME", "AMBLE", "REALM", "LAMB", "ABLE"],         bonus: ["BEAM", "BEAR", "BARE", "BALE", "MALE", "MEAL", "LAME", "EARL", "REAL", "MARE", "RAM", "BAR", "ARM", "ALE", "EAR", "ERA", "LAB"] },
      { letters: "LEGEND",  words: ["LEGEND", "LEDGE", "EDGE", "GLEN", "LEND", "LEG"],            bonus: ["GENE", "GLEE", "NEED", "DEN", "END", "LED", "GEL", "EEL"] },
      { letters: "STATUE",  words: ["STATUE", "STATE", "TASTE", "TAUT", "EAST", "SEAT"],          bonus: ["ATE", "EAT", "SAT", "SEA", "SET", "SUE", "TEA", "USE"] },
      { letters: "ATHLETE", words: ["ATHLETE", "LATHE", "HEAT", "TALE", "THAT", "HEEL"],          bonus: ["HALT", "HATE", "LATE", "TEAL", "THE", "EAT", "ATE", "TEA", "LET", "HAT", "ALE", "EEL"] },
      { letters: "CHARIOT", words: ["CHARIOT", "CHART", "TORCH", "ACTOR", "RATIO", "ROACH"],      bonus: ["CHAIR", "ARCH", "RICH", "ITCH", "CHAT", "CHAR", "COAT", "OATH", "HAIR", "CART", "RIOT", "TRIO", "IOTA", "HAT", "HIT", "HOT", "RAT", "ROT", "CAR", "CAT", "COT", "OAR", "OAT", "ART", "ACT", "AIR", "TAR"] },
      { letters: "HISTORY", words: ["HISTORY", "SHIRT", "STORY", "HOIST", "SHORT", "ROSY"],       bonus: ["SHOT", "SORT", "HOST", "HITS", "STIR", "TOYS", "THIS", "RIOT", "TRIO", "HIS", "HIT", "HOT", "ITS", "SIR", "SIT", "TRY", "TOY", "SHY", "SOY", "ROT"] },
    ],
  },
  {
    name: "Nairobi", emoji: "🦁", flag: "🇰🇪", tagline: "Safari time — hunt for wild words!",
    theme: ["#ffd194", "#d1913c"],
    levels: [
      { letters: "ZEBRA",    words: ["ZEBRA", "BRAZE", "BEAR", "BARE", "EAR"],                    bonus: ["ARE", "ERA", "BAR"] },
      { letters: "HIPPO",    words: ["HIPPO", "HIP", "HOP", "POP"],                               bonus: ["PIP"] },
      { letters: "SAFARI",   words: ["SAFARI", "FAIR", "AFAR", "SARI", "AIR", "FAR"],             bonus: ["FAIRS", "AIRS", "FIR"] },
      { letters: "JUNGLE",   words: ["JUNGLE", "LUNGE", "GLUE", "LUNG", "JUG", "GUN"],            bonus: ["GLEN", "GNU", "LEG", "GEL"] },
      { letters: "GIRAFFE",  words: ["GIRAFFE", "GAFFE", "FAIR", "FIRE", "GEAR", "FIG"],          bonus: ["RIFE", "RAGE", "FARE", "FEAR", "GAFF", "RIFF", "FAR", "FIR", "EAR", "ERA", "AGE", "RAG", "IRE", "AIR"] },
      { letters: "CHEETAH",  words: ["CHEETAH", "TEACH", "CHEAT", "HATCH", "ACHE", "HEAT"],       bonus: ["EACH", "HEATH", "HATE", "THE", "TEA", "EAT", "ATE", "HAT", "ACT", "CAT", "ACE", "TEE"] },
      { letters: "ELEPHANT", words: ["ELEPHANT", "PLANET", "PLATE", "PANEL", "PATH", "THEN"],     bonus: ["PLANE", "PETAL", "PLEAT", "EATEN", "HEAL", "HEAP", "PLEA", "LEAP", "PALE", "TAPE", "NEAT", "THAN", "HALT", "HATE", "HEAT", "PANT", "HEEL", "PEEL", "TEEN", "APE", "ATE", "EAT", "HAT", "HEN", "LET", "NAP", "NET", "PAN", "PAT", "PEA", "PEN", "PET", "TAN", "TAP", "TEA", "TEN", "THE"] },
      { letters: "LEOPARD",  words: ["LEOPARD", "PAROLE", "ORDEAL", "PEARL", "OPERA", "PEDAL"],   bonus: ["PLEAD", "ADORE", "DRAPE", "POLAR", "OPAL", "ROAD", "LOAD", "ROPE", "PORE", "RODE", "DEAL", "LEAD", "PALE", "LEAP", "PEAR", "REAP", "EARL", "REAL", "ORAL", "POLE", "ROLE", "DOLE", "LORE", "APE", "EAR", "OAR", "ODE", "OLD", "ORE", "PAD", "PAL", "PEA", "POD", "PRO", "RAP"] },
    ],
  },
  {
    name: "Beijing", emoji: "🐉", flag: "🇨🇳", tagline: "Dragons, lanterns, and legendary words!",
    theme: ["#ff9a8b", "#ff6a88"],
    levels: [
      { letters: "PANDA",   words: ["PANDA", "PAN", "PAD", "AND", "NAP"],                         bonus: [] },
      { letters: "BAMBOO",  words: ["BAMBOO", "BOMB", "BOOM", "BOO", "MOB"],                      bonus: ["BOA", "MOO"] },
      { letters: "NOODLE",  words: ["NOODLE", "OLDEN", "LOON", "DONE", "NODE", "OLD"],            bonus: ["LONE", "LODE", "DOLE", "ONE", "DEN", "END", "EON", "ODE", "DON", "NOD", "LED"] },
      { letters: "EMPEROR", words: ["EMPEROR", "ROMPER", "POEM", "ROPE", "MORE", "PROM"],         bonus: ["PORE", "MOPE", "PRO", "MOP", "ORE", "REM", "ROE"] },
      { letters: "LANTERN", words: ["LANTERN", "ANTLER", "RENTAL", "LEARN", "TANNER", "NEAR"],    bonus: ["LEARNT", "EARN", "RENT", "LANE", "LEAN", "NEAT", "RATE", "TEAR", "TALE", "TEAL", "LATE", "EARL", "REAL", "RAN", "RAT", "TAR", "TAN", "TEN", "NET", "EAR", "ERA", "EAT", "ATE", "ANT", "ALE", "LET"] },
      { letters: "FORTUNE", words: ["FORTUNE", "FRONT", "OFTEN", "TENOR", "FOUR", "TUNE"],        bonus: ["FOUNT", "TUNER", "TURN", "TORN", "TORE", "NOTE", "TONE", "FONT", "FORT", "TOUR", "TRUE", "FUN", "FOR", "FUR", "NET", "NOT", "NUT", "ONE", "ORE", "OUR", "OUT", "RUN", "RUT", "TEN", "TOE", "TON"] },
      { letters: "KINGDOM", words: ["KINGDOM", "DINGO", "DOING", "KING", "MIND", "MONK"],         bonus: ["KIND", "MINK", "DIM", "DIG", "DOG", "DON", "GIN", "INK", "ION", "KID", "KIN", "NOD", "GOD"] },
      { letters: "WARRIOR", words: ["WARRIOR", "ARROW", "ROAR", "WAR", "OAR"],                    bonus: ["RAW", "AIR", "ROW"] },
    ],
  },
  {
    name: "Honolulu", emoji: "🌺", flag: "🏝️", tagline: "Sun, surf, and sneaky spellings!",
    theme: ["#43e97b", "#38f9d7"],
    levels: [
      { letters: "WAVES",    words: ["WAVES", "WAVE", "SAVE", "VASE", "SEA"],                     bonus: ["WAS", "AWE", "SEW", "SAW"] },
      { letters: "CORAL",    words: ["CORAL", "CAROL", "COAL", "ORAL", "CAR"],                    bonus: ["COLA", "ARC", "OAR"] },
      { letters: "TURTLE",   words: ["TURTLE", "UTTER", "TRUE", "RULE", "LURE", "LET"],           bonus: ["RUT", "RUE"] },
      { letters: "ISLAND",   words: ["ISLAND", "SNAIL", "LAND", "SAND", "NAIL", "SAID"],          bonus: ["SAIL", "DIAL", "LAID", "LADS", "AIDS", "SLID", "AND", "SAD", "SIN", "LID", "LAD", "AID", "ADS", "DIN"] },
      { letters: "TROPIC",   words: ["TROPIC", "TOPIC", "OPTIC", "CROP", "PORT", "TRIP"],         bonus: ["RIOT", "TRIO", "COT", "COP", "PIT", "POT", "PRO", "ROT", "TIP", "TOP", "OPT"] },
      { letters: "SUNSET",   words: ["SUNSET", "TUNES", "NESTS", "STUN", "SENT", "NUTS"],         bonus: ["STUNS", "NEST", "NETS", "SETS", "SUNS", "TENS", "TUNE", "USES", "NET", "NUT", "SET", "SUE", "SUN", "TEN", "USE"] },
      { letters: "LAGOON",   words: ["LAGOON", "ALONG", "LONG", "GOAL", "LOAN", "LOGO"],          bonus: ["LOON", "NAG", "AGO", "LAG", "LOG"] },
      { letters: "PARADISE", words: ["PARADISE", "DESPAIR", "PRAISED", "PARADE", "SPREAD", "RAPID"], bonus: ["PARADES", "PRAISE", "ASPIRE", "ASIDE", "RAISED", "RAISE", "ARISE", "PARSE", "SPARE", "SPEAR", "PEARS", "DRAPE", "RAPIDS", "PAID", "PAIR", "PAIRS", "RIDE", "SIDE", "DEAR", "DARE", "READ", "AREA", "APE", "EAR", "ERA", "PEA", "RIP", "SIP", "SIR", "SEA", "SAD", "RID"] },
    ],
  },
  {
    name: "Reykjavik", emoji: "🌋", flag: "🇮🇸", tagline: "Fire and ice — can you handle both?",
    theme: ["#a8edea", "#5b86e5"],
    levels: [
      { letters: "WHALE",    words: ["WHALE", "HEAL", "LAW", "AWE", "ALE"],                       bonus: ["HEW"] },
      { letters: "NORTH",    words: ["NORTH", "THORN", "HORN", "TORN", "HOT"],                    bonus: ["NOT", "ROT", "TON"] },
      { letters: "AURORA",   words: ["AURORA", "AURA", "ROAR", "OUR", "OAR"],                     bonus: [] },
      { letters: "FROZEN",   words: ["FROZEN", "FROZE", "ZERO", "ZONE", "FERN", "ONE"],           bonus: ["FORE", "ZEN", "EON", "FOE", "FOR", "ORE"] },
      { letters: "ICEBERG",  words: ["ICEBERG", "BEIGE", "CRIB", "RICE", "BERG", "BIG"],          bonus: ["BEG", "RIB", "IRE", "ICE", "GEE"] },
      { letters: "SNOWMAN",  words: ["SNOWMAN", "WOMAN", "MASON", "SWAN", "SNOW", "MOAN"],        bonus: ["MOANS", "MOWN", "SOWN", "ANON", "MAN", "MOW", "NOW", "OWN", "SAW", "SON", "SOW", "WAS", "WON"] },
      { letters: "GLACIER",  words: ["GLACIER", "CLEAR", "LARGE", "GRACE", "RELIC", "AGILE"],     bonus: ["CIGAR", "LAGER", "REGAL", "RACE", "RICE", "LACE", "LICE", "CAGE", "RAGE", "GEAR", "EARL", "REAL", "LAIR", "LIAR", "RAIL", "ACE", "AGE", "AIR", "ARC", "CAR", "EAR", "ERA", "ICE", "IRE", "LEG", "LIE", "RAG", "GEL"] },
      { letters: "MIDNIGHT", words: ["MIDNIGHT", "NIGHT", "THING", "TIMID", "DIGIT", "MINT"],     bonus: ["THIN", "HINT", "MIND", "DIM", "DIG", "DIN", "GIN", "HID", "HIM", "HIT", "NIT", "TIN"] },
    ],
  },
  {
    name: "The Moon", emoji: "🚀", flag: "🌕", tagline: "The grand finale — words in zero gravity!",
    theme: ["#3a1c71", "#928dab"],
    levels: [
      { letters: "COMET",    words: ["COMET", "COME", "TOME", "MET", "COT"],                      bonus: ["TOE"] },
      { letters: "ORBIT",    words: ["ORBIT", "RIOT", "TRIO", "ORB", "BIT"],                      bonus: ["ROB", "ROT", "RIB"] },
      { letters: "LAUNCH",   words: ["LAUNCH", "LUNCH", "HAUL", "CLAN", "CAN"],                   bonus: [] },
      { letters: "GALAXY",   words: ["GALAXY", "GALA", "LAX", "GAL", "LAY"],                      bonus: ["LAG"] },
      { letters: "METEOR",   words: ["METEOR", "REMOTE", "METER", "METRO", "TREE", "MEET"],       bonus: ["EMOTE", "TOME", "TORE", "MORE", "ROTE", "TERM", "TEEM", "MET", "TOE", "ORE", "ROT"] },
      { letters: "STARDUST", words: ["STARDUST", "STATUS", "TRUST", "START", "DARTS", "DUST"],    bonus: ["STARS", "TARTS", "STRUT", "DART", "STAR", "RATS", "ARTS", "TART", "TAUT", "RUST", "STUD", "SAT", "RAT", "TAR", "ART", "RUT"] },
      { letters: "ASTEROID", words: ["ASTEROID", "ROASTED", "EDITOR", "TIRADE", "RADIO", "ROAST"], bonus: ["STEROID", "SORTED", "STORED", "TRADE", "RATIO", "ADORE", "READS", "ROADS", "ROSE", "RIDE", "SIDE", "TIDE", "TOAD", "ROAD", "RAID", "DIRT", "STAR", "RATS", "ARTS", "RATE", "TEAR", "DOSE", "DOTS", "EAST", "SEAT", "IDEA", "IDEAS", "AIDS", "SAID", "DEAR", "DARE", "READ", "STIR", "RIOT", "TRIO", "SORT", "TOES", "OARS", "SOAR"] },
      { letters: "UNIVERSE", words: ["UNIVERSE", "INSURE", "NERVES", "REVISE", "SIREN", "SEVEN"], bonus: ["NURSE", "RINSE", "RISEN", "NERVE", "SEVER", "SERVE", "VERSE", "RUINS", "RUIN", "VEIN", "VINE", "VINES", "RISE", "SIRE", "SURE", "USER", "URNS", "RUNS", "SUN", "RUN", "USE", "SUE", "VIE", "IRE", "SIR", "SIN", "URN"] },
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
