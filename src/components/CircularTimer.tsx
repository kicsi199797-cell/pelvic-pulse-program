import { memo } from "react";

type Props = {
  progress: number; // 0..1
  secondsLeft: number;
  label: string;
  sublabel?: string;
  accent?: "primary" | "muted" | "success" | "warning";
  /** When false the ring stops animating (paused state) to avoid drift. */
  animate?: boolean;
};

const ACCENT_COLORS: Record<NonNullable<Props["accent"]>, string> = {
  primary: "var(--primary)",
  muted: "var(--muted-foreground)",
  success: "var(--success)",
  warning: "var(--warning)",
};

export const CircularTimer = memo(function CircularTimer({
  progress,
  secondsLeft,
  label,
  sublabel,
  accent = "primary",
  animate = true,
}: Props) {
  const size = 280;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, progress)));
  const color = ACCENT_COLORS[accent];

  return (
    <div
      className="relative flex aspect-square w-full items-center justify-center"
      style={{ maxWidth: size, maxHeight: "min(280px, 44vh)" }}
    >
      <div
        className="absolute inset-4 rounded-full blur-2xl opacity-40"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
        aria-hidden
      />
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        focusable="false"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--border)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: animate ? "stroke-dashoffset 1s linear" : "none",
            willChange: "stroke-dashoffset",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          {sublabel}
        </div>
        <div className="mt-2 font-display text-7xl font-bold tabular-nums text-foreground">
          {secondsLeft}
        </div>
        <div className="mt-1 text-sm font-medium uppercase tracking-widest" style={{ color }}>
          {label}
        </div>
      </div>
    </div>
  );
});
