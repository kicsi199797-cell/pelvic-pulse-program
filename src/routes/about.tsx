import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { Dumbbell, Heart, TrendingUp, ArrowLeft } from "lucide-react";
import { useI18n } from "../lib/i18n";

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
  const { t } = useI18n();
  return (
    <AppShell>
      <div className="pad-x safe-top flex flex-col gap-6 pb-28 pt-10">
        <header className="flex items-center gap-3">
          <Link to="/settings" className="rounded-full p-2 text-muted-foreground hover:bg-card/60 hover:text-foreground">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{t("about.title")}</h1>
          </div>
        </header>

        <p className="text-sm leading-relaxed text-muted-foreground">{t("about.intro")}</p>

        <div className="grid gap-4">
          <Card icon={<Dumbbell size={22} className="text-primary" />} title={t("about.guidedTitle")} body={t("about.guidedBody")} />
          <Card icon={<TrendingUp size={22} className="text-primary" />} title={t("about.progTitle")} body={t("about.progBody")} />
          <Card icon={<Heart size={22} className="text-primary" />} title={t("about.healthTitle")} body={t("about.healthBody")} />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 text-center text-sm text-muted-foreground">
          {t("about.disclaimer")}
        </div>
      </div>
    </AppShell>
  );
}

function Card({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
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
