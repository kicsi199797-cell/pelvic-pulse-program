import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { ArrowLeft } from "lucide-react";

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
  return (
    <AppShell>
      <div className="flex flex-col gap-6 px-6 pb-28 pt-12">
        <header className="flex items-center gap-3">
          <Link to="/settings" className="rounded-full p-2 text-muted-foreground hover:bg-card/60 hover:text-foreground">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
          </div>
        </header>

        <div className="flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Stamina Trainer</strong> respects your privacy. This policy explains what data we collect, how we use it, and your choices.
          </p>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">Data We Collect</h2>
            <p>
              All training progress, preferences, and settings are stored locally on your device. We do not collect or store personal information on our servers. If you contact support via email, we will only receive the information you choose to include.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">How We Use Your Data</h2>
            <p>
              Local data is used solely to power your workout experience, track progress, and remember your settings. We do not sell, share, or analyze your data for advertising.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">Third-Party Services</h2>
            <p>
              The app does not currently use analytics, advertising, or third-party tracking services. If this changes in the future, this policy will be updated and you will be notified.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">Your Choices</h2>
            <p>
              You can clear your local progress at any time from the Progress screen. You may also disable app notifications and adjust other preferences in Settings.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">Changes</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted here with a revised effective date.
            </p>
          </section>

          <p>
            If you have questions about this policy, please contact us at{" "}
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
