export const ROUND_SECONDS = 30;
export const TIME_BONUSES = [1, 2, 3, 4] as const;
export const STARTING_LIVES = 3;
export const CATCH_LINE = 0.84;
export const MAX_SPARKS = 16;
export type GamePhase = "ready" | "playing" | "paused" | "finished";
export type SparkKind = "spark" | "glitch" | "time";
export type FallingSpark = { id: number; slot: number; x: number; y: number; speed: number; kind: SparkKind; bonusSeconds: number; spin: number };
export type CatchEffect = { id: number; x: number; life: number; points: number; kind: SparkKind; bonusSeconds: number };
export type SparkRound = {
  phase: GamePhase;
  elapsed: number;
  bonusSeconds: number;
  nextTimeDropAt: number;
  score: number;
  lives: number;
  combo: number;
  caught: number;
  paddle: number;
  target: number;
  axis: number;
  spawnIn: number;
  nextId: number;
  seed: number;
  items: FallingSpark[];
  effects: CatchEffect[];
  endedBy: "time" | "glitches" | null;
};

export function createRound(seed = 12345): SparkRound {
  return { phase: "ready", elapsed: 0, bonusSeconds: 0, nextTimeDropAt: 3, score: 0, lives: STARTING_LIVES, combo: 0, caught: 0, paddle: 0.5, target: 0.5, axis: 0, spawnIn: 0.25, nextId: 0, seed: seed >>> 0, items: [], effects: [], endedBy: null };
}

export function timeRemaining(round: SparkRound) { return Math.max(0, ROUND_SECONDS + round.bonusSeconds - round.elapsed); }
export function paddleWidth(width: number) { return Math.max(66, Math.min(100, width * 0.2)); }
export function comboMultiplier(combo: number) { return Math.min(3, 1 + Math.floor(combo / 4)); }

function random(round: SparkRound) {
  round.seed = (Math.imul(round.seed, 1664525) + 1013904223) >>> 0;
  return round.seed / 4294967296;
}

/** A small deterministic simulation, independent of the renderer and frame rate. */
export function advanceRound(round: SparkRound, seconds: number, boardWidth = 600): GamePhase {
  if (round.phase !== "playing" || !Number.isFinite(seconds) || seconds <= 0) return round.phase;
  // Substeps preserve collision accuracy without slowing the timer on lower-frame-rate devices.
  let remaining = seconds;
  while (remaining > 1e-9 && round.phase === "playing") {
    const step = Math.min(remaining, 0.04, timeRemaining(round));
    advanceStep(round, step, boardWidth);
    remaining -= step;
  }
  return round.phase;
}

function advanceStep(round: SparkRound, dt: number, boardWidth: number) {
  const width = Math.max(200, boardWidth);
  const halfPaddle = paddleWidth(width) / width / 2;
  const minX = halfPaddle + 0.015, maxX = 1 - minX;
  if (round.axis) {
    round.paddle = Math.max(minX, Math.min(maxX, round.paddle + round.axis * dt * 0.88));
    round.target = round.paddle;
  } else {
    const target = Math.max(minX, Math.min(maxX, round.target));
    round.paddle += (target - round.paddle) * (1 - Math.exp(-dt * 18));
  }
  round.elapsed = Math.min(ROUND_SECONDS + round.bonusSeconds, round.elapsed + dt);
  round.spawnIn -= dt;
  if (round.spawnIn <= 0 && round.items.length < MAX_SPARKS) {
    const occupied = new Set(round.items.map((s) => s.slot));
    let slot = 0;
    while (occupied.has(slot)) slot++;
    const isTimeDrop = round.elapsed >= round.nextTimeDropAt;
    const kind: SparkKind = isTimeDrop ? "time" : round.elapsed > 3 && random(round) < 0.2 ? "glitch" : "spark";
    const bonusSeconds = isTimeDrop ? TIME_BONUSES[Math.floor(random(round) * TIME_BONUSES.length)] : 0;
    if (isTimeDrop) round.nextTimeDropAt = round.elapsed + 6;
    round.items.push({ id: round.nextId++, slot, x: 0.08 + random(round) * 0.84, y: -0.12, speed: 0.23 + Math.min(1, round.elapsed / ROUND_SECONDS) * 0.13 + random(round) * 0.07, kind, bonusSeconds, spin: random(round) * 360 });
    round.spawnIn = Math.max(0.38, 0.76 - round.elapsed * 0.01);
  }
  round.effects = round.effects.filter((effect) => (effect.life -= dt) > 0);
  round.items = round.items.filter((item) => {
    if (round.lives === 0) return false;
    const previousY = item.y;
    item.y += item.speed * dt;
    const crossedPaddle = previousY < CATCH_LINE && item.y >= CATCH_LINE;
    if (crossedPaddle && Math.abs(item.x - round.paddle) <= halfPaddle + 11 / width) {
      let points = 0;
      if (item.kind === "glitch") {
        round.lives = Math.max(0, round.lives - 1);
        round.combo = 0;
        round.score = Math.max(0, round.score - 5);
        points = -5;
      } else if (item.kind === "time") {
        round.bonusSeconds += item.bonusSeconds;
      } else {
        round.combo++;
        round.caught++;
        points = 10 * comboMultiplier(round.combo);
        round.score += points;
      }
      round.effects.push({ id: item.id, x: item.x, life: 0.75, points, kind: item.kind, bonusSeconds: item.bonusSeconds });
      if (round.effects.length > 4) round.effects.shift();
      return false;
    }
    if (item.y > 1.1) {
      if (item.kind === "spark") round.combo = 0;
      return false;
    }
    return true;
  });
  if (round.lives === 0 || timeRemaining(round) <= 1e-7) {
    if (timeRemaining(round) <= 1e-7) round.elapsed = ROUND_SECONDS + round.bonusSeconds;
    round.phase = "finished";
    round.endedBy = round.lives === 0 ? "glitches" : "time";
    round.axis = 0;
  }
}
