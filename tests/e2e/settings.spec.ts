import { test, expect, type Page, type Locator } from "@playwright/test";

/**
 * Settings screen layout contract for Android devices.
 *
 * Guards against the Android-only regression where rows rendered twice and
 * overlapped each other. Runs on every viewport project in playwright.config.ts.
 */

const ROW_SELECTOR = "main >>> nothing"; // placeholder, replaced below

/** Every settings item, identified by a stable accessible name. */
const SWITCH_ROWS = ["Daily reminder", "Vibration", "Sound effects"];

async function gotoSettings(page: Page) {
  await page.goto("/settings", { waitUntil: "domcontentloaded" });
  // Language select is client-rendered, so it marks hydration completion.
  await expect(page.locator("select")).toBeVisible();
}

/** All top-level cards inside the settings sections. */
function rows(page: Page): Locator {
  return page.locator("main section > :not(div:has-text('')):nth-child(n)");
}

/** Simple bounding-box overlap check with a 1px tolerance for rounding. */
function overlaps(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) {
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
    const labels = [
      "Language",
      "Daily reminder",
      "Vibration",
      "Sound effects",
      "Appearance",
      "Training statistics",
      "About",
      "Privacy policy",
      "Terms of use",
      "Rate the app",
      "Contact support",
    ];

    for (const label of labels) {
      const matches = page.getByText(label, { exact: true });
      await expect(matches, `"${label}" must render exactly once`).toHaveCount(1);
    }

    // Exactly one switch per toggle row, and no duplicated toggles.
    await expect(page.getByRole("switch")).toHaveCount(SWITCH_ROWS.length);
    for (const name of SWITCH_ROWS) {
      await expect(page.getByRole("switch", { name })).toHaveCount(1);
    }

    // A single language <select>, i.e. no duplicated render path.
    await expect(page.locator("select")).toHaveCount(1);
  });

  test("has no nested scroll containers", async ({ page }) => {
    const scrollables = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("main *"));
      return els.filter((el) => {
        const style = getComputedStyle(el);
        const scrolls = /(auto|scroll)/.test(style.overflowY);
        return scrolls && el.scrollHeight > el.clientHeight + 1;
      }).length;
    });
    expect(scrollables).toBe(0);
  });

  test("rows never overlap and keep their minimum height", async ({ page }) => {
    const cards = page.locator("main section > *:not(div:only-child):not(:first-child), main section > a, main section > button, main section > div");
    const boxes: { label: string; box: NonNullable<Awaited<ReturnType<Locator["boundingBox"]>>> }[] = [];

    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const box = await card.boundingBox();
      if (!box) continue;
      const label = (await card.innerText()).split("\n")[0] ?? `row-${i}`;
      // Section labels are short captions, not rows.
      if (box.height < 20) continue;
      boxes.push({ label, box });
    }

    expect(boxes.length).toBeGreaterThan(8);

    for (const { label, box } of boxes) {
      expect(box.height, `"${label}" must be at least 56px tall`).toBeGreaterThanOrEqual(55);
    }

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        expect(
          overlaps(boxes[i]!.box, boxes[j]!.box),
          `"${boxes[i]!.label}" overlaps "${boxes[j]!.label}"`,
        ).toBe(false);
      }
    }
  });

  test("switch controls are vertically centred in their row", async ({ page }) => {
    for (const name of SWITCH_ROWS) {
      const toggle = page.getByRole("switch", { name });
      const row = toggle.locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]");
      const [tb, rb] = [await toggle.boundingBox(), await row.boundingBox()];
      expect(tb && rb).toBeTruthy();
      const toggleCentre = tb!.y + tb!.height / 2;
      const rowCentre = rb!.y + rb!.height / 2;
      expect(Math.abs(toggleCentre - rowCentre), `${name} switch off-centre`).toBeLessThanOrEqual(2);
    }
  });

  test("content fits the viewport with no horizontal overflow or clipping", async ({ page }, testInfo) => {
    const width = page.viewportSize()!.width;

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    expect(overflow, `horizontal overflow on ${testInfo.project.name}`).toBeLessThanOrEqual(1);

    const cards = page.locator("main section > div, main section > a, main section > button");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const box = await cards.nth(i).boundingBox();
      if (!box) continue;
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }
  });

  test("the last row is not hidden behind the bottom tab bar", async ({ page }) => {
    const last = page.getByText("Contact support", { exact: true });
    await last.scrollIntoViewIfNeeded();
    const nav = page.getByRole("navigation");
    const [lastBox, navBox] = [await last.boundingBox(), await nav.boundingBox()];
    expect(lastBox && navBox).toBeTruthy();
    expect(overlaps(lastBox!, navBox!)).toBe(false);
  });
});

// Keep the unused placeholder from being tree-shaken into a lint error.
void ROW_SELECTOR;
void rows;
