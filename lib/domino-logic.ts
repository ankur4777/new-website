export type Difficulty = "Easy" | "Medium" | "Hard";
export type RuleKind = "sum" | "equal" | "different" | "less" | "greater" | "none";
export type Domino = { id: string; a: number; b: number };
export type Placement = { tileId: string; cell: number; rotation: number };
export type Region = { id: string; cells: number[]; kind: RuleKind; target: number; color: number };
export type Puzzle = { id: number; name: string; difficulty: Difficulty; width: number; height: number; cells: (string | null)[]; regions: Region[]; tiles: Domino[]; solution: Placement[] };
export type RegionState = { region: Region; filled: number; sum: number; status: "open" | "good" | "bad" };
export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
export const REGION_COLORS = ["#b8d8cb", "#d2c6ee", "#f1d798", "#e7bfa5", "#abcddf", "#e8bdcd", "#c9d3a4", "#c1c7df", "#dfc9ac", "#a9d8d3"];
type LevelSpec = { name: string; rows: string[]; rules: RuleKind[] };
const specs: LevelSpec[] = [
  { name: "First principles", rows: ["AABB", "AACC", "DDCC"], rules: ["equal", "sum", "sum", "none"] },
  { name: "A little balance", rows: ["AAB", "ACB", "CCD", "DDD"], rules: ["sum", "equal", "sum", "sum"] },
  { name: "New angles", rows: ["AAAB", "CCBB", "CDDD"], rules: ["equal", "sum", "less", "sum"] },
  { name: "Less is more", rows: ["AABB", "CCBB", "CCDD"], rules: ["sum", "less", "equal", "sum"] },
  { name: "Across the line", rows: ["ABB", "AAB", "CCD", "CDD"], rules: ["equal", "sum", "sum", "less"] },
  { name: "One clear direction", rows: ["AABB", "ACCB", "DDCC"], rules: ["sum", "equal", "less", "sum"] },
  { name: "Fresh perspective", rows: ["AABB", "ACCB", "DDCE", "DFEE"], rules: ["sum", "equal", "different", "sum", "less", "sum"] },
  { name: "Different together", rows: ["AAAB", "CCBB", "CDDE", "FFEE"], rules: ["different", "sum", "equal", "greater", "sum", "less"] },
  { name: "The quiet connection", rows: ["AABB", "ACDB", "ECDD", "EEFF"], rules: ["sum", "less", "different", "equal", "sum", "greater"] },
  { name: "A change of view", rows: ["AABC", "DABC", "DEEF", "DDFF"], rules: ["equal", "sum", "different", "sum", "less", "greater"] },
  { name: "Between the lines", rows: ["AABB", "CCBD", "CEED", "FFED"], rules: ["greater", "sum", "different", "equal", "sum", "less"] },
  { name: "All the right places", rows: ["AAAB", "CDDB", "CDDE", "FFEE"], rules: ["different", "equal", "sum", "less", "greater", "sum"] },
  { name: "A bigger picture", rows: ["AABBCC", "ADDECF", "GDHEFF", "GGHHEE"], rules: ["sum", "different", "equal", "sum", "less", "greater", "sum", "different"] },
  { name: "Beautiful complexity", rows: ["AABBC", "DAEBC", "DDEFF", "GGEFF"], rules: ["different", "sum", "equal", "greater", "less", "sum", "equal"] },
  { name: "Connected thinking", rows: ["AAABBC", "DDEBCC", "DDEEFF", "GGHHFF"], rules: ["different", "equal", "sum", "greater", "sum", "less", "sum", "different"] },
  { name: "The unexpected route", rows: ["AABBCD", "AEBBCD", "EEFFGG", "HHFIJG", "HHIIJJ"], rules: ["equal", "sum", "different", "less", "sum", "greater", "sum", "different", "sum", "equal"] },
  { name: "Room for possibility", rows: [".AABB.", "CAADDB", "CCEDDF", ".EEFF."], rules: ["different", "sum", "equal", "less", "greater", "sum"] },
  { name: "Everything connects", rows: [".AABB.", "CAADDB", "CCEDDF", "GGEEFF", ".GGHH."], rules: ["sum", "different", "equal", "sum", "less", "greater", "sum", "different"] },
];

function buildPuzzle(spec: LevelSpec, index: number): Puzzle {
  let seed = 7193 + index * 9013;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const shuffle = <T,>(items: T[]) => { for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; } return items; };
  const width = spec.rows[0].length, height = spec.rows.length;
  if (spec.rows.some(row => row.length !== width)) throw new Error("Invalid puzzle shape");
  const cells = spec.rows.join("").split("").map(c => c === "." ? null : c);
  const difficulty = DIFFICULTIES[Math.floor(index / 6)];
  const values = new Array<number>(cells.length).fill(0);
  const regions = [...new Set(cells.filter((c): c is string => c !== null))].map((id, color) => {
    const regionCells = cells.flatMap((cell, i) => cell === id ? [i] : []);
    const kind = spec.rules[color] ?? "sum";
    const same = Math.floor(random() * (difficulty === "Easy" ? 5 : 7));
    const distinct = shuffle([0, 1, 2, 3, 4, 5, 6]);
    regionCells.forEach((cell, i) => { values[cell] = kind === "equal" ? same : kind === "different" ? distinct[i] : Math.floor(random() * (difficulty === "Easy" ? 5 : 7)); });
    let sum = regionCells.reduce((total, cell) => total + values[cell], 0);
    if (kind === "greater" && sum === 0) { values[regionCells[0]] = 1; sum = 1; }
    const target = kind === "less" ? sum + 1 + Math.floor(random() * 3) : kind === "greater" ? Math.max(0, sum - 1 - Math.floor(random() * 3)) : sum;
    return { id, cells: regionCells, kind, target, color };
  });
  // Construct our own solvable boards; no external puzzles or daily-game data.
  const occupied = cells.map(c => c === null);
  const pairs: [number, number][] = [];
  function tileBoard(): boolean {
    const cell = occupied.indexOf(false);
    if (cell < 0) return true;
    const neighbors = shuffle([...(cell % width < width - 1 ? [cell + 1] : []), ...(cell + width < cells.length ? [cell + width] : [])]);
    occupied[cell] = true;
    for (const neighbor of neighbors) {
      if (occupied[neighbor]) continue;
      occupied[neighbor] = true; pairs.push([cell, neighbor]);
      if (tileBoard()) return true;
      pairs.pop(); occupied[neighbor] = false;
    }
    occupied[cell] = false; return false;
  }
  if (!tileBoard()) throw new Error("Untileable puzzle shape");
  const tiles = pairs.map(([a, b], i) => ({ id: `d${i + 1}`, a: values[a], b: values[b] }));
  const solution = pairs.map(([a, b], i) => ({ tileId: tiles[i].id, cell: a, rotation: b === a + 1 ? 0 : 1 }));
  return { id: index + 1, name: spec.name, difficulty, width, height, cells, regions, tiles: shuffle(tiles), solution };
}
export const PUZZLES = specs.map(buildPuzzle);

/** End A stays at the anchor; each clockwise turn moves end B. */
export function placementCells(puzzle: Puzzle, placement: Placement): [number, number] | null {
  const { cell, rotation } = placement;
  if (!Number.isInteger(cell) || cell < 0 || cell >= puzzle.cells.length || !Number.isInteger(rotation) || rotation < 0 || rotation > 3) return null;
  const [dx, dy] = [[1, 0], [0, 1], [-1, 0], [0, -1]][rotation];
  const x = cell % puzzle.width + dx, y = Math.floor(cell / puzzle.width) + dy;
  if (x < 0 || x >= puzzle.width || y < 0 || y >= puzzle.height) return null;
  const other = y * puzzle.width + x;
  return puzzle.cells[cell] !== null && puzzle.cells[other] !== null ? [cell, other] : null;
}

export function canPlace(puzzle: Puzzle, placements: Placement[], candidate: Placement): boolean {
  const cells = placementCells(puzzle, candidate);
  if (!cells || !puzzle.tiles.some(tile => tile.id === candidate.tileId) || placements.some(p => p.tileId === candidate.tileId)) return false;
  return !placements.some(p => placementCells(puzzle, p)?.some(cell => cells.includes(cell)));
}

export function inspectBoard(puzzle: Puzzle, placements: Placement[]) {
  const values: (number | null)[] = Array(puzzle.cells.length).fill(null);
  const seen = new Set<string>();
  let valid = true;
  for (const placement of placements) {
    const cells = placementCells(puzzle, placement), tile = puzzle.tiles.find(t => t.id === placement.tileId);
    if (!cells || !tile || seen.has(placement.tileId) || cells.some(c => values[c] !== null)) { valid = false; continue; }
    seen.add(placement.tileId); values[cells[0]] = tile.a; values[cells[1]] = tile.b;
  }
  const regions: RegionState[] = puzzle.regions.map(region => {
    const dots = region.cells.map(c => values[c]).filter((v): v is number => v !== null);
    const sum = dots.reduce((a, b) => a + b, 0), full = dots.length === region.cells.length;
    let possible = true, met = false;
    switch (region.kind) {
      case "sum": possible = sum <= region.target && sum + (region.cells.length - dots.length) * 6 >= region.target; met = sum === region.target; break;
      case "equal": possible = new Set(dots).size <= 1; met = possible; break;
      case "different": possible = new Set(dots).size === dots.length; met = possible; break;
      case "less": possible = sum < region.target; met = possible; break;
      case "greater": possible = sum + (region.cells.length - dots.length) * 6 > region.target; met = sum > region.target; break;
      case "none": met = true; break;
    }
    return { region, filled: dots.length, sum, status: !possible || full && !met ? "bad" : full ? "good" : "open" };
  });
  return { valid, values, regions, solved: valid && placements.length === puzzle.tiles.length && regions.every(r => r.status === "good") };
}

export function ruleSymbol(region: Region) {
  return region.kind === "sum" ? `Σ${region.target}` : region.kind === "equal" ? "=" : region.kind === "different" ? "≠" : region.kind === "less" ? `<${region.target}` : region.kind === "greater" ? `>${region.target}` : "·";
}
export function ruleDescription(region: Region) {
  return region.kind === "sum" ? `Dots add up to ${region.target}` : region.kind === "equal" ? "Every number is the same" : region.kind === "different" ? "Every number is different" : region.kind === "less" ? `Total is less than ${region.target}` : region.kind === "greater" ? `Total is greater than ${region.target}` : "Any numbers fit";
}

/** One helpful placement. Conflicting pieces return to the tray; undo restores them. */
export function applyHint(puzzle: Puzzle, placements: Placement[]) {
  if (inspectBoard(puzzle, placements).solved) return { placements, removed: 0 };
  const next = puzzle.solution.find(solution => {
    const current = placements.find(p => p.tileId === solution.tileId);
    return !current || current.cell !== solution.cell || current.rotation !== solution.rotation;
  });
  if (!next) return { placements, removed: 0 };
  const cells = placementCells(puzzle, next)!;
  const kept = placements.filter(p => p.tileId !== next.tileId && !placementCells(puzzle, p)?.some(c => cells.includes(c)));
  return { placements: [...kept, { ...next }], removed: placements.length - kept.length };
}

export type SavedProgress = { completed: number[]; levelId: number; placements: Placement[]; moves: number; hints: number };
export function readProgress(value: unknown): SavedProgress | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Partial<SavedProgress>;
  const puzzle = PUZZLES.find(p => p.id === data.levelId);
  if (!puzzle || !Array.isArray(data.completed) || !Array.isArray(data.placements)) return null;
  const completed = [...new Set(data.completed.filter(id => Number.isInteger(id) && PUZZLES.some(p => p.id === id)))];
  const moves = typeof data.moves === "number" && Number.isSafeInteger(data.moves) && data.moves >= 0 ? data.moves : 0;
  const hints = typeof data.hints === "number" && Number.isSafeInteger(data.hints) && data.hints >= 0 ? data.hints : 0;
  const placements: Placement[] = [];
  for (const p of data.placements) {
    if (!p || typeof p !== "object" || !canPlace(puzzle, placements, p)) return { completed, levelId: puzzle.id, placements: [], moves: 0, hints: 0 };
    placements.push({ tileId: p.tileId, cell: p.cell, rotation: p.rotation });
  }
  return { completed, levelId: puzzle.id, placements, moves, hints };
}
