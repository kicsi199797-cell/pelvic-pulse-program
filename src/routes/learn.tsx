import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Hand, ArrowDown, Sparkles } from "lucide-react";
import { AppShell } from "../components/AppShell";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "How It Works — Stamina Trainer" },
      { name: "description", content: "Learn how to perform pelvic floor Hold and Push exercises correctly." },
      { property: "og:title", content: "How It Works — Stamina Trainer" },
      { property: "og:description", content: "Learn how to perform pelvic floor Hold and Push exercises correctly." },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5 px-6 pb-12 pt-12">
        <header>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Education
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">How It Works</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Two simple exercises, practiced daily, to build strength and control.
          </p>
        </header>

        <Card
          icon={<Activity size={22} className="text-primary" />}
          title="What are the pelvic floor muscles?"
          body="The pelvic floor muscles support the bladder, bowel, and sexual function. Training these muscles can improve strength, endurance, muscle control, and body awareness."
        />

        <Card
          icon={<Hand size={22} className="text-primary" />}
          title="HOLD (Contract)"
          body="Imagine you are trying to stop the flow of urine or prevent passing gas. Gently lift and squeeze the muscles upward without tightening your abs, glutes, or thighs."
          bullets={[
            "A gentle lifting sensation.",
            "A controlled muscle contraction.",
            "Normal breathing throughout the exercise.",
          ]}
        />

        <Card
          icon={<ArrowDown size={22} className="text-primary" />}
          title="PUSH"
          body="Instead of squeezing upward, gently push the pelvic floor downward, as if beginning to urinate or pass gas. This should be a gentle movement, never a strong strain."
          bullets={[
            "A gentle downward release.",
            "Relaxation rather than contraction.",
            "No pain or excessive pressure.",
          ]}
        />

        <Card
          icon={<Sparkles size={22} className="text-primary" />}
          title="Important Tips"
          bullets={[
            "Never hold your breath.",
            "Keep your stomach, thighs, and buttocks relaxed.",
            "Breathe naturally.",
            "Stop if you feel pain or discomfort.",
            "Consistency is more important than intensity.",
          ]}
        />

        <Link
          to="/"
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-primary py-5 font-display text-lg font-bold uppercase tracking-widest text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.72_0.16_235/0.7)] transition-transform active:scale-[0.98]"
        >
          Start Training
        </Link>
      </div>
    </AppShell>
  );
}

function Card({
  icon,
  title,
  body,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  body?: string;
  bullets?: string[];
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/60 p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-background/60">
          {icon}
        </div>
        <h2 className="font-display text-lg font-bold leading-tight">{title}</h2>
      </div>
      {body && <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>}
      {bullets && (
        <ul className="mt-1 flex flex-col gap-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
