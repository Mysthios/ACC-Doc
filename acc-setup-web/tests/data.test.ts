import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { Catalog, SetupRecord } from "../src/types";

const catalog = JSON.parse(
  readFileSync("public/data/catalog.json", "utf8"),
) as Catalog;
const snapshot = JSON.parse(readFileSync("data/source-snapshot.json", "utf8"));
const records: SetupRecord[] = catalog.cars.flatMap((c) =>
  JSON.parse(readFileSync(`public/data/cars/${c.id}.json`, "utf8")),
);
describe("intregritas snapshot dan data runtime", () => {
  it("katalog lengkap, varian unik dan label Mercedes Evo benar", () => {
    expect(catalog.cars).toHaveLength(54);
    expect(catalog.tracks).toHaveLength(25);
    expect(records).toHaveLength(1602);
    expect(new Set(catalog.cars.map((c) => c.id)).size).toBe(54);
    expect(new Set(catalog.tracks.map((c) => c.id)).size).toBe(25);
    expect(new Set(records.map((c) => c.id)).size).toBe(1602);
    expect(
      catalog.cars.find((c) => c.id === "mercedes_amg_gt3_evo")?.name,
    ).toBe("Mercedes-AMG GT3 Evo 2020");
  });
  it("semua nilai sumber, roda, dan status terpelihara tanpa konversi baru", () => {
    for (const original of snapshot.records) {
      const output = records.find((r) => r.id === original.id)!;
      expect(output.carid).toBe(original.carid);
      expect(output.trackid).toBe(original.trackid);
      expect(output.source).toBe(original.source);
      expect(output.creator).toBe(original.creator);
      expect(output.compatibleVerified).toBe(false);
      expect(output).not.toHaveProperty("raw");
      for (let i = 0; i < catalog.parameters.length; i++) {
        const p = catalog.parameters[i],
          actual = output.settings[p.key],
          v = original.values[i];
        if (v === null || v === undefined || v === "" || v === "Belum tersedia")
          expect(actual.status).toBe("missing");
        else if (v === "Konversi belum terverifikasi")
          expect(actual.status).toBe("unverified");
        else if (typeof v === "string" && v.startsWith("n/a"))
          expect(actual.status).toBe("notApplicable");
        else
          expect(actual).toEqual({
            status: "available",
            value:
              p.key === "pitStrategy"
                ? v.replace(/Stop (\d+):/g, "Template $1:")
                : v,
          });
      }
    }
  });
  it("1350 pasangan tercatat termasuk nol", () => {
    const values = Object.values(catalog.coverage).flatMap((v) =>
      Object.values(v),
    );
    expect(values).toHaveLength(1350);
    expect(values.filter(Boolean)).toHaveLength(326);
    expect(values.reduce((a, b) => a + b)).toBe(1241);
  });
  it("nol pit aktif tidak ditafsirkan sebagai 30 scheduled stops", () => {
    expect(
      records.every(
        (r) =>
          r.settings.nPitStops.status === "available" &&
          r.settings.nPitStops.value === 0,
      ),
    ).toBe(true);
    const sample = records.find((r) => r.id === "ACC-7271DDFC95")!;
    expect(
      sample.settings.pitStrategy.status === "available" &&
        String(sample.settings.pitStrategy.value),
    ).toContain("Template 30:");
  });
});
