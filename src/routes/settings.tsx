import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Globe,
  Bell,
  Smartphone,
  Volume2,
  Moon,
  BarChart3,
  Info,
  Shield,
  FileText,
  Star,
  Mail,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import { useSettings, type Appearance } from "../lib/useSettings";
import { useI18n, SUPPORTED_LANGUAGES, type LanguageCode } from "../lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Stamina Trainer" },
      { name: "description", content: "Customize your Stamina Trainer experience." },
      { property: "og:title", content: "Settings — Stamina Trainer" },
      { property: "og:description", content: "Customize your Stamina Trainer experience." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, hydrated, update } = useSettings();
  const { t, setLanguage } = useI18n();

  if (!hydrated) {
    return (
      <AppShell>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 px-6 pb-28 pt-12">
        <header>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {t("settings.kicker")}
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">{t("settings.title")}</h1>
        </header>

        <section className="flex flex-col gap-3">
          <SectionLabel>{t("settings.training")}</SectionLabel>

          <Row icon={<Globe size={20} />} label={t("settings.language")}>
            <select
              value={settings.language}
              onChange={(e) => {
                const code = e.target.value as LanguageCode;
                update({ language: code });
                setLanguage(code);
              }}
              className="max-w-[10rem] rounded-lg border border-border/60 bg-background px-2 py-1 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </Row>

          <Row icon={<Bell size={20} />} label={t("settings.dailyReminder")}>
            <div className="flex items-center gap-3">
              {settings.reminderEnabled && (
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => update({ reminderTime: e.target.value })}
                  className="rounded-lg border border-border/60 bg-background px-2 py-1 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              )}
              <Switch
                checked={settings.reminderEnabled}
                onChange={() => update({ reminderEnabled: !settings.reminderEnabled })}
              />
            </div>
          </Row>

          <Row icon={<Smartphone size={20} />} label={t("settings.vibration")}>
            <Switch
              checked={settings.vibration}
              onChange={() => update({ vibration: !settings.vibration })}
            />
          </Row>

          <Row icon={<Volume2 size={20} />} label={t("settings.soundEffects")}>
            <Switch
              checked={settings.soundEffects}
              onChange={() => update({ soundEffects: !settings.soundEffects })}
            />
          </Row>

          <Row icon={<Moon size={20} />} label={t("settings.appearance")}>
            <SegmentedControl
              value={settings.appearance}
              options={[
                { value: "system", label: t("settings.system") },
                { value: "dark", label: t("settings.dark") },
                { value: "light", label: t("settings.light") },
              ]}
              onChange={(v) => update({ appearance: v as Appearance })}
            />
          </Row>
        </section>

        <section className="flex flex-col gap-3">
          <SectionLabel>{t("settings.app")}</SectionLabel>

          <LinkRow icon={<BarChart3 size={20} />} label={t("settings.trainingStats")} to="/progress" />
          <LinkRow icon={<Info size={20} />} label={t("settings.about")} to="/about" />
          <LinkRow icon={<Shield size={20} />} label={t("settings.privacy")} to="/privacy" />
          <LinkRow icon={<FileText size={20} />} label={t("settings.terms")} to="/terms" />

          <button
            onClick={() => alert(t("settings.rateAlert"))}
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-4 text-left transition-colors hover:bg-card"
          >
            <div className="flex items-center gap-3">
              <div className="text-primary"><Star size={20} /></div>
              <span className="text-sm font-medium">{t("settings.rate")}</span>
            </div>
            <ChevronRight size={18} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>

          <a
            href="mailto:support@staminatrainer.app?subject=Stamina%20Trainer%20Support"
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-4 text-left transition-colors hover:bg-card"
          >
            <div className="flex items-center gap-3">
              <div className="text-primary"><Mail size={20} /></div>
              <span className="text-sm font-medium">{t("settings.contact")}</span>
            </div>
            <ChevronRight size={18} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </a>
        </section>

        <div className="text-center text-xs text-muted-foreground">{t("settings.version")}</div>
      </div>
    </AppShell>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-1 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
      {children}
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {children}
    </div>
  );
}

function LinkRow({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-4 transition-colors hover:bg-card"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight size={18} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        hapticSelection();
        onChange();
      }}
      className="-my-2 grid h-11 min-w-11 place-items-center px-1"
      aria-checked={checked}
      aria-label={label}
      role="switch"
    >
      <span
        className={`relative block h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ease-out ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className="absolute left-1 top-1 block h-5 w-5 rounded-full bg-primary-foreground shadow-sm transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${checked ? 20 : 0}px, 0, 0)`,
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        />
      </span>
    </button>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex rounded-xl border border-border/60 bg-background p-1">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
