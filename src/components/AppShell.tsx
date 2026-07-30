import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BarChart3, BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "../lib/i18n";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80" style={{ background: "var(--halo)" }} />
      <main className="relative flex-1 pb-24">{children}</main>
      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border/60 bg-background/85 backdrop-blur-xl">
          <div className="grid grid-cols-3 py-3">
            <NavItem to="/" active={pathname === "/"} icon={<Home size={20} />} label={t("nav.train")} />
            <NavItem to="/progress" active={pathname === "/progress"} icon={<BarChart3 size={20} />} label={t("nav.progress")} />
            <NavItem to="/learn" active={pathname === "/learn"} icon={<BookOpen size={20} />} label={t("nav.learn")} />
          </div>
        </nav>
      )}
    </div>
  );
}

function NavItem({ to, active, icon, label }: { to: string; active: boolean; icon: ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
