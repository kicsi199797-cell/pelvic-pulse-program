import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Flame, Trophy, Calendar, Settings } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { useProgress } from "../lib/useProgress";
import {
  getLevel,
  TOTAL_LEVELS,
  totalWorkoutTime,
  requiredWorkouts,
  totalRequiredWorkouts,
  completedWorkoutsBeforeLevel,
} from "../lib/program";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stamina Trainer — Daily Pelvic Floor Workout" },
      { name: "description", content: "Start today's Kegel workout. Track your streak and progress through 20 levels." },
      { property: "og:title", content: "Stamina Trainer" },
      { property: "og:description", content: "Start today's Kegel workout. Track your streak and progress through 20 levels." },
    ],
  }),
  component: Home,
});

function Home() {
  const { progress, hydrated } = useProgress();
  const { t, formatNumber } = useI18n();
  const level = getLevel(progress.currentLevel);
  const required = requiredWorkouts(progress.currentLevel);
  const totalRequired = totalRequiredWorkouts();
  const done = completedWorkoutsBeforeLevel(progress.currentLevel) + progress.workoutsInLevel;
  const overall = done / totalRequired;
  const daysLeft = Math.max(0, totalRequired - progress.totalWorkouts);

  return (
    <AppShell>
      <div className="flex flex-col gap-8 px-6 pt-12">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {t("home.brand")}
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold">
              {t("home.levelOf", { n: formatNumber(progress.currentLevel), total: TOTAL_LEVELS })}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/70 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t("home.settings")}
            >
              <Settings size={20} />
            </Link>
            <div className="rounded-full border border-border/60 bg-card/70 px-4 py-2 text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("home.level")}</div>
              <div className="font-display text-lg font-bold text-primary">
                {String(progress.currentLevel).padStart(2, "0")}
                <span className="text-muted-foreground">/{TOTAL_LEVELS}</span>
              </div>
            </div>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("home.workoutsLevel", { done: formatNumber(progress.workoutsInLevel), required: formatNumber(required) })}</span>
            <span className="tabular-nums">{formatNumber(Math.round(overall * 100))}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${hydrated ? overall * 100 : 0}%` }}
            />
          </div>
        </section>

        <section className="relative flex flex-col items-center rounded-3xl border border-border/60 bg-card/60 p-6 shadow-[0_20px_80px_-40px_oklch(0.62_0.2_245/0.6)]">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            {t("home.todaysWorkout")}
          </div>
          <div className="mt-6 flex flex-col items-center">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-border/70 bg-background/60">
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-xl" />
              <div className="relative text-center">
                <div className="font-display text-6xl font-bold tabular-nums">{level.holdWork}s</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {t("home.holdRest", { n: level.holdRest })}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {t("home.repsPhases", { reps: level.rounds })}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground/80">
                  ~{Math.round(totalWorkoutTime(level) / 60)} min
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/workout"
            className="group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 font-display text-lg font-bold uppercase tracking-widest text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.72_0.16_235/0.7)] transition-transform active:scale-[0.98]"
          >
            <Play className="fill-primary-foreground" size={22} />
            {t("home.start")}
          </Link>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <Stat icon={<Flame size={18} />} label={t("home.streak")} value={progress.streak} />
          <Stat icon={<Trophy size={18} />} label={t("home.total")} value={progress.totalWorkouts} />
          <Stat icon={<Calendar size={18} />} label={t("progress.daysRemaining")} value={daysLeft} />
        </section>
      </div>
    </AppShell>
  );
}


function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  const { formatNumber } = useI18n();
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="text-primary">{icon}</div>
      <div className="mt-2 font-display text-2xl font-bold tabular-nums">{formatNumber(value)}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
