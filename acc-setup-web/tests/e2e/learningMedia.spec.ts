import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { learningTopics } from "../../src/lib/learning";
import { screenshotAssetById } from "../../src/lib/learningMedia";

test("semua 38 topik, screenshot lokal, setiap penanda dan detail saat internet/katalog gagal", async ({
  page,
}, testInfo) => {
  test.setTimeout(120000);
  const external: string[] = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) {
      external.push(url.href);
      return route.abort();
    }
    if (url.pathname === "/data/catalog.json")
      return route.fulfill({ status: 503, body: "Unavailable" });
    return route.continue();
  });
  if (testInfo.project.name === "mobile")
    await page.setViewportSize({ width: 360, height: 780 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  mkdirSync("tests/screenshots/acc-media/" + testInfo.project.name, {
    recursive: true,
  });
  for (const topic of learningTopics) {
    await page.goto("/#belajar/" + topic.id);
    const panel = page.getByTestId("learning-screenshot");
    await expect(
      panel.getByRole("heading", { name: "Kenali di ACC", exact: true }),
    ).toBeVisible();
    for (
      let referenceIndex = 0;
      referenceIndex < topic.screenshots.length;
      referenceIndex++
    ) {
      const reference = topic.screenshots[referenceIndex];
      const asset = screenshotAssetById(reference.assetId)!;
      if (topic.screenshots.length > 1)
        await panel
          .getByRole("button", { name: asset.title, exact: true })
          .click();
      const image = panel.locator(".learn-shot-image > img");
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((img) => {
            const element = img as HTMLImageElement;
            return [
              element.complete,
              element.naturalWidth,
              element.naturalHeight,
            ];
          }),
        )
        .toEqual([true, asset.width, asset.height]);
      await expect(image).toHaveAccessibleName(asset.alt);
      await expect(panel.locator(".learn-shot-marker")).toHaveCount(
        reference.markers.length,
      );
      for (let i = 0; i < reference.markers.length; i++) {
        const marker = reference.markers[i];
        const button = panel
          .locator(".learn-shot-list")
          .getByRole("button", { name: marker.label, exact: true });
        await button.click();
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await expect(panel.getByTestId("screenshot-detail")).toContainText(
          marker.explanation,
        );
        await expect(panel.locator(".learn-shot-crop")).toHaveAccessibleName(
          "Potongan detail: " + marker.label,
        );
        await expect(panel.locator(".learn-shot-crop")).toHaveAttribute(
          "viewBox",
          `${marker.detail.x} ${marker.detail.y} ${marker.detail.width} ${marker.detail.height}`,
        );
      }
      await panel.locator(".learn-shot-list button").first().click();
      await panel.screenshot({
        path: `tests/screenshots/acc-media/${testInfo.project.name}/${topic.id}-${reference.assetId}.png`,
      });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      topic.id,
    ).toBe(true);
  }
  expect(external).toEqual([]);
});

test("Camber: penanda keyboard, detail, gambar asli inline dan zoom tanpa overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/#belajar/camber");
  const panel = page.getByTestId("learning-screenshot");
  const marker = panel.getByRole("button", {
    name: "Penanda 4: Camber RR · belakang kanan",
    exact: true,
  });
  await marker.focus();
  await page.keyboard.press("Enter");
  await expect(marker).toBeFocused();
  await expect(panel.getByTestId("screenshot-detail")).toContainText(
    "4. Camber RR",
  );
  await panel.getByLabel("Tampilkan penanda").uncheck();
  await expect(panel.locator(".learn-shot-marker")).toHaveCount(0);
  await panel
    .locator(".learn-shot-list")
    .getByRole("button", { name: "Camber FR · depan kanan", exact: true })
    .click();
  await expect(panel.getByTestId("screenshot-detail")).toContainText(
    "2. Camber FR",
  );
  await panel.getByLabel("Tampilkan penanda").check();
  await panel
    .getByRole("button", { name: "Lihat gambar asli", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await panel.getByLabel("Zoom gambar asli").selectOption("300");
  const scroll = panel.getByRole("region", {
    name: "Area gulir gambar asli",
    exact: true,
  });
  await expect
    .poll(() => scroll.evaluate((e) => e.scrollWidth > e.clientWidth))
    .toBe(true);
  await scroll.focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => scroll.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await panel
    .getByRole("button", { name: "Tutup gambar asli", exact: true })
    .click();
  await expect(scroll).toHaveCount(0);
  await page.reload();
  await expect(page).toHaveURL(/#belajar\/camber$/);
  await expect(panel.getByTestId("screenshot-detail")).toContainText(
    "1. Camber FL",
  );
  await panel.locator("summary").click();
  await expect(panel).toContainText("Tanggal artikel bukan versi capture");
});

test("bantuan memakai panel sama, memilih roda asal dan mempertahankan draft/sumber/hash/fokus", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /setup bawaan\/milik sendiri/i })
    .click();
  const practice = page.getByTestId("practice");
  await practice.locator("summary").first().click();
  await page.getByLabel("Fuel aktual dipakai (L)").fill("41");
  const values = () =>
    practice.locator("input, select, textarea").evaluateAll((elements) =>
      elements.map((el) => {
        const input = el as HTMLInputElement;
        return [input.id, input.value, input.checked];
      }),
    );
  const draft = await values();
  await page
    .getByRole("button", { name: "Pelajari fuel ↗", exact: true })
    .click();
  const help = page.getByRole("dialog", { name: "Bantuan setup" });
  await help
    .getByRole("button", {
      name: "Penanda 2: Fuel to add · tambahan saat pit",
      exact: true,
    })
    .click();
  await help
    .getByRole("button", { name: "Lihat gambar asli", exact: true })
    .click();
  await help.getByLabel("Zoom gambar asli").selectOption("200");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Pelajari fuel ↗", exact: true }),
  ).toBeFocused();
  expect(await values()).toEqual(draft);
  await page
    .getByRole("navigation", { name: "Navigasi utama" })
    .getByRole("button", { name: "Data & Panduan", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Lihat detail", exact: true })
    .first()
    .click();
  const source = page.getByRole("dialog", { name: "Detail sumber setup" });
  const sourceId = await source.locator(".source-links code").textContent();
  const url = page.url();
  await source
    .getByRole("button", { name: "Pelajari Camber RR", exact: true })
    .click();
  await expect(help.getByTestId("screenshot-detail")).toContainText(
    "4. Camber RR",
  );
  await help
    .getByRole("button", { name: "Lihat gambar asli", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await page
    .getByRole("button", { name: "← Kembali ke detail sumber", exact: true })
    .click();
  await expect(source.locator(".source-links code")).toHaveText(sourceId!);
  await expect(
    source.getByRole("button", { name: "Pelajari Camber RR", exact: true }),
  ).toBeFocused();
  expect(page.url()).toBe(url);
});

test("gagal gambar mempertahankan penjelasan dan eksperimen", async ({
  page,
}) => {
  await page.route("**/media/acc/tyres.webp", (route) =>
    route.fulfill({ status: 404, body: "Missing" }),
  );
  await page.goto("/#belajar/camber");
  const panel = page.getByTestId("learning-screenshot");
  await expect(panel.getByRole("status")).toContainText(
    "Screenshot gagal ditampilkan",
  );
  await panel
    .locator(".learn-shot-list")
    .getByRole("button", { name: "Camber RR · belakang kanan", exact: true })
    .click();
  await expect(panel.getByTestId("screenshot-detail")).toContainText(
    "nilai negatif",
  );
  await expect(
    page.getByRole("slider", { name: "Sudut camber contoh", exact: true }),
  ).toBeVisible();
  await panel
    .getByRole("button", { name: "Lihat gambar asli", exact: true })
    .click();
  await expect(panel).toContainText("Gambar asli tidak tersedia");
});
