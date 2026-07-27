import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Stamina Trainer" },
      { name: "description", content: "Stamina Trainer privacy policy and data practices." },
      { property: "og:title", content: "Privacy Policy — Stamina Trainer" },
      { property: "og:description", content: "Stamina Trainer privacy policy and data practices." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useI18n();
  return (
    <AppShell>
      <div className="flex flex-col gap-6 px-6 pb-28 pt-12">
        <header className="flex items-center gap-3">
          <Link to="/settings" className="rounded-full p-2 text-muted-foreground hover:bg-card/60 hover:text-foreground">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">{t("privacy.title")}</h1>
          </div>
        </header>

        <div className="flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
          <p>{t("privacy.intro")}</p>

          <Section title={t("privacy.dataTitle")} body={t("privacy.dataBody")} />
          <Section title={t("privacy.useTitle")} body={t("privacy.useBody")} />
          <Section title={t("privacy.thirdTitle")} body={t("privacy.thirdBody")} />
          <Section title={t("privacy.choicesTitle")} body={t("privacy.choicesBody")} />
          <Section title={t("privacy.changesTitle")} body={t("privacy.changesBody")} />

          <p>
            {t("privacy.contactLine")}{" "}
            <a href="mailto:support@staminatrainer.app" className="text-primary underline">
              support@staminatrainer.app
            </a>
            .
          </p>
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
