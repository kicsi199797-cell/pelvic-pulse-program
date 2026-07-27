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
      <div className="flex flex-col gap-6 px-6 pb-12 pt-12">
        <header>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Preferences
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">Settings</h1>
        </header>

        <section className="flex flex-col gap-3">
          <SectionLabel>Training</SectionLabel>

          <Row icon={<Globe size={20} />} label="Language">
            <select
              value={settings.language}
              onChange={(e) => update({ language: e.target.value })}
              className="rounded-lg border border-border/60 bg-background px-2 py-1 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
            </select>
          </Row>

          <Row icon={<Bell size={20} />} label="Daily Reminder">
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

          <Row icon={<Smartphone size={20} />} label="Vibration">
            <Switch
              checked={settings.vibration}
              onChange={() => update({ vibration: !settings.vibration })}
            />
          </Row>

          <Row icon={<Volume2 size={20} />} label="Sound Effects">
            <Switch
              checked={settings.soundEffects}
              onChange={() => update({ soundEffects: !settings.soundEffects })}
            />
          </Row>

          <Row icon={<Moon size={20} />} label="Appearance">
            <SegmentedControl
              value={settings.appearance}
              options={[
                { value: "system", label: "System" },
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
              ]}
              onChange={(v) => update({ appearance: v as Appearance })}
            />
          </Row>
        </section>

        <section className="flex flex-col gap-3">
          <SectionLabel>App</SectionLabel>

          <LinkRow icon={<BarChart3 size={20} />} label="Training Statistics" to="/progress" />
          <LinkRow icon={<Info size={20} />} label="About" to="/about" />
          <LinkRow icon={<Shield size={20} />} label="Privacy Policy" to="/privacy" />
          <LinkRow icon={<FileText size={20} />} label="Terms of Use" to="/terms" />

          <button
            onClick={() => alert("Thanks for your support! Rating dialog coming soon.")}
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-4 text-left transition-colors hover:bg-card"
          >
            <div className="flex items-center gap-3">
              <div className="text-primary">{<Star size={20} />}</div>
              <span className="text-sm font-medium">Rate the App</span>
            </div>
            <ChevronRight size={18} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>

          <a
            href="mailto:support@staminatrainer.app?subject=Stamina%20Trainer%20Support"
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-4 text-left transition-colors hover:bg-card"
          >
            <div className="flex items-center gap-3">
              <div className="text-primary">{<Mail size={20} />}</div>
              <span className="text-sm font-medium">Contact Support</span>
            </div>
            <ChevronRight size={18} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </a>
        </section>

        <div className="text-center text-xs text-muted-foreground">Stamina Trainer v1.0</div>
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

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
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

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-primary-foreground shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
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
