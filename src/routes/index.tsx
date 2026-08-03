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
import { hapticImpact } from "../lib/haptics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stamina Trainer — Daily Pelvic Floor Workout" },
      { name: "description", content: "Start today's Kegel workout. Track your streak and progress through 20 levels." },
      { property: "og:title", content: "Stamina Trainer — Daily Pelvic Floor Workout" },
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
      <div className="pad-x safe-top flex flex-col gap-8 pt-10">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <div className="truncate text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {t("home.brand")}
            </div>
            <h1 className="mt-1 font-display text-xl font-bold leading-tight sm:text-2xl">
              {t("home.levelOf", { n: formatNumber(progress.currentLevel), total: TOTAL_LEVELS })}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/settings"
              onClick={() => hapticImpact("light")}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border/60 bg-card/70 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t("home.settings")}
            >
              <Settings size={20} />
            </Link>
            <div className="shrink-0 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("home.level")}</div>
              <div className="font-display text-base font-bold leading-tight text-primary">
                {String(progress.currentLevel).padStart(2, "0")}
                <span className="text-muted-foreground">/{TOTAL_LEVELS}</span>
              </div>
            </div>
          </div>
        </header>


        <section>
          <div className="flex items-start justify-between gap-3 text-xs text-muted-foreground">
            <span className="min-w-0">{t("home.workoutsLevel", { done: formatNumber(progress.workoutsInLevel), required: formatNumber(required) })}</span>
            <span className="shrink-0 tabular-nums">{formatNumber(Math.round(overall * 100))}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${hydrated ? overall * 100 : 0}%` }}
            />
          </div>
        </section>

        <section className="relative flex flex-col items-center rounded-3xl border border-border/60 bg-card/60 p-5 [box-shadow:var(--shadow-card)]">
          <div className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {t("home.todaysWorkout")}
          </div>
          <div className="mt-6 flex w-full flex-col items-center">
            <div
              className="relative flex aspect-square w-full items-center justify-center rounded-full border border-border/70 bg-background/60"
              style={{ maxWidth: "14rem" }}
            >
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-xl" />
              <div className="relative px-6 text-center">
                <div
                  className="font-display font-bold leading-none tabular-nums"
                  style={{ fontSize: "clamp(2.75rem, 15vw, 3.75rem)" }}
                >
                  {level.holdWork}s
                </div>
                <div className="mt-2 text-[0.7rem] uppercase leading-tight tracking-widest text-muted-foreground">
                  {t("home.holdRest", { n: level.holdRest })}
                </div>
                <div className="mt-1 text-[0.7rem] uppercase leading-tight tracking-widest text-muted-foreground">
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
            onClick={() => hapticImpact("medium")}
            className="group mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary px-4 py-4 text-center font-display text-base font-bold uppercase tracking-widest text-primary-foreground [box-shadow:var(--shadow-primary)] transition-transform active:scale-[0.98]"
          >
            <Play className="shrink-0 fill-primary-foreground" size={22} />
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
    <div className="flex min-w-0 flex-col rounded-2xl border border-border/60 bg-card/60 p-3">
      <div className="text-primary">{icon}</div>
      <div className="mt-2 font-display text-xl font-bold leading-none tabular-nums">{formatNumber(value)}</div>
      <div className="mt-1 text-[10px] uppercase leading-tight tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

