import { createFileRoute } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { useProgress } from "../lib/useProgress";
import { allLevels, TOTAL_LEVELS, requiredWorkouts, totalRequiredWorkouts, completedWorkoutsBeforeLevel } from "../lib/program";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Stamina Trainer" },
      { name: "description", content: "Track completed levels, streaks, and total workouts." },
      { property: "og:title", content: "Progress — Stamina Trainer" },
      { property: "og:description", content: "Track completed levels, streaks, and total workouts." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { progress, reset } = useProgress();
  const { t, formatNumber } = useI18n();
  const levels = allLevels();
  const completedLevels = progress.currentLevel - 1;
  const totalRequired = totalRequiredWorkouts();
  const done = completedWorkoutsBeforeLevel(progress.currentLevel) + progress.workoutsInLevel;
  const completionPct = Math.round((done / totalRequired) * 100);
  const daysRemaining = Math.max(0, totalRequired - progress.totalWorkouts);
  const requiredThisLevel = requiredWorkouts(progress.currentLevel);

  return (
    <AppShell>
      <div className="safe-top flex flex-col gap-6 px-6 pt-12">
        <header>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {t("progress.kicker")}
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">{t("progress.title")}</h1>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <Metric label={t("progress.completedLevels")} value={`${formatNumber(completedLevels)}/${TOTAL_LEVELS}`} />
          <Metric label={t("progress.currentLevel")} value={formatNumber(progress.currentLevel)} />
          <Metric
            label={t("progress.workoutsThisLevel")}
            value={`${formatNumber(progress.workoutsInLevel)}/${formatNumber(requiredThisLevel)}`}
          />
          <Metric label={t("progress.totalWorkouts")} value={formatNumber(progress.totalWorkouts)} />
          <Metric label={t("progress.daysRemaining")} value={formatNumber(daysRemaining)} />
          <Metric label={t("progress.completion")} value={`${formatNumber(completionPct)}%`} />
          <Metric label={t("progress.streak")} value={t("progress.daysShort", { n: formatNumber(progress.streak) })} />
          <Metric label={t("progress.longestStreak")} value={t("progress.daysShort", { n: formatNumber(progress.longestStreak) })} />
        </div>


        <section>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {t("progress.levels")}
          </div>
          <div className="flex flex-col gap-2">
            {levels.map((l) => {
              const completed = l.level < progress.currentLevel;
              const current = l.level === progress.currentLevel;
              const locked = l.level > progress.currentLevel;
              return (
                <div
                  key={l.level}
                  className={`flex items-center justify-between rounded-2xl border p-4 ${
                    current
                      ? "border-primary/60 bg-primary/10"
                      : completed
                        ? "border-border/60 bg-card/60"
                        : "border-border/40 bg-card/30 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-xl font-display font-bold ${
                        completed
                          ? "bg-primary text-primary-foreground"
                          : current
                            ? "border border-primary text-primary"
                            : "border border-border text-muted-foreground"
                      }`}
                    >
                      {completed ? <Check size={18} /> : locked ? <Lock size={14} /> : l.level}
                    </div>
                    <div>
                      <div className="font-display text-base font-bold">{t("progress.levelN", { n: l.level })}</div>
                      <div className="text-xs text-muted-foreground">
                        {t("progress.holdRest", { h: l.holdWork, r: l.holdRest })} · {t("progress.required", { n: requiredWorkouts(l.level) })}
                      </div>

                    </div>
                  </div>
                  {current && (
                    <div className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      {t("progress.active")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <button
          onClick={() => {
            if (confirm(t("progress.resetConfirm"))) reset();
          }}
          className="mt-2 rounded-2xl border border-border/60 bg-card/40 py-3 text-sm text-muted-foreground hover:text-foreground"
        >
          {t("progress.reset")}
        </button>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
