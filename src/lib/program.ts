export const TOTAL_LEVELS = 20;
export const WORKOUTS_PER_LEVEL = 4; // ~4 workouts per level -> ~90 days total(ish)

export type Level = {
  level: number;
  rounds: number;
  holdWork: number;
  holdRest: number;
  pushWork: number;
  pushRest: number;
};

// Rounds per phase increase in steps every 2–3 levels
export function roundsForLevel(level: number): number {
  if (level <= 2) return 3;
  if (level <= 5) return 4;
  if (level <= 8) return 5;
  if (level <= 12) return 6;
  if (level <= 16) return 7;
  return 8;
}

// Smooth progression from L1 (5s work) to L20 (30s work)
export function getLevel(level: number): Level {
  const l = Math.min(TOTAL_LEVELS, Math.max(1, level));
  const work = Math.round(5 + ((30 - 5) * (l - 1)) / (TOTAL_LEVELS - 1));
  const rest = Math.round(5 + ((10 - 5) * (l - 1)) / (TOTAL_LEVELS - 1));
  return {
    level: l,
    rounds: roundsForLevel(l),
    holdWork: work,
    holdRest: rest,
    pushWork: work,
    pushRest: rest,
  };
}

export function allLevels(): Level[] {
  return Array.from({ length: TOTAL_LEVELS }, (_, i) => getLevel(i + 1));
}

// Number of exercise blocks in a workout (Hold + Push always; +Pulses & PushPulses from L5)
export function blocksForLevel(l: Level): number {
  return l.level >= 5 ? 4 : 2;
}

export function totalWorkoutTime(l: Level): number {
  const perRound = l.holdWork + l.holdRest; // work == push, rest == pushRest by construction
  return blocksForLevel(l) * l.rounds * perRound;
}
