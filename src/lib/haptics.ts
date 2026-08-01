import { getSettings } from "./useSettings";

type Impact = "light" | "medium" | "heavy";

type HapticsModule = {
  Haptics: {
    impact(opts: { style: unknown }): Promise<void>;
    notification(opts: { type: unknown }): Promise<void>;
    selectionStart?(): Promise<void>;
    selectionChanged?(): Promise<void>;
    selectionEnd?(): Promise<void>;
  };
  ImpactStyle: Record<string, unknown>;
  NotificationType: Record<string, unknown>;
};

let mod: HapticsModule | null = null;
let loading: Promise<HapticsModule | null> | null = null;

function load(): Promise<HapticsModule | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (mod) return Promise.resolve(mod);
  if (!loading) {
    loading = import("@capacitor/haptics")
      .then((m) => {
        mod = m as unknown as HapticsModule;
        return mod;
      })
      .catch(() => null);
  }
  return loading;
}

function enabled() {
  if (typeof window === "undefined") return false;
  try {
    return getSettings().vibration;
  } catch {
    return false;
  }
}

/** Subtle native impact feedback (UIImpactFeedbackGenerator on iOS, HapticFeedback on Android). */
export function hapticImpact(style: Impact = "light") {
  if (!enabled()) return;
  void load().then((m) => {
    if (!m) return;
    const key = style === "heavy" ? "Heavy" : style === "medium" ? "Medium" : "Light";
    m.Haptics.impact({ style: m.ImpactStyle[key] }).catch(() => {});
  });
}

/** Success / completion feedback — used sparingly for level and workout completion. */
export function hapticSuccess() {
  if (!enabled()) return;
  void load().then((m) => {
    if (!m) return;
    m.Haptics.notification({ type: m.NotificationType["Success"] }).catch(() => {});
  });
}

/** Selection tick — toggles, segmented controls, language picker. */
export function hapticSelection() {
  if (!enabled()) return;
  void load().then((m) => {
    if (!m) return;
    if (m.Haptics.selectionChanged) {
      m.Haptics.selectionChanged().catch(() => {});
    } else {
      m.Haptics.impact({ style: m.ImpactStyle["Light"] }).catch(() => {});
    }
  });
}
