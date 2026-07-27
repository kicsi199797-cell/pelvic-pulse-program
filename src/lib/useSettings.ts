import { useCallback, useEffect, useState } from "react";

const KEY = "stamina-trainer-settings-v1";

export type Appearance = "system" | "dark" | "light";

export type Settings = {
  language: string;
  reminderEnabled: boolean;
  reminderTime: string;
  vibration: boolean;
  soundEffects: boolean;
  appearance: Appearance;
};

const initial: Settings = {
  language: "en",
  reminderEnabled: false,
  reminderTime: "20:00",
  vibration: true,
  soundEffects: true,
  appearance: "system",
};

function load(): Settings {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

function save(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(load());
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    save(initial);
    setSettings(initial);
  }, []);

  return { settings, hydrated, update, reset };
}
