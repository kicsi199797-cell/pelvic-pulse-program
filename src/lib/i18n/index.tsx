import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "./locales/en";
import hu from "./locales/hu";
import de from "./locales/de";
import fr from "./locales/fr";
import es from "./locales/es";
import it from "./locales/it";
import pt from "./locales/pt";
import pl from "./locales/pl";
import nl from "./locales/nl";
import cs from "./locales/cs";
import sk from "./locales/sk";
import ro from "./locales/ro";
import sv from "./locales/sv";
import da from "./locales/da";
import fi from "./locales/fi";
import nb from "./locales/nb";
import type { Dict } from "./locales/en";

export type LanguageCode =
  | "en" | "hu" | "de" | "fr" | "es" | "it" | "pt" | "pl"
  | "nl" | "cs" | "sk" | "ro" | "sv" | "da" | "fi" | "nb";

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string; flag: string; locale: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸", locale: "en-US" },
  { code: "hu", label: "Magyar", flag: "🇭🇺", locale: "hu-HU" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", locale: "de-DE" },
  { code: "fr", label: "Français", flag: "🇫🇷", locale: "fr-FR" },
  { code: "es", label: "Español", flag: "🇪🇸", locale: "es-ES" },
  { code: "it", label: "Italiano", flag: "🇮🇹", locale: "it-IT" },
  { code: "pt", label: "Português", flag: "🇵🇹", locale: "pt-PT" },
  { code: "pl", label: "Polski", flag: "🇵🇱", locale: "pl-PL" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", locale: "nl-NL" },
  { code: "cs", label: "Čeština", flag: "🇨🇿", locale: "cs-CZ" },
  { code: "sk", label: "Slovenčina", flag: "🇸🇰", locale: "sk-SK" },
  { code: "ro", label: "Română", flag: "🇷🇴", locale: "ro-RO" },
  { code: "sv", label: "Svenska", flag: "🇸🇪", locale: "sv-SE" },
  { code: "da", label: "Dansk", flag: "🇩🇰", locale: "da-DK" },
  { code: "fi", label: "Suomi", flag: "🇫🇮", locale: "fi-FI" },
  { code: "nb", label: "Norsk", flag: "🇳🇴", locale: "nb-NO" },
];

const DICTS: Record<LanguageCode, Dict> = {
  en, hu, de, fr, es, it, pt, pl, nl, cs, sk, ro, sv, da, fi, nb,
};

export function isSupportedLanguage(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGES.some((l) => l.code === code);
}

export function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === "undefined") return "en";
  const langs = [navigator.language, ...(navigator.languages ?? [])];
  for (const raw of langs) {
    if (!raw) continue;
    const base = raw.toLowerCase().split("-")[0];
    // Norwegian variants -> nb
    if (base === "no" || base === "nn") return "nb";
    if (isSupportedLanguage(base)) return base as LanguageCode;
  }
  return "en";
}

export function getLocale(code: LanguageCode): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.locale ?? "en-US";
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

type I18nContextValue = {
  language: LanguageCode;
  locale: string;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  formatNumber: (n: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type Props = {
  children: ReactNode;
  language: LanguageCode;
  onLanguageChange?: (code: LanguageCode) => void;
};

export function I18nProvider({ children, language, onLanguageChange }: Props) {
  const [current, setCurrent] = useState<LanguageCode>(language);

  useEffect(() => {
    setCurrent(language);
  }, [language]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = current;
    }
  }, [current]);

  const setLanguage = useCallback(
    (code: LanguageCode) => {
      setCurrent(code);
      onLanguageChange?.(code);
    },
    [onLanguageChange],
  );

  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTS[current] ?? DICTS.en;
    const fallback = DICTS.en;
    const locale = getLocale(current);
    return {
      language: current,
      locale,
      setLanguage,
      t: (key, vars) => {
        const raw = getByPath(dict, key) ?? getByPath(fallback, key);
        if (typeof raw !== "string") return key;
        return interpolate(raw, vars);
      },
      formatNumber: (n, options) => new Intl.NumberFormat(locale, options).format(n),
      formatDate: (date, options) => {
        const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
        return new Intl.DateTimeFormat(locale, options).format(d);
      },
    };
  }, [current, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback when provider is missing (e.g. server-render edge cases)
    const locale = "en-US";
    return {
      language: "en",
      locale,
      setLanguage: () => {},
      t: (key: string, vars?: Record<string, string | number>) => {
        const raw = getByPath(en, key);
        return typeof raw === "string" ? interpolate(raw, vars) : key;
      },
      formatNumber: (n, options) => new Intl.NumberFormat(locale, options).format(n),
      formatDate: (date, options) => {
        const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
        return new Intl.DateTimeFormat(locale, options).format(d);
      },
    };
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
