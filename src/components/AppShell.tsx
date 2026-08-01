import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BarChart3, BookOpen } from "lucide-react";
import { memo, type ReactNode } from "react";
import { useI18n } from "../lib/i18n";
import { hapticSelection } from "../lib/haptics";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();
  return (
    <div className="safe-x relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={{ background: "var(--halo)", willChange: "opacity" }}
        aria-hidden
      />
      <main className={`relative flex-1 ${hideNav ? "" : "pb-28"}`}>{children}</main>
      {!hideNav && (
        <nav
          className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border/60 bg-background/85 backdrop-blur-xl"
          style={{ paddingBottom: "var(--safe-bottom)" }}
          aria-label={t("nav.train")}
        >
          <div className="grid grid-cols-3 py-1.5">
            <NavItem to="/" active={pathname === "/"} icon={<Home size={20} />} label={t("nav.train")} />
            <NavItem to="/progress" active={pathname === "/progress"} icon={<BarChart3 size={20} />} label={t("nav.progress")} />
            <NavItem to="/learn" active={pathname === "/learn"} icon={<BookOpen size={20} />} label={t("nav.learn")} />
          </div>
        </nav>
      )}
    </div>
  );
}

const NavItem = memo(function NavItem({
  to,
  active,
  icon,
  label,
}: {
  to: string;
  active: boolean;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      onClick={() => hapticSelection()}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-12 flex-col items-center justify-center gap-1 py-1.5 text-xs font-medium transition-colors duration-150 active:opacity-70 ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </Link>
  );
});
