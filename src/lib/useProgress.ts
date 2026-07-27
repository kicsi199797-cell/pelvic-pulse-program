import { useCallback, useEffect, useState } from "react";
import { TOTAL_LEVELS, WORKOUTS_PER_LEVEL } from "./program";

const KEY = "stamina-trainer-progress-v1";

export type Progress = {
  totalWorkouts: number;
  currentLevel: number;
  workoutsInLevel: number;
  currentDay: number;
  streak: number;
  longestStreak: number;
  lastWorkoutDate: string | null; // YYYY-MM-DD
};

const initial: Progress = {
  totalWorkouts: 0,
  currentLevel: 1,
  workoutsInLevel: 0,
  currentDay: 1,
  streak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
};

function load(): Progress {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string) {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(load());
    setHydrated(true);
  }, []);

  const completeWorkout = useCallback(() => {
    setProgress((prev) => {
      const today = todayStr();
      let streak = prev.streak;
      if (prev.lastWorkoutDate === today) {
        // already counted today — still increment total
      } else if (prev.lastWorkoutDate && daysBetween(prev.lastWorkoutDate, today) === 1) {
        streak = prev.streak + 1;
      } else {
        streak = 1;
      }
      const workoutsInLevel = prev.workoutsInLevel + 1;
      let currentLevel = prev.currentLevel;
      let remaining = workoutsInLevel;
      if (workoutsInLevel >= WORKOUTS_PER_LEVEL && currentLevel < TOTAL_LEVELS) {
        currentLevel += 1;
        remaining = 0;
      }
      const next: Progress = {
        totalWorkouts: prev.totalWorkouts + 1,
        currentLevel,
        workoutsInLevel: remaining,
        currentDay: prev.currentDay + (prev.lastWorkoutDate === today ? 0 : 1),
        streak,
        longestStreak: Math.max(prev.longestStreak, streak),
        lastWorkoutDate: today,
      };
      save(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    save(initial);
    setProgress(initial);
  }, []);

  return { progress, hydrated, completeWorkout, reset };
}
