import { test, expect, type Page, type Locator } from "@playwright/test";

/**
 * Settings screen layout contract for Android form factors.
 *
 * Guards against the Android-only regression where settings rows rendered
 * twice and overlapped each other. Runs against every viewport project
 * declared in playwright.config.ts.
 */

const SWITCH_ROWS = ["Daily Reminder", "Vibration", "Sound Effects"];

const ROW_LABELS = [
  "Language",
  "Daily Reminder",
  "Vibration",
  "Sound Effects",
  "Appearance",
  "Training Statistics",
  "About",
  "Privacy Policy",
  "Terms of Use",
  "Rate the App",
  "Contact Support",
];

type Box = { x: number; y: number; width: number; height: number };

async function gotoSettings(page: Page) {
  // Pin the language so label assertions are deterministic across CI locales.
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "stamina-trainer-settings-v1",
      JSON.stringify({
        language: "en",
        reminderEnabled: false,
        reminderTime: "20:00",
        vibration: true,
        soundEffects: true,
        appearance: "dark",
      }),
    );
  });
  await page.goto("/settings", { waitUntil: "domcontentloaded" });
  // The language <select> only exists after hydration finishes.
  await expect(page.locator("select")).toBeVisible();
}

/** Every card rendered inside the settings sections. */
function rowCards(page: Page): Locator {
  return page.locator("main section > div, main section > a, main section > button");
}

/** Bounding-box intersection test with a 1px tolerance for sub-pixel rounding. */
function overlaps(a: Box, b: Box) {
  const tol = 1;
  return (
    a.x < b.x + b.width - tol &&
    b.x < a.x + a.width - tol &&
    a.y < b.y + b.height - tol &&
    b.y < a.y + a.height - tol
  );
}

test.describe("Settings screen", () => {
  test.beforeEach(async ({ page }) => {
    await gotoSettings(page);
  });

  test("renders each settings row exactly once", async ({ page }) => {
    for (const label of ROW_LABELS) {
      await expect(
        page.getByText(label, { exact: true }),
        `"${label}" must render exactly once`,
      ).toHaveCount(1);
    }

    await expect(page.getByRole("switch")).toHaveCount(SWITCH_ROWS.length);
    for (const name of SWITCH_ROWS) {
      await expect(page.getByRole("switch", { name })).toHaveCount(1);
    }

    // A single language picker means a single render path (no duplicated list).
    await expect(page.locator("select")).toHaveCount(1);
  });

  test("has no nested scroll containers", async ({ page }) => {
    const scrollables = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("main *"));
      return els.filter((el) => {
        const style = getComputedStyle(el);
        return /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1;
      }).length;
    });
    expect(scrollables).toBe(0);
  });

  test("rows never overlap and keep their 56px minimum height", async ({ page }) => {
    const cards = rowCards(page);
    const collected: { label: string; box: Box }[] = [];

    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const box = await card.boundingBox();
      if (!box || box.height < 24) continue; // skip caption labels
      const label = (await card.innerText()).split("\n")[0]?.trim() || `row-${i}`;
      collected.push({ label, box });
    }

    expect(collected.length).toBeGreaterThanOrEqual(ROW_LABELS.length);

    for (const { label, box } of collected) {
      expect(box.height, `"${label}" must be at least 56px tall`).toBeGreaterThanOrEqual(55);
    }

    for (let i = 0; i < collected.length; i++) {
      for (let j = i + 1; j < collected.length; j++) {
        expect(
          overlaps(collected[i]!.box, collected[j]!.box),
          `"${collected[i]!.label}" overlaps "${collected[j]!.label}"`,
        ).toBe(false);
      }
    }
  });

  test("switch controls are vertically centred in their row", async ({ page }) => {
    for (const name of SWITCH_ROWS) {
      const toggle = page.getByRole("switch", { name });
      const row = toggle.locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]");
      const toggleBox = await toggle.boundingBox();
      const rowBox = await row.boundingBox();
      expect(toggleBox && rowBox, `${name} row not measurable`).toBeTruthy();
      const toggleCentre = toggleBox!.y + toggleBox!.height / 2;
      const rowCentre = rowBox!.y + rowBox!.height / 2;
      expect(Math.abs(toggleCentre - rowCentre), `${name} switch is off-centre`).toBeLessThanOrEqual(2);
    }
  });

  test("content fits the viewport with no horizontal overflow", async ({ page }, testInfo) => {
    const width = page.viewportSize()!.width;

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow on ${testInfo.project.name}`).toBeLessThanOrEqual(1);

    const cards = rowCards(page);
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const box = await cards.nth(i).boundingBox();
      if (!box) continue;
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }
  });

  test("the last row is not hidden behind the bottom tab bar", async ({ page }) => {
    const last = page.getByText("Contact Support", { exact: true });
    await last.scrollIntoViewIfNeeded();
    const navBox = await page.getByRole("navigation").boundingBox();
    const lastBox = await last.boundingBox();
    expect(lastBox && navBox).toBeTruthy();
    expect(overlaps(lastBox!, navBox!)).toBe(false);
  });
});
