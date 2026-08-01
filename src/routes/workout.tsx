import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, X } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { CircularTimer } from "../components/CircularTimer";
import { useProgress } from "../lib/useProgress";
import { getLevel } from "../lib/program";
import { useI18n } from "../lib/i18n";
import { useSettings } from "../lib/useSettings";
import { hapticImpact, hapticSuccess } from "../lib/haptics";

export const Route = createFileRoute("/workout")({
  head: () => ({
    meta: [
      { title: "Workout — Stamina Trainer" },
      { name: "description", content: "Guided Hold and Push workout with countdown timer." },
      { property: "og:title", content: "Workout — Stamina Trainer" },
      { property: "og:description", content: "Guided Hold and Push workout with countdown timer." },
    ],
  }),
  component: Workout,
});

type Exercise = "hold" | "pulses" | "push" | "pushPulses";
type Mode = "work" | "rest";
type Step = { exercise: Exercise; phase: 1 | 2; mode: Mode; duration: number; rep: number };

function buildSteps(
  holdWork: number,
  holdRest: number,
  pushWork: number,
  pushRest: number,
  includePulses: boolean,
  rounds: number,
): Step[] {
  const steps: Step[] = [];
  const add = (exercise: Exercise, phase: 1 | 2, work: number, rest: number) => {
    for (let i = 1; i <= rounds; i++) {
      steps.push({ exercise, phase, mode: "work", duration: work, rep: i });
      steps.push({ exercise, phase, mode: "rest", duration: rest, rep: i });
    }
  };
  add("hold", 1, holdWork, holdRest);
  if (includePulses) add("pulses", 1, holdWork, holdRest);
  add("push", 2, pushWork, pushRest);
  if (includePulses) add("pushPulses", 2, pushWork, pushRest);
  return steps;
}

function beep(freq = 660, duration = 160) {
  try {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
    setTimeout(() => ctx.close(), duration + 100);
  } catch {}
}

function Workout() {
  const navigate = useNavigate();
  const { progress, completeWorkout } = useProgress();
  const { settings } = useSettings();
  const { t } = useI18n();
  const level = useMemo(() => getLevel(progress.currentLevel), [progress.currentLevel]);
  const steps = useMemo(
    () => buildSteps(level.holdWork, level.holdRest, level.pushWork, level.pushRest, level.level >= 5, level.rounds),
    [level],
  );

  const [stepIdx, setStepIdx] = useState(0);
  const [remaining, setRemaining] = useState(steps[0].duration);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);

  // Frame-accurate timing state kept in refs so ticking never re-renders needlessly.
  const leftMsRef = useRef(steps[0].duration * 1000);
  const barRef = useRef<HTMLDivElement | null>(null);

  const step = steps[stepIdx];
  const soundRef = useRef(settings.soundEffects);
  soundRef.current = settings.soundEffects;

  // New step: reset the clock and fire cue feedback once.
  useEffect(() => {
    leftMsRef.current = step.duration * 1000;
    setRemaining(step.duration);
    hapticImpact(step.mode === "work" ? "medium" : "light");
    if (soundRef.current) beep(step.mode === "work" ? 720 : 480, 160);
  }, [stepIdx, step.duration, step.mode]);

  const advance = useCallback(() => {
    setStepIdx((i) => {
      if (i < steps.length - 1) return i + 1;
      setDone(true);
      return i;
    });
  }, [steps.length]);

  // requestAnimationFrame loop — deadline based, so it never drifts or drops seconds.
  useEffect(() => {
    if (!running || done) return;
    let raf = 0;
    const deadline = performance.now() + leftMsRef.current;
    const totalSteps = steps.length;

    const tick = () => {
      const left = deadline - performance.now();
      leftMsRef.current = left;
      if (left <= 0) {
        advance();
        return;
      }
      const secs = Math.ceil(left / 1000);
      setRemaining((prev) => (prev === secs ? prev : secs));
      if (barRef.current) {
        const stepDone = 1 - left / (step.duration * 1000);
        barRef.current.style.transform = `scaleX(${(stepIdx + stepDone) / totalSteps})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, done, stepIdx, steps.length, step.duration, advance]);

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      hapticSuccess();
      if (soundRef.current) beep(880, 300);
      completeWorkout();
    }
  }, [done, completeWorkout]);

  const exit = useCallback(() => {
    hapticImpact("light");
    navigate({ to: "/" });
  }, [navigate]);

  if (done) return <CompletionScreen onExit={() => navigate({ to: "/" })} completion={progress.lastCompletion} />;

  const EX_LABEL: Record<Exercise, string> = {
    hold: t("workout.hold"),
    pulses: t("workout.quickPulses"),
    push: t("workout.pushU"),
    pushPulses: t("workout.quickPushes"),
  };
  const EX_SUBLABEL: Record<Exercise, string> = {
    hold: t("workout.contract"),
    pulses: t("workout.contract"),
    push: t("workout.pushDown"),
    pushPulses: t("workout.pushDown"),
  };
  const EX_INSTR: Record<Exercise, string> = {
    hold: t("workout.contractInstr"),
    pulses: t("workout.pulsesInstr"),
    push: t("workout.pushInstr"),
    pushPulses: t("workout.pushPulsesInstr"),
  };
  const EX_ACCENT: Record<Exercise, "primary" | "success" | "warning"> = {
    hold: "primary",
    pulses: "success",
    push: "warning",
    pushPulses: "warning",
  };

  const label = step.mode === "work" ? EX_LABEL[step.exercise] : t("workout.relax");
  const sublabel = step.mode === "work" ? EX_SUBLABEL[step.exercise] : t("workout.release");
  const instr = step.mode === "work" ? EX_INSTR[step.exercise] : t("workout.relaxInstr");
  const stepProgress = 1 - remaining / step.duration;
  const phaseNum = step.phase;
  const phaseTitle = EX_LABEL[step.exercise];

  return (
    <AppShell hideNav>
      <div className="safe-top flex min-h-dvh flex-col px-6 pt-10 pb-[max(var(--safe-bottom),1.5rem)]">
        <header className="flex items-center justify-between gap-3">
          <button
            onClick={exit}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-transform active:scale-95"
            aria-label={t("workout.exit")}
          >
            <X size={18} aria-hidden />
          </button>
          <div className="min-w-0 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              {t("workout.phaseOf", { n: phaseNum })}
            </div>
            <div className="mt-0.5 truncate font-display text-sm font-bold">
              {phaseTitle} · {t("workout.rep", { a: step.rep, b: level.rounds })}
            </div>
          </div>
          <button
            onClick={() => {
              hapticImpact("light");
              setRunning((r) => !r);
            }}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border/60 bg-card/60 text-foreground transition-transform active:scale-95"
            aria-label={running ? t("workout.pause") : t("workout.resume")}
          >
            {running ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
          </button>
        </header>

        <div className="mt-6">
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              ref={barRef}
              className="h-full origin-left bg-gradient-to-r from-primary to-accent"
              style={{ transform: "scaleX(0)", width: "100%", willChange: "transform" }}
            />
          </div>
        </div>

        <div
          className="flex flex-1 flex-col items-center justify-center gap-8"
          role="timer"
          aria-live="polite"
          aria-label={`${label} — ${remaining}`}
        >
          <CircularTimer
            progress={stepProgress}
            secondsLeft={remaining}
            label={label}
            sublabel={sublabel}
            accent={step.mode === "work" ? EX_ACCENT[step.exercise] : "muted"}
            animate={running}
          />
          <div className="text-center text-sm text-muted-foreground">{instr}</div>
        </div>
      </div>
    </AppShell>
  );
}

const CompletionScreen = memo(function CompletionScreen({
  onExit,
  completion,
}: {
  onExit: () => void;
  completion: { completedInLevel: number; requiredInLevel: number; leveledUp: boolean; newLevel: number } | null;
}) {
  const { t, formatNumber } = useI18n();
  const c = completion;
  const message = !c
    ? t("workout.keepGoing")
    : c.leveledUp
      ? t("workout.levelUnlocked", { n: formatNumber(c.newLevel) })
      : c.completedInLevel === c.requiredInLevel - 1
        ? t("workout.oneMoreToUnlock", { n: formatNumber(c.newLevel + 1) })
        : t("workout.youCompletedX", {
            done: formatNumber(c.completedInLevel),
            required: formatNumber(c.requiredInLevel),
          });
  return (
    <AppShell hideNav>
      <div className="safe-top flex min-h-dvh flex-col items-center justify-center gap-6 px-6 pb-[max(var(--safe-bottom),1.5rem)] text-center">
        <div className="relative animate-scale-in">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative grid h-28 w-28 place-items-center rounded-full border border-primary/60 bg-card">
            <span className="font-display text-4xl" aria-hidden>✓</span>
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold">{t("workout.greatJob")}</h1>
        <p className="max-w-xs text-muted-foreground">{message}</p>
        {c && (
          <div className="w-full max-w-xs">
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full origin-left rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-700 ease-out"
                style={{ width: "100%", transform: `scaleX(${c.leveledUp ? 1 : c.completedInLevel / c.requiredInLevel})` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {t("home.workoutsLevel", {
                done: formatNumber(c.leveledUp ? c.requiredInLevel : c.completedInLevel),
                required: formatNumber(c.requiredInLevel),
              })}
            </div>
          </div>
        )}
        <div className="rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-primary">
          {t("workout.plusOne")}
        </div>
        <button
          onClick={() => {
            hapticImpact("light");
            onExit();
          }}
          className="mt-2 min-h-12 w-full max-w-xs rounded-2xl bg-primary py-4 font-display text-base font-bold uppercase tracking-widest text-primary-foreground transition-transform active:scale-[0.98]"
        >
          {t("workout.done")}
        </button>
      </div>
    </AppShell>
  );
});
