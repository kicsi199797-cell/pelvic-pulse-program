export const TOTAL_LEVELS = 20;
export const REPS_PER_PHASE = 6;
export const WORKOUTS_PER_LEVEL = 4; // ~4 workouts per level -> ~90 days total(ish)

export type Level = {
  level: number;
  holdWork: number;
  holdRest: number;
  pushWork: number;
  pushRest: number;
};

// Smooth progression from L1 (5s work) to L20 (30s work)
export function getLevel(level: number): Level {
  const l = Math.min(TOTAL_LEVELS, Math.max(1, level));
  // work grows 5 -> 30 across 20 levels
  const work = Math.round(5 + ((30 - 5) * (l - 1)) / (TOTAL_LEVELS - 1));
  // rest grows 5 -> 10 across 20 levels
  const rest = Math.round(5 + ((10 - 5) * (l - 1)) / (TOTAL_LEVELS - 1));
  return {
    level: l,
    holdWork: work,
    holdRest: rest,
    pushWork: work,
    pushRest: rest,
  };
}

export function allLevels(): Level[] {
  return Array.from({ length: TOTAL_LEVELS }, (_, i) => getLevel(i + 1));
}

export function totalWorkoutTime(l: Level) {
  return REPS_PER_PHASE * (l.holdWork + l.holdRest) + REPS_PER_PHASE * (l.pushWork + l.pushRest);
}
