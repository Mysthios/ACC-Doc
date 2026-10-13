import { test, expect, type Page } from "@playwright/test";

async function openTopic(page: Page, id: string) {
  await page.goto("/#belajar/" + id);
  await expect(page.getByTestId("learning-lesson")).toBeVisible();
}
async function nav(page: Page, name: string) {
  await page
    .getByRole("navigation", { name: "Navigasi utama" })
    .getByRole("button", { name, exact: true })
    .click();
}
async function slider(page: Page, label: string, value: string) {
  await page
    .getByRole("slider", { name: label, exact: true })
    .evaluate((element, v) => {
      const e = element as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(e, v);
      e.dispatchEvent(new Event("input", { bubbles: true }));
      e.dispatchEvent(new Event("change", { bubbles: true }));
    }, value);
}
test("indeks, seluruh kategori, alias, hash, reload dan route tidak dikenal", async ({
  page,
}) => {
  await page.goto("/");
  await nav(page, "Belajar Setup");
  await expect(
    page.getByRole("heading", { name: "Belajar Setup", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".learn-module-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Mulai dari dasar →" }).click();
  await expect(page).toHaveURL(/#belajar\/grip$/);
  await expect(
    page.getByRole("button", { name: "← Sebelumnya" }),
  ).toBeDisabled();
  for (const [id, heading] of [
    ["compound", "Compound & permukaan lintasan"],
    ["tc", "TC: kapan intervensi dimulai"],
    ["fuel", "Fuel untuk lap, race & stint"],
    ["wheel-rate", "Wheel rate: kekakuan di roda"],
    ["slow-bump", "Slow bump: kompresi bertahap"],
    ["wing", "Rear wing: downforce vs drag"],
  ]) {
    await openTopic(page, id);
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
  await page.getByLabel("Cari istilah atau parameter").fill("sudut roda");
  await page
    .locator(".learn-search-results")
    .getByRole("button", { name: /^Camber:/ })
    .click();
  await expect(page).toHaveURL(/#belajar\/camber$/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Camber: kemiringan roda", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Berikutnya →" }).click();
  await expect(page).toHaveURL(/#belajar\/toe$/);
  await page.goBack();
  await expect(page).toHaveURL(/#belajar\/camber$/);
  await page.getByLabel("Cari istilah atau parameter").fill("zzTidakAda");
  await expect(page.locator(".learn-search-results")).toContainText("0 topik");
  await page.goto("/#belajar/tidak-ada");
  await expect(
    page.getByRole("button", { name: "Mulai dari dasar →" }),
  ).toBeVisible();
});
test("tekanan empat roda, profil, target invalid, kelayakan dan reset", async ({
  page,
}) => {
  await openTopic(page, "tekanan");
  await expect(page.getByTestId("learn-pressure-FL")).toContainText("23,3 psi");
  await expect(page.getByTestId("learn-pressure-FR")).toContainText("23,8 psi");
  await page.getByLabel("Tekanan contoh sudah stabil").uncheck();
  await expect(page.getByTestId("learn-pressure-FL")).toContainText(
    "Belum ada koreksi",
  );
  await page.getByLabel("Tekanan contoh sudah stabil").check();
  await page
    .getByLabel("Contoh mengalami insiden yang memengaruhi ban")
    .check();
  await expect(page.getByTestId("learn-pressure-FL")).toContainText(
    "bebas insiden",
  );
  await page.getByRole("button", { name: "Reset contoh" }).click();
  await page
    .getByLabel("Target contoh", { exact: true })
    .selectOption("manual");
  await page.getByLabel("Contoh target FL (psi)").fill("60");
  await expect(page.getByTestId("learn-pressure-FL")).toContainText("20–40");
  await page.getByLabel("Contoh target FL (psi)").fill("27");
  await page.getByLabel("Contoh cold FL (psi)").fill("23,8");
  await expect(page.getByTestId("learn-pressure-FL")).toContainText("23,3");
  await page.getByLabel("Kelas contoh").selectOption("GT2");
  await page.getByLabel("Target contoh", { exact: true }).selectOption("range");
  await expect(page.getByTestId("learn-pressure-FL")).toContainText(
    "Cakupan profil belum memadai",
  );
  await page.getByRole("button", { name: "Reset contoh" }).click();
  await page
    .getByLabel("Kondisi berikutnya sebanding", { exact: true })
    .uncheck();
  await expect(page.getByTestId("learn-pressure-FL")).toContainText(
    "kondisi sesi berikutnya",
  );
});
test("alignment dan elektronika menjelaskan perubahan tanpa pemetaan klik game", async ({
  page,
}) => {
  await openTopic(page, "camber");
  await expect(page.locator(".learn-wheel-positions")).toContainText(
    "FL · depan kiri",
  );
  await expect(page.locator(".learn-wheel-positions")).toContainText(
    "RR · belakang kanan",
  );
  await slider(page, "Sudut camber contoh", "-4");
  await expect(page.locator(".learning-lab")).toContainText(
    "Atas roda ke dalam",
  );
  await expect(page.locator(".learning-lab svg rect").nth(1)).toHaveAttribute(
    "transform",
    "rotate(12 88 143)",
  );
  await page.getByLabel("Geometri contoh").selectOption("toe");
  await expect(page.locator(".learning-lab")).toContainText("Toe-out");
  await page.getByLabel("Geometri contoh").selectOption("caster");
  await expect(page.locator(".learning-lab svg")).toHaveAccessibleName(
    /Caster dilihat dari samping/,
  );
  await openTopic(page, "toe");
  await expect(page.locator(".learn-scenario svg")).toHaveAccessibleName(
    /Toe dilihat dari atas/,
  );
  await openTopic(page, "caster");
  await expect(page.locator(".learn-scenario svg")).toHaveAccessibleName(
    /Caster dilihat dari samping/,
  );
  await openTopic(page, "tc");
  await expect(page.getByTestId("learn-electronics-result")).toContainText(
    "TC berintervensi",
  );
  await slider(page, "Slip roda ilustratif", "5");
  await expect(page.getByTestId("learn-electronics-result")).toContainText(
    "TC tidak berintervensi",
  );
  await page.getByLabel("Sistem contoh").selectOption("ABS");
  await expect(page.getByTestId("learn-electronics-result")).toContainText(
    "ABS berintervensi",
  );
  await page.getByLabel("Bantuan ilustratif aktif").uncheck();
  await expect(page.getByTestId("learn-electronics-result")).toContainText(
    "ABS tidak berintervensi",
  );
  await openTopic(page, "abs");
  await expect(page.getByLabel("Sistem contoh")).toHaveValue("ABS");
});
test("fuel, per, damper dan aero memberi angka sesuai satuan dan reset", async ({
  page,
}) => {
  await openTopic(page, "fuel");
  await page.getByLabel("Konsumsi contoh (L/lap)").fill("2,8");
  await expect(page.getByTestId("learn-fuel-result")).toContainText(
    "54,2 L · disiapkan 55 L",
  );
  await page.getByLabel("Kapasitas tangki contoh (L)").fill("50");
  await expect(page.getByTestId("learn-fuel-result")).toContainText(
    "melebihi kapasitas",
  );
  await page.getByLabel("Konsumsi contoh (L/lap)").fill("");
  await expect(page.getByTestId("learn-fuel-result")).toContainText(
    "lebih dari 0",
  );
  await page.getByRole("button", { name: "Reset contoh" }).click();
  await expect(page.getByTestId("learn-fuel-result")).toContainText("55 L");
  await openTopic(page, "wheel-rate");
  await expect(page.getByTestId("learn-mechanical-result")).toContainText(
    "1.000 N",
  );
  await slider(page, "Engagement bumpstop contoh", "8");
  await expect(page.getByTestId("learn-mechanical-result")).toContainText(
    "total model: 1.400 N",
  );
  await openTopic(page, "slow-bump");
  await expect(page.getByTestId("learn-damper-result")).toContainText("400 N");
  await page.getByLabel("Arah gerak contoh").selectOption("rebound");
  await expect(page.getByTestId("learn-damper-result")).toContainText(
    "pemanjangan",
  );
  await slider(page, "Kecepatan gerak damper contoh", "0.2");
  await expect(page.getByTestId("learn-damper-result")).toContainText("800 N");
  await openTopic(page, "wing");
  await slider(page, "Kecepatan udara relatif contoh", "200");
  await expect(page.getByTestId("learn-aero-result")).toContainText(
    "4.000 N · 4× acuan",
  );
  await expect(page.getByTestId("learn-rake-result")).toContainText("15 mm");
  await page.getByLabel("Tinggi depan contoh (mm)").fill("");
  await expect(page.getByTestId("learn-rake-result")).toContainText(
    "Isi tinggi",
  );
  await page.getByRole("button", { name: "Reset contoh" }).click();
  await expect(page.getByTestId("learn-aero-result")).toContainText("1.000 N");
});
test("bantuan mempertahankan draft, sumber dan satu dialog; Escape mengembalikan fokus", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /setup bawaan\/milik sendiri/i })
    .click();
  await page.getByTestId("practice").locator("summary").first().click();
  await page.getByLabel("Fuel aktual dipakai (L)").fill("41");
  await page
    .getByRole("button", { name: "Pelajari fuel ↗", exact: true })
    .click();
  const help = page.getByRole("dialog", { name: "Bantuan setup" });
  await expect(help).toBeVisible();
  await help.getByLabel("Konsumsi contoh (L/lap)").fill("9");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Pelajari fuel ↗", exact: true }),
  ).toBeFocused();
  await expect(page.getByLabel("Fuel aktual dipakai (L)")).toHaveValue("41");
  await nav(page, "Belajar Setup");
  await page.getByLabel("Cari istilah atau parameter").fill("tekanan");
  await page
    .locator(".learn-search-results")
    .getByRole("button", { name: /^Cold, hot/ })
    .click();
  await page.getByLabel("Contoh cold FL (psi)").fill("25");
  await nav(page, "Cari Setup");
  await page.getByTestId("practice").locator("summary").first().click();
  await expect(page.getByLabel("Fuel aktual dipakai (L)")).toHaveValue("41");
  await nav(page, "Data & Panduan");
  await page
    .getByRole("button", { name: "Lihat detail", exact: true })
    .first()
    .click();
  const source = page.getByRole("dialog", { name: "Detail sumber setup" });
  await expect(source.getByRole("button", { name: /^Pelajari / })).toHaveCount(
    68,
  );
  const sourceId = await source.locator(".source-links code").textContent();
  await source
    .getByRole("button", { name: "Pelajari Camber FL", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Camber: kemiringan roda", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "← Kembali ke detail sumber" })
    .click();
  await expect(
    source.getByRole("button", { name: "Pelajari Camber FL", exact: true }),
  ).toBeFocused();
  await expect(source.locator(".source-links code")).toHaveText(sourceId!);
  await page.keyboard.press("Escape");
  await nav(page, "Cari Setup");
  await page.getByTestId("practice").locator("summary").first().click();
  await expect(page.getByLabel("Fuel aktual dipakai (L)")).toHaveValue("41");
  await nav(page, "Data & Panduan");
  await page.getByText("Kamus parameter (68)", { exact: true }).click();
  await page
    .getByRole("button", { name: "Pelajari Brake bias front", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Brake bias: depan vs belakang",
      exact: true,
    }),
  ).toBeVisible();
});
test("offline, katalog gagal, keyboard, reduced motion dan lebar 360 px", async ({
  page,
}) => {
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
  await page.setViewportSize({ width: 360, height: 780 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openTopic(page, "wing");
  await expect(
    page.getByRole("heading", { name: "Belajar Setup", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".learn-bar").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await page.getByLabel("Kategori belajar").selectOption("tyres");
  await expect(page.locator(".learn-mobile-topics")).toHaveAttribute(
    "open",
    "",
  );
  await page
    .locator(".learn-mobile-topics")
    .getByRole("button", { name: /^Camber:/ })
    .click();
  await expect(page).toHaveURL(/#belajar\/camber$/);
  const input = page.getByRole("slider", {
    name: "Sudut camber contoh",
    exact: true,
  });
  await input.focus();
  await page.keyboard.press("ArrowRight");
  await expect(input).toBeFocused();
  for (const id of [
    "camber",
    "tekanan",
    "tc",
    "fuel",
    "wheel-rate",
    "slow-bump",
    "wing",
  ]) {
    await openTopic(page, id);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      id,
    ).toBe(true);
    for (const figure of await page.getByRole("img").all())
      await expect(figure).toHaveAccessibleName(/.+/);
  }
  await page.goto("/#belajar");
  await expect(
    page.getByRole("link", { name: /Buka playlist Aris/ }),
  ).toHaveAttribute("target", "_blank");
  await expect(
    page.getByRole("link", { name: /Buka playlist Aris/ }),
  ).toContainText("perlu internet");
  expect(external).toEqual([]);
  await page.getByRole("button", { name: "Kembali ke garasi" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page
    .getByRole("button", { name: "Belajar Setup", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Mulai dari dasar →" }),
  ).toBeVisible();
});
