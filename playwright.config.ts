import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env["E2E_BASE_URL"] ?? "http://localhost:8080";

/** Android form factors we support, from the smallest common phone to a large one. */
export const ANDROID_VIEWPORTS = [
  { name: "android-320", width: 320, height: 640 },
  { name: "android-360", width: 360, height: 800 },
  { name: "pixel-393", width: 393, height: 851 },
  { name: "android-412", width: 412, height: 915 },
] as const;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: process.env["CI"] ? "line" : "list",
  use: {
    baseURL: BASE_URL,
    ...devices["Pixel 5"],
  },
  projects: ANDROID_VIEWPORTS.map((v) => ({
    name: v.name,
    use: {
      ...devices["Pixel 5"],
      viewport: { width: v.width, height: v.height },
      isMobile: true,
      hasTouch: true,
    },
  })),
});
