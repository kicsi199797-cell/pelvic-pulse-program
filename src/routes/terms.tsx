import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Stamina Trainer" },
      { name: "description", content: "Stamina Trainer terms of use and disclaimers." },
      { property: "og:title", content: "Terms of Use — Stamina Trainer" },
      { property: "og:description", content: "Stamina Trainer terms of use and disclaimers." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useI18n();
  return (
    <AppShell>
      <div className="safe-top flex flex-col gap-6 px-6 pb-28 pt-12">
        <header className="flex items-center gap-3">
          <Link to="/settings" className="rounded-full p-2 text-muted-foreground hover:bg-card/60 hover:text-foreground">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">{t("terms.title")}</h1>
          </div>
        </header>

        <div className="flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
          <p>{t("terms.intro")}</p>

          <Section title={t("terms.useTitle")} body={t("terms.useBody")} />
          <Section title={t("terms.medTitle")} body={t("terms.medBody")} />
          <Section title={t("terms.respTitle")} body={t("terms.respBody")} />
          <Section title={t("terms.changesTitle")} body={t("terms.changesBody")} />

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">{t("terms.contactTitle")}</h2>
            <p>
              {t("terms.contactLine")}{" "}
              <a href="mailto:support@staminatrainer.app" className="text-primary underline">
                support@staminatrainer.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="mb-2 font-display text-base font-bold text-foreground">{title}</h2>
      <p>{body}</p>
    </section>
  );
}
