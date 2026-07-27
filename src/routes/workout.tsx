import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, X } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { CircularTimer } from "../components/CircularTimer";
import { useProgress } from "../lib/useProgress";
import { getLevel, REPS_PER_PHASE } from "../lib/program";

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

type Phase = "hold" | "push";
type Mode = "work" | "rest";

type Step = { phase: Phase; mode: Mode; duration: number; rep: number };

function buildSteps(holdWork: number, holdRest: number, pushWork: number, pushRest: number): Step[] {
  const steps: Step[] = [];
  for (let i = 1; i <= REPS_PER_PHASE; i++) {
    steps.push({ phase: "hold", mode: "work", duration: holdWork, rep: i });
    steps.push({ phase: "hold", mode: "rest", duration: holdRest, rep: i });
  }
  for (let i = 1; i <= REPS_PER_PHASE; i++) {
    steps.push({ phase: "push", mode: "work", duration: pushWork, rep: i });
    steps.push({ phase: "push", mode: "rest", duration: pushRest, rep: i });
  }
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

function vibrate(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch {}
}

function Workout() {
  const navigate = useNavigate();
  const { progress, completeWorkout } = useProgress();
  const level = useMemo(() => getLevel(progress.currentLevel), [progress.currentLevel]);
  const steps = useMemo(
    () => buildSteps(level.holdWork, level.holdRest, level.pushWork, level.pushRest),
    [level],
  );

  const [stepIdx, setStepIdx] = useState(0);
  const [remaining, setRemaining] = useState(steps[0].duration);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);

  const step = steps[stepIdx];

  useEffect(() => {
    setRemaining(step.duration);
    vibrate(step.mode === "work" ? [80, 40, 80] : 40);
    beep(step.mode === "work" ? 720 : 480, 160);
  }, [stepIdx, step.duration, step.mode]);

  useEffect(() => {
    if (!running || done) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        // advance
        if (stepIdx < steps.length - 1) {
          setStepIdx((i) => i + 1);
          return steps[stepIdx + 1].duration;
        } else {
          setDone(true);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, done, stepIdx, steps]);

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      vibrate([120, 80, 120, 80, 240]);
      beep(880, 300);
      completeWorkout();
    }
  }, [done, completeWorkout]);

  if (done) return <CompletionScreen onExit={() => navigate({ to: "/" })} />;

  const label = step.mode === "work" ? (step.phase === "hold" ? "HOLD" : "PUSH") : "RELAX";
  const totalSteps = steps.length;
  const workoutProgress = (stepIdx + (1 - remaining / step.duration)) / totalSteps;
  const stepProgress = 1 - remaining / step.duration;
  const phaseNum = step.phase === "hold" ? 1 : 2;

  return (
    <AppShell hideNav>
      <div className="flex min-h-screen flex-col px-6 pt-10">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/" })}
            className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/60 text-muted-foreground"
            aria-label="Exit workout"
          >
            <X size={18} />
          </button>
          <div className="text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Phase {phaseNum} of 2
            </div>
            <div className="mt-0.5 font-display text-sm font-bold">
              {step.phase === "hold" ? "Contract" : "Push"} · Rep {step.rep}/{REPS_PER_PHASE}
            </div>
          </div>
          <button
            onClick={() => setRunning((r) => !r)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/60 text-foreground"
            aria-label={running ? "Pause" : "Resume"}
          >
            {running ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </header>

        <div className="mt-6">
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${workoutProgress * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <CircularTimer
            progress={stepProgress}
            secondsLeft={remaining}
            label={label}
            sublabel={step.mode === "work" ? (step.phase === "hold" ? "Contract" : "Push down") : "Release"}
            accent={step.mode === "work" ? "primary" : "muted"}
          />
          <div className="text-center text-sm text-muted-foreground">
            {step.mode === "work"
              ? step.phase === "hold"
                ? "Squeeze and hold your pelvic floor muscles."
                : "Gently push your pelvic floor muscles downward."
              : "Fully relax. Breathe."}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function CompletionScreen({ onExit }: { onExit: () => void }) {
  return (
    <AppShell hideNav>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative grid h-28 w-28 place-items-center rounded-full border border-primary/60 bg-card">
            <span className="font-display text-4xl">✓</span>
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold">Workout Complete</h1>
        <p className="max-w-xs text-muted-foreground">
          Congratulations. Your discipline compounds — every session strengthens your foundation.
        </p>
        <div className="rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-primary">
          +1 Daily Workout
        </div>
        <button
          onClick={onExit}
          className="mt-4 w-full max-w-xs rounded-2xl bg-primary py-4 font-display text-base font-bold uppercase tracking-widest text-primary-foreground active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </AppShell>
  );
}
