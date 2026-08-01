import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Hand, ArrowDown, Sparkles } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { useI18n } from "../lib/i18n";

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
  const { t } = useI18n();
  return (
    <AppShell>
      <div className="safe-top flex flex-col gap-5 px-6 pb-12 pt-12">
        <header>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {t("learn.kicker")}
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">{t("learn.title")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("learn.subtitle")}</p>
        </header>

        <Card
          icon={<Activity size={22} className="text-primary" />}
          title={t("learn.whatTitle")}
          body={t("learn.whatBody")}
        />

        <Card
          icon={<Hand size={22} className="text-primary" />}
          title={t("learn.holdTitle")}
          body={t("learn.holdBody")}
          bullets={[t("learn.holdB1"), t("learn.holdB2"), t("learn.holdB3")]}
        />

        <Card
          icon={<ArrowDown size={22} className="text-primary" />}
          title={t("learn.pushTitle")}
          body={t("learn.pushBody")}
          bullets={[t("learn.pushB1"), t("learn.pushB2"), t("learn.pushB3")]}
        />

        <Card
          icon={<Sparkles size={22} className="text-primary" />}
          title={t("learn.tipsTitle")}
          bullets={[
            t("learn.tipsB1"),
            t("learn.tipsB2"),
            t("learn.tipsB3"),
            t("learn.tipsB4"),
            t("learn.tipsB5"),
          ]}
        />

        <Link
          to="/"
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-primary py-5 font-display text-lg font-bold uppercase tracking-widest text-primary-foreground [box-shadow:var(--shadow-primary)] transition-transform active:scale-[0.98]"
        >
          {t("learn.start")}
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
