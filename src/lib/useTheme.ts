import { useEffect } from "react";
import type { Appearance } from "./useSettings";

function apply(appearance: Appearance) {
  if (typeof document === "undefined") return;
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = appearance === "dark" || (appearance === "system" && prefersDark);
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0b1220" : "#f7f8fa");
}

/** Applies the selected appearance mode to <html>, following the system theme when set to "system". */
export function useTheme(appearance: Appearance) {
  useEffect(() => {
    apply(appearance);
    if (appearance !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [appearance]);
}
