import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.staminatrainer",
  appName: "Stamina Trainer",
  webDir: "dist",
  bundledWebRuntime: false,
  ios: {
    contentInset: "always",
  },
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
