import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { ArrowLeft } from "lucide-react";

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
  return (
    <AppShell>
      <div className="flex flex-col gap-6 px-6 pb-28 pt-12">
        <header className="flex items-center gap-3">
          <Link to="/settings" className="rounded-full p-2 text-muted-foreground hover:bg-card/60 hover:text-foreground">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Terms of Use</h1>
          </div>
        </header>

        <div className="flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            By using <strong className="text-foreground">Stamina Trainer</strong>, you agree to these terms. If you do not agree, please do not use the app.
          </p>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">Use of the App</h2>
            <p>
              Stamina Trainer provides a guided wellness and exercise routine for general fitness and education. The app is intended for adult users only. Keep your device and app access secure.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">Medical Disclaimer</h2>
            <p>
              Stamina Trainer is not a medical device and does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before beginning any exercise program, especially if you have a medical condition, injury, or pain. Stop immediately if you experience discomfort.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">Your Responsibility</h2>
            <p>
              You are responsible for how you use the app. Listen to your body, follow the instructions carefully, and do not push beyond your comfort level. Progression through levels is a suggestion, not a requirement.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">Changes to the App</h2>
            <p>
              We may update the app, its features, and these terms at any time. Continued use after changes means you accept the revised terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-base font-bold text-foreground">Contact</h2>
            <p>
              For questions about these terms, contact{" "}
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
