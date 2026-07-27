import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { Dumbbell, Heart, TrendingUp, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Stamina Trainer" },
      { name: "description", content: "Learn about Stamina Trainer and the 90-day pelvic floor program." },
      { property: "og:title", content: "About — Stamina Trainer" },
      { property: "og:description", content: "Learn about Stamina Trainer and the 90-day pelvic floor program." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 px-6 pb-28 pt-12">
        <header className="flex items-center gap-3">
          <Link to="/settings" className="rounded-full p-2 text-muted-foreground hover:bg-card/60 hover:text-foreground">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">About</h1>
          </div>
        </header>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Stamina Trainer is a guided 90-day pelvic floor training program designed for men. It combines simple, proven exercises with a progressive structure to build strength, control, and awareness over time.
        </p>

        <div className="grid gap-4">
          <Card
            icon={<Dumbbell size={22} className="text-primary" />}
            title="Guided Workouts"
            body="Each session walks you through two foundational techniques: Hold and Push. Clear timers and audio cues keep you in rhythm without guesswork."
          />
          <Card
            icon={<TrendingUp size={22} className="text-primary" />}
            title="Progressive Levels"
            body="20 carefully scaled levels gradually increase duration and challenge over roughly 90 days, helping your muscles adapt safely."
          />
          <Card
            icon={<Heart size={22} className="text-primary" />}
            title="Health-First Design"
            body="The program is built around consistency, comfort, and technique. No intensity spikes — just steady, sustainable practice."
          />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 text-center text-sm text-muted-foreground">
          Stamina Trainer is for general wellness and educational purposes. It is not medical advice. Consult a healthcare professional before starting any exercise program.
        </div>
      </div>
    </AppShell>
  );
}

function Card({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-background/60">
          {icon}
        </div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
