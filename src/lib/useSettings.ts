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

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => makeInitial("en"));
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
    const fresh = makeInitial(detectBrowserLanguage());
    save(fresh);
    setSettings(fresh);
  }, []);

  return { settings, hydrated, update, reset };
}
