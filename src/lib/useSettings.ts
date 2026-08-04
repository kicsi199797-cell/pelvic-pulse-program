import { useCallback, useEffect, useSyncExternalStore } from "react";
import { detectBrowserLanguage, isSupportedLanguage, type LanguageCode } from "./i18n";

const KEY = "stamina-trainer-settings-v1";

export type Appearance = "system" | "dark" | "light";

export type Settings = {
  language: LanguageCode;
  reminderEnabled: boolean;
  reminderTime: string;
  vibration: boolean;
  soundEffects: boolean;
  appearance: Appearance;
};

const baseDefaults: Omit<Settings, "language"> = {
  reminderEnabled: false,
  reminderTime: "20:00",
  vibration: true,
  soundEffects: true,
  appearance: "system",
};

function makeInitial(language: LanguageCode = "en"): Settings {
  return { language, ...baseDefaults };
}

function load(): Settings {
  if (typeof window === "undefined") return makeInitial("en");
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      // First launch: auto-detect device language.
      const detected = detectBrowserLanguage();
      const next = makeInitial(detected);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    }
    const parsed = JSON.parse(raw) as Partial<Settings>;
    const language = parsed.language && isSupportedLanguage(parsed.language)
      ? (parsed.language as LanguageCode)
      : detectBrowserLanguage();
    return { ...makeInitial(language), ...parsed, language };
  } catch {
    return makeInitial(detectBrowserLanguage());
  }
}

function save(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

// ---- Shared module-level store so every component sees the same settings ----
const serverSnapshot = makeInitial("en");
let current: Settings = serverSnapshot;
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Settings {
  return current;
}

function ensureLoaded() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  current = load();
  emit();
}

export function setSettings(next: Settings) {
  current = next;
  save(next);
  emit();
}

/** Read the current settings outside of React (used by non-component helpers such as haptics). */
export function getSettings(): Settings {
  ensureLoaded();
  return current;
}

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
  // Hydration flag must be false on the first client render so SSR markup matches.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    ensureLoaded();
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        current = load();
        emit();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings({ ...current, ...patch });
  }, []);

  const reset = useCallback(() => {
    setSettings(makeInitial(detectBrowserLanguage()));
  }, []);

  return { settings, hydrated: initialized, update, reset };
}

