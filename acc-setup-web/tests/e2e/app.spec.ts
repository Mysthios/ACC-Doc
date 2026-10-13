import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("public/data/catalog.json", "utf8"));
const nav = (page: Page, name: string) =>
  page
    .getByRole("navigation")
    .getByRole("button", { name: new RegExp("^" + name) })
    .click();
async function start(page: Page) {
  await page.goto("/");
  await expect(page.locator(".search-button")).toBeEnabled();
}
async function reference(page: Page) {
  await start(page);
  await page.locator(".search-button").click();
  await expect(page.getByTestId("empty-result")).toBeVisible();
  await expect(page.getByTestId("setup-detail")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Pakai sebagai acuan", exact: true })
    .first()
    .click();
  await page.locator(".source-details > summary").click();
  await expect(page.getByTestId("setup-detail")).toBeVisible();
}
async function openPractice(page: Page) {
  await page.getByTestId("practice").locator("summary").first().click();
}
async function fuelInputs(page: Page) {
  await page
    .getByRole("combobox", { name: "Mode hitung", exact: true })
    .selectOption("duration");
  await page.getByLabel("Durasi (menit)", { exact: true }).fill("30");
  await page.getByLabel("Rata-rata lap time").fill("1:45");
  await page.getByLabel("Konsumsi aktual (L/lap)").fill("2,8");
}

test("kelas, varian Evo, cuaca, sesi, karakter dan compound", async ({
  page,
}) => {
  await start(page);
  for (const className of ["GT4", "GT2", "CUP", "ST", "CHL", "TCX", "GT3"]) {
    await page
      .getByRole("combobox", { name: "Kelas mobil", exact: true })
      .selectOption(className);
    const carid = await page
      .getByRole("combobox", { name: "Mobil & varian", exact: true })
      .inputValue();
    expect(catalog.cars.find((c: { id: string }) => c.id === carid).class).toBe(
      className,
    );
  }
  await page
    .getByRole("combobox", { name: "Mobil & varian", exact: true })
    .selectOption("audi_r8_lms_evo");
  await expect(
    page.getByRole("combobox", { name: "Mobil & varian", exact: true }),
  ).toHaveValue("audi_r8_lms_evo");
  await page
    .getByRole("combobox", { name: "Mobil & varian", exact: true })
    .selectOption("audi_r8_lms_evo_ii");
  await expect(
    page.getByRole("combobox", { name: "Mobil & varian", exact: true }),
  ).toHaveValue("audi_r8_lms_evo_ii");
  await page
    .getByRole("combobox", { name: "Sirkuit", exact: true })
    .selectOption("spa");
  await page
    .getByRole("combobox", { name: "Kondisi", exact: true })
    .selectOption("Light wet");
  await expect(
    page.getByRole("combobox", { name: "Compound", exact: true }),
  ).toHaveValue("Wet");
  await expect(
    page.getByRole("combobox", { name: "Compound", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("combobox", { name: "Kondisi", exact: true })
    .selectOption("Heavy wet");
  await page
    .getByRole("combobox", { name: "Kondisi", exact: true })
    .selectOption("Damp");
  await expect(
    page.getByRole("combobox", { name: "Compound", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("combobox", { name: "Compound", exact: true })
    .selectOption("Dry slick");
  await page
    .getByRole("combobox", { name: "Kondisi", exact: true })
    .selectOption("Drying");
  await page
    .getByRole("combobox", { name: "Compound", exact: true })
    .selectOption("Wet");
  await page
    .getByRole("combobox", { name: "Kondisi", exact: true })
    .selectOption("Dry");
  await expect(
    page.getByRole("combobox", { name: "Compound", exact: true }),
  ).toHaveValue("Dry slick");
  for (const session of ["Practice", "Qualifying", "Endurance", "Sprint race"])
    await page
      .getByRole("combobox", { name: "Sesi", exact: true })
      .selectOption(session);
  for (const profile of ["Pace / hotlap", "Agresif", "Stabil"])
    await page
      .getByRole("combobox", { name: "Karakter", exact: true })
      .selectOption(profile);
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Mobil & varian", exact: true }),
  ).toHaveValue("audi_r8_lms_evo_ii");
  await expect(
    page.getByRole("combobox", { name: "Sirkuit", exact: true }),
  ).toHaveValue("spa");
});

test("alternatif eksplisit, nol/status sumber, hasil lama dan draft dibersihkan", async ({
  page,
}) => {
  await reference(page);
  await expect(page.getByTestId("setup-detail")).toContainText(
    "Alternatif · acuan dipilih manual",
  );
  await expect(page.getByTestId("setup-detail")).toContainText(
    "Sesi: sumber Race umum; pilihan Sprint race",
  );
  await expect(page.getByTestId("setting-nPitStops").locator("td")).toHaveText(
    "0",
  );
  await expect(page.getByTestId("setting-tyreSet")).toContainText(
    "Konversi belum terverifikasi",
  );
  await expect(page.getByTestId("setting-aeroBalance")).toContainText(
    "Data sumber kosong",
  );
  await expect(page.getByTestId("setting-splitter")).toContainText(
    "Tidak berlaku",
  );
  await openPractice(page);
  await page.getByLabel("Catatan latihan").fill("draft sementara");
  await page
    .getByRole("button", { name: "Pakai sebagai acuan", exact: true })
    .last()
    .click();
  await expect(page.getByLabel("Catatan latihan")).toHaveValue("");
  await page.getByLabel("Catatan latihan").fill("draft kedua");
  await page
    .getByRole("combobox", { name: "Kondisi", exact: true })
    .selectOption("Heavy wet");
  await expect(page.getByTestId("setup-detail")).toHaveCount(0);
  await expect(page.getByTestId("practice")).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Kondisi", exact: true })
    .selectOption("Dry");
  await page.locator(".search-button").click();
  await page
    .getByRole("button", { name: "Pakai sebagai acuan" })
    .first()
    .click();
  await openPractice(page);
  await expect(page.getByLabel("Catatan latihan")).toHaveValue("");
});

test("kecocokan persis dan aggressive tidak beralih diam-diam ke stable", async ({
  page,
}) => {
  await start(page);
  await page
    .getByRole("combobox", { name: "Mobil & varian", exact: true })
    .selectOption("audi_r8_lms_evo_ii");
  await page
    .getByRole("combobox", { name: "Sesi", exact: true })
    .selectOption("Qualifying");
  await expect(page.locator(".search-button")).toBeEnabled();
  await page.locator(".search-button").click();
  await expect(page.getByTestId("setup-detail")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Pakai sebagai acuan", exact: true })
    .first()
    .click();
  await page.locator(".source-details > summary").click();
  await expect(page.getByTestId("setup-detail")).toContainText(
    "Metadata cocok",
  );
  await page
    .getByRole("combobox", { name: "Karakter", exact: true })
    .selectOption("Agresif");
  await page.locator(".search-button").click();
  await expect(page.getByTestId("setup-detail")).toHaveCount(0);
  await expect(page.locator(".alternatives")).toContainText(
    "Karakter: sumber Stabil; pilihan Agresif",
  );
  await expect(
    page.getByRole("combobox", { name: "Karakter", exact: true }),
  ).toHaveValue("Agresif");
});

test("mobil tanpa sumber tetap kosong", async ({ page }) => {
  await start(page);
  const car = catalog.cars.find(
    (c: { id: string }) =>
      !catalog.index.some((r: { carid: string }) => r.carid === c.id),
  );
  await page
    .getByRole("combobox", { name: "Kelas mobil", exact: true })
    .selectOption(car.class);
  await page
    .getByRole("combobox", { name: "Mobil & varian", exact: true })
    .selectOption(car.id);
  await expect(page.locator(".search-button")).toBeEnabled();
  await page.locator(".search-button").click();
  await expect(page.getByTestId("empty-result")).toContainText(
    "belum punya sumber",
  );
  await expect(
    page.getByRole("button", { name: "Pakai sebagai acuan" }),
  ).toHaveCount(0);
});

test("fuel, empat tekanan, catatan dan reload riwayat", async ({ page }) => {
  await reference(page);
  await openPractice(page);
  await fuelInputs(page);
  await expect(page.getByTestId("fuel-result")).toContainText("53,2");
  await expect(page.getByTestId("fuel-result")).toContainText("54");
  await page.getByLabel("Kapasitas tangki (L)").fill("50");
  await expect(page.getByTestId("fuel-result")).toContainText("Melebihi");
  await page.getByLabel("Suhu udara (°C)", { exact: true }).fill("24");
  await page.getByLabel("Mode target tekanan").selectOption("manual");
  await page.getByLabel("Lap pengukuran", { exact: true }).fill("5");
  await page
    .getByLabel("Tekanan sudah relatif stabil", { exact: true })
    .check();
  await page
    .getByLabel("Kondisi berikutnya sebanding untuk menguji koreksi", {
      exact: true,
    })
    .check();
  const values = {
    FL: [25, 26, 26.5, "25.5"],
    FR: [25.2, 27, 26.5, "24.7"],
    RL: [25.5, 26.5, 26.5, "25.5"],
    RR: [25.1, 26.2, 26.5, "25.4"],
  };
  for (const [w, [cold, hot, target, expected]] of Object.entries(values)) {
    await page.getByLabel(`Cold dipakai ${w} (psi)`).fill(String(cold));
    await page.getByLabel(`Hot terukur ${w} (psi)`).fill(String(hot));
    await page.getByLabel(`Target hot ${w} (psi)`).fill(String(target));
    await expect(page.getByTestId(`pressure-${w}`)).toContainText(
      `${expected} psi`,
    );
  }
  await page.getByLabel("Catatan latihan").fill("Latihan lima lap.");
  await page
    .getByRole("button", { name: "Simpan Latihan", exact: true })
    .click();
  await nav(page, "Riwayat Latihan");
  await expect(page.locator(".log-card")).toHaveCount(1);
  await expect(page.locator(".log-card")).toContainText("Latihan lima lap.");
  await page.reload();
  await nav(page, "Riwayat Latihan");
  await expect(page.locator(".log-card")).toContainText(
    "25.5 / 24.7 / 25.5 / 25.4",
  );
});

test("input kalkulator tidak lengkap tidak mengarang hasil", async ({
  page,
}) => {
  await reference(page);
  await openPractice(page);
  await page
    .getByRole("combobox", { name: "Mode hitung", exact: true })
    .selectOption("duration");
  await page.getByLabel("Durasi (menit)", { exact: true }).fill("30");
  await page.getByLabel("Konsumsi aktual (L/lap)").fill("2.8");
  await page.getByLabel("Rata-rata lap time").fill("0");
  await expect(page.getByTestId("fuel-result")).toHaveCount(0);
  await page.getByLabel("Cold dipakai FL (psi)").fill("25");
  await expect(page.getByTestId("pressure-FL")).toContainText("—");
  await page
    .getByRole("button", { name: "Simpan Latihan", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Latihan disimpan");
  await nav(page, "Riwayat Latihan");
  await expect(page.locator(".log-card")).toContainText("— / — / — / —");
});

test("favorit, clipboard, backup restore/merge dan file rusak", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await reference(page);
  await page.getByRole("button", { name: "Salin Ringkasan" }).click();
  await expect(page.getByRole("status")).toContainText("berhasil disalin");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Pit stops aktif tersimpan: 0 stop",
  );
  await page
    .getByRole("button", { name: "Simpan Favorit", exact: true })
    .click();
  await openPractice(page);
  await page.getByLabel("Catatan latihan").fill("Catatan backup.");
  await page
    .getByRole("button", { name: "Simpan Latihan", exact: true })
    .click();
  await page.reload();
  await nav(page, "Favorit");
  await expect(page.locator(".saved-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Lihat detail", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Tutup detail ×" }).click();
  await nav(page, "Riwayat Latihan");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Ekspor Backup" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  await page
    .getByRole("button", { name: "Hapus latihan", exact: true })
    .click();
  await nav(page, "Favorit");
  await page.getByRole("button", { name: "Hapus", exact: true }).click();
  await nav(page, "Riwayat Latihan");
  await page.getByLabel("File backup JSON").setInputFiles(path!);
  await expect(page.locator(".log-card")).toHaveCount(1);
  const editedBackup = JSON.parse(readFileSync(path!, "utf8"));
  editedBackup.state.logs[0].draft.notes =
    "Catatan baru dari backup dengan ID sama.";
  await page.getByLabel("File backup JSON").setInputFiles({
    name: "edited.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(editedBackup)),
  });
  await expect(page.locator(".log-card")).toContainText("Catatan backup.");
  await expect(page.locator(".log-card")).not.toContainText(
    "Catatan baru dari backup",
  );
  await page.getByLabel("File backup JSON").setInputFiles(path!);
  await expect(page.locator(".log-card")).toHaveCount(1);
  await page.getByLabel("File backup JSON").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{bad"),
  });
  await expect(page.getByRole("alert")).toContainText("Backup tidak valid");
  await expect(page.locator(".log-card")).toHaveCount(1);
  await nav(page, "Favorit");
  await expect(page.locator(".saved-card")).toHaveCount(1);
});

test("backup memulihkan pilihan terakhir pada browser baru", async ({
  page,
}) => {
  await start(page);
  const car = catalog.cars.find((c: { class: string }) => c.class === "GT2");
  const selection = {
    className: "GT2",
    carid: car.id,
    trackid: "spa",
    condition: "Heavy wet",
    session: "Endurance",
    profile: "Agresif",
    compound: "Wet",
  };
  const backup = {
    format: "acc-setup-personal",
    schemaVersion: 1,
    state: { lastSelection: selection, favorites: [], logs: [] },
  };
  await nav(page, "Riwayat Latihan");
  await page.getByLabel("File backup JSON").setInputFiles({
    name: "selection.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await expect(page.getByRole("status")).toContainText("Backup digabungkan");
  await nav(page, "Cari Setup");
  await expect(
    page.getByRole("combobox", { name: "Kelas mobil", exact: true }),
  ).toHaveValue("GT2");
  await expect(
    page.getByRole("combobox", { name: "Mobil & varian", exact: true }),
  ).toHaveValue(car.id);
  await expect(
    page.getByRole("combobox", { name: "Compound", exact: true }),
  ).toHaveValue("Wet");
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Sirkuit", exact: true }),
  ).toHaveValue("spa");
});

test("pustaka baseline/LFM tersedia dan daftar cakupan kosong", async ({
  page,
}) => {
  await start(page);
  await nav(page, "Data & Panduan");
  await expect(
    page.getByRole("heading", { name: "Snapshot ACC PC 1.10.4" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Jenis data", exact: true })
    .selectOption("Baseline");
  await expect(page.locator(".library-table tbody tr").first()).toBeVisible();
  await page
    .getByRole("button", { name: "Lihat detail", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toContainText("Pustaka · Baseline");
  await page.getByRole("button", { name: "Tutup detail ×" }).click();
  await page
    .getByRole("combobox", { name: "Jenis data", exact: true })
    .selectOption("Arsip LFM Sprint");
  await expect(page.locator(".library-table tbody tr").first()).toBeVisible();
  await expect(page.locator(".coverage-grid>div")).toHaveCount(25);
});

test("kegagalan file mobil dan retry tanpa nilai lama", async ({ page }) => {
  let fail = true;
  await page.route("**/data/cars/ferrari_296_gt3.json", (route) =>
    fail
      ? route.fulfill({ status: 503, body: "Unavailable" })
      : route.continue(),
  );
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("503");
  await expect(page.locator(".search-button")).toBeDisabled();
  await expect(page.getByTestId("setup-detail")).toHaveCount(0);
  fail = false;
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(page.locator(".search-button")).toBeEnabled();
});

test("kegagalan katalog dan recovery", async ({ page }) => {
  let fail = true;
  await page.route("**/data/catalog.json", (route) =>
    fail
      ? route.fulfill({ status: 500, body: "Unavailable" })
      : route.continue(),
  );
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("500");
  fail = false;
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(
    page.getByRole("combobox", { name: "Kelas mobil", exact: true }),
  ).toBeVisible();
});

test("storage rusak tetap utuh dan kegagalan tampil jelas", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("acc-setup-personal-v1", "{bad"),
  );
  await start(page);
  await expect(page.getByRole("alert")).toContainText(
    "Data lama tidak ditimpa",
  );
  await page
    .getByRole("combobox", { name: "Sirkuit", exact: true })
    .selectOption("spa");
  expect(
    await page.evaluate(() => localStorage.getItem("acc-setup-personal-v1")),
  ).toBe("{bad");
});

test("storage ditolak tetap bisa ekspor perubahan sesi", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw Error("QuotaExceeded");
    };
  });
  await reference(page);
  await page
    .getByRole("button", { name: "Simpan Favorit", exact: true })
    .click();
  await expect(page.locator(".storage-alert")).toContainText("Gagal menyimpan");
  await nav(page, "Favorit");
  await expect(page.locator(".saved-card")).toHaveCount(1);
  expect(
    await page.evaluate(() => localStorage.getItem("acc-setup-personal-v1")),
  ).toBeNull();
});

test("keyboard, layout responsif, snapshot visual dan tanpa API eksternal", async ({
  page,
}, testInfo) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (
      new URL(r.url()).origin !== new URL(testInfo.project.use.baseURL!).origin
    )
      external.push(r.url());
  });
  await start(page);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main/);
  await expect(page.locator("#main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("combobox", { name: "Kelas mobil", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("heading", { name: "Setup untuk sesi berikutnya." })
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `tests/screenshots/${testInfo.project.name}-search.png`,
    fullPage: true,
  });
  await page.locator(".search-button").click();
  await page
    .getByRole("button", { name: "Pakai sebagai acuan" })
    .first()
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `tests/screenshots/${testInfo.project.name}-result.png`,
    fullPage: true,
  });
  expect(external).toEqual([]);
});

test("setup sendiri tanpa katalog: fuel, dua run, perbandingan dan reload", async ({
  page,
}, testInfo) => {
  await start(page);
  const car = catalog.cars.find(
    (c: { id: string }) =>
      !catalog.index.some((r: { carid: string }) => r.carid === c.id),
  );
  await page
    .getByRole("combobox", { name: "Kelas mobil", exact: true })
    .selectOption(car.class);
  await page
    .getByRole("combobox", { name: "Mobil & varian", exact: true })
    .selectOption(car.id);
  await page
    .getByRole("combobox", { name: "BoP sesi", exact: true })
    .selectOption("Standard");
  await page.getByLabel("Suhu udara sesi (°C)", { exact: true }).fill("24");
  await page.getByLabel("Suhu lintasan sesi (°C)", { exact: true }).fill("32");
  await page.getByLabel("Grip sesi", { exact: true }).fill("Optimum");
  await page
    .getByRole("button", {
      name: "Gunakan setup bawaan/milik sendiri",
      exact: true,
    })
    .click();
  await expect(page.getByTestId("setup-detail")).toHaveCount(0);
  await expect(page.getByTestId("recommendation-card")).toContainText(
    "Setup bawaan/milik sendiri",
  );
  await openPractice(page);
  await page.getByLabel("Mode target tekanan").selectOption("manual");
  await page
    .getByLabel("Sumber/alasan target manual")
    .fill("Panduan pengujian pribadi sesuai model");
  await page.getByLabel("Fuel aktual dipakai (L)").fill("30");
  await page.getByLabel("Jumlah lap", { exact: true }).fill("10");
  await page.getByLabel("Konsumsi aktual (L/lap)").fill("2.5");
  for (const wheel of ["FL", "FR", "RL", "RR"]) {
    await page.getByLabel("Cold dipakai " + wheel + " (psi)").fill("25");
    await page.getByLabel("Hot terukur " + wheel + " (psi)").fill("26");
    await page.getByLabel("Target hot " + wheel + " (psi)").fill("26.5");
  }
  await expect(page.getByTestId("pressure-FL")).toContainText("—");
  await page.getByLabel("Lap pengukuran", { exact: true }).fill("5");
  await page
    .getByLabel("Tekanan sudah relatif stabil", { exact: true })
    .check();
  await page
    .getByLabel("Kondisi berikutnya sebanding untuk menguji koreksi", {
      exact: true,
    })
    .check();
  await expect(page.getByTestId("pressure-FL")).toContainText("25.5 psi");
  await expect(page.getByTestId("recommendation-card")).toContainText("28 L");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `tests/screenshots/${testInfo.project.name}-practice.png`,
    fullPage: true,
  });
  await page.getByTestId("recommendation-card").screenshot({
    path: `tests/screenshots/${testInfo.project.name}-recommendation.png`,
  });
  await page.locator(".pressure-grid").screenshot({
    path: `tests/screenshots/${testInfo.project.name}-pressures.png`,
  });
  await page
    .getByRole("button", { name: "Simpan Latihan", exact: true })
    .click();
  await nav(page, "Riwayat Latihan");
  await expect(page.locator(".log-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Mulai run berikutnya", exact: true })
    .click();
  await openPractice(page);
  await expect(page.getByLabel("Cold dipakai FL (psi)")).toHaveValue("25.5");
  await expect(page.getByLabel("Hot terukur FL (psi)")).toHaveValue("");
  await expect(
    page.getByLabel("Tekanan sudah relatif stabil", { exact: true }),
  ).not.toBeChecked();
  for (const wheel of ["FL", "FR", "RL", "RR"])
    await page.getByLabel("Hot terukur " + wheel + " (psi)").fill("26.5");
  await page.getByLabel("Lap pengukuran", { exact: true }).fill("5");
  await page
    .getByLabel("Tekanan sudah relatif stabil", { exact: true })
    .check();
  await page
    .getByLabel("Kondisi berikutnya sebanding untuk menguji koreksi", {
      exact: true,
    })
    .check();
  await page
    .getByRole("button", { name: "Simpan Latihan", exact: true })
    .click();
  await nav(page, "Riwayat Latihan");
  await expect(page.locator(".log-card")).toHaveCount(2);
  await page
    .getByRole("combobox", { name: "Run A", exact: true })
    .selectOption({ index: 2 });
  await page
    .getByRole("combobox", { name: "Run B", exact: true })
    .selectOption({ index: 1 });
  await expect(page.getByTestId("run-comparison")).toContainText(
    "Deviasi berkurang 0.50 psi",
  );
  await page
    .locator(".log-card")
    .nth(1)
    .getByText("Input latihan tersimpan", { exact: true })
    .click();
  await expect(
    page
      .locator(".log-card")
      .nth(1)
      .getByRole("cell", { name: "25", exact: true }),
  ).toHaveCount(4);
  await page.reload();
  await nav(page, "Riwayat Latihan");
  await expect(page.locator(".log-card")).toHaveCount(2);
});

test("gate kualitas, target ekstrem dan versi berikutnya", async ({ page }) => {
  await start(page);
  await page
    .getByRole("button", {
      name: "Gunakan setup bawaan/milik sendiri",
      exact: true,
    })
    .click();
  await openPractice(page);
  await page.getByLabel("Cold dipakai FL (psi)").fill("25");
  await page.getByLabel("Hot terukur FL (psi)").fill("25.5");
  await expect(page.getByTestId("pressure-FL")).toContainText("—");
  await page.getByLabel("Lap pengukuran", { exact: true }).fill("5");
  await page
    .getByLabel("Tekanan sudah relatif stabil", { exact: true })
    .check();
  await page
    .getByLabel("Kondisi berikutnya sebanding untuk menguji koreksi", {
      exact: true,
    })
    .check();
  await expect(page.getByTestId("pressure-FL")).toContainText("25.5 psi");
  await page
    .getByLabel("Ada insiden yang memengaruhi ban", { exact: true })
    .check();
  await expect(page.getByTestId("pressure-FL")).toContainText("—");
  await page
    .getByLabel("Ada insiden yang memengaruhi ban", { exact: true })
    .uncheck();
  await page.getByText("Kondisi sesi berikutnya", { exact: true }).click();
  await page
    .getByLabel("Versi game sesi berikutnya", { exact: true })
    .fill("1.9.8");
  await page
    .getByLabel("Kondisi berikutnya sebanding untuk menguji koreksi", {
      exact: true,
    })
    .check();
  await expect(page.getByTestId("pressure-FL")).toContainText("—");
  await page
    .getByLabel("Versi game sesi berikutnya", { exact: true })
    .fill("1.10.4");
  await page
    .getByLabel("Kondisi berikutnya sebanding untuk menguji koreksi", {
      exact: true,
    })
    .check();
  await page.getByLabel("Hot terukur FL (psi)").fill("26.4");
  await expect(page.getByTestId("pressure-FL")).toContainText("25.0 psi");
  await page.getByLabel("Mode target tekanan").selectOption("manual");
  await page.getByLabel("Target hot FL (psi)").fill("60");
  await expect(page.getByTestId("pressure-FL")).toContainText("—");
  await expect(page.locator(".pressure-card").first()).toContainText(
    "20–40 psi",
  );
  await page
    .getByRole("button", { name: "Simpan Latihan", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("20–40 psi");
  await nav(page, "Riwayat Latihan");
  await expect(page.locator(".log-card")).toHaveCount(0);
});

test("damp/drying menampilkan opsi sampai racing line diketahui", async ({
  page,
}) => {
  await start(page);
  await page
    .getByRole("combobox", { name: "Kondisi", exact: true })
    .selectOption("Drying");
  await page.locator(".search-button").click();
  await expect(page.getByTestId("recommendation-card")).toContainText(
    "Slick atau wet",
  );
  await page
    .getByRole("combobox", { name: "Racing line sesi", exact: true })
    .selectOption("Wet");
  await page
    .getByRole("combobox", { name: "Compound", exact: true })
    .selectOption("Wet");
  await page.locator(".search-button").click();
  await expect(page.getByTestId("recommendation-card")).toContainText(
    "30–31 psi",
  );
  await expect(page.getByTestId("recommendation-card")).toContainText(
    "Racing line masih basah",
  );
});

test("browser v1 dimigrasikan ke v2 tanpa menghapus key lama", async ({
  page,
}) => {
  const source = catalog.index.find(
    (r: { id: string }) => r.id === "ACC-7271DDFC95",
  );
  const old = {
    lastSelection: {
      className: "GT3",
      carid: source.carid,
      trackid: source.trackid,
      condition: "Dry",
      session: "Sprint race",
      profile: "Stabil",
      compound: "Dry slick",
    },
    favorites: [],
    logs: [] as unknown[],
  };
  old.logs.push({
    id: "legacy-run",
    setupId: source.id,
    carid: source.carid,
    trackid: source.trackid,
    selection: old.lastSelection,
    createdAt: "2026-10-02T10:00:00Z",
    draft: {
      fuel: {
        mode: "laps",
        laps: "",
        minutes: "",
        lapTime: "",
        consumption: "",
        reserve: "1",
        formation: "0",
        capacity: "",
      },
      pressures: Object.fromEntries(
        ["FL", "FR", "RL", "RR"].map((w) => [
          w,
          { cold: "25", hot: "26", target: "26.5" },
        ]),
      ),
      air: "24",
      track: "32",
      grip: "Optimum",
      notes: "Catatan sebelum migrasi",
    },
    results: {},
  });
  const raw = JSON.stringify(old);
  await page.addInitScript((value) => {
    if (!localStorage.getItem("acc-setup-personal-v1"))
      localStorage.setItem("acc-setup-personal-v1", value);
  }, raw);
  await start(page);
  await nav(page, "Riwayat Latihan");
  await expect(page.locator(".log-card")).toContainText(
    "Catatan sebelum migrasi",
  );
  await expect(page.locator(".log-card")).toContainText("Data v1");
  expect(
    await page.evaluate(() => localStorage.getItem("acc-setup-personal-v1")),
  ).toBe(raw);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("acc-setup-personal-v2")!)
          .schemaVersion,
    ),
  ).toBe(2);
  await page.reload();
  await nav(page, "Riwayat Latihan");
  await expect(page.locator(".log-card")).toContainText(
    "25.5 / 25.5 / 25.5 / 25.5",
  );
});
