import { describe, expect, it, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import type {
  Catalog,
  Selection,
  SetupRecord,
  PersonalState,
} from "../src/types";
import {
  calculateFuel,
  calculatePressure,
  emptyDraft,
  lapSeconds,
  numberInput,
} from "../src/lib/calculators";
import {
  compareSetups,
  copySummary,
  defaultSelection,
  differences,
  displaySetting,
  findSetups,
} from "../src/lib/selection";
import {
  emptyState,
  exportBackup,
  mergePersonal,
  parseBackup,
  readPersonal,
  storageKey,
  writePersonal,
} from "../src/lib/storage";

import { recommendRun, runResults } from "../src/lib/recommendations";

const catalog = JSON.parse(
  readFileSync("public/data/catalog.json", "utf8"),
) as Catalog;
const records = JSON.parse(
  readFileSync("public/data/cars/ferrari_296_gt3.json", "utf8"),
) as SetupRecord[];
const reference = records.find((r) => r.id === "ACC-7271DDFC95")!;
const selected = defaultSelection(catalog);
const make = (patch: Partial<SetupRecord> = {}): SetupRecord => ({
  ...reference,
  condition: "Dry",
  session: "Sprint race",
  profile: "Stabil",
  ...patch,
});
afterEach(() => vi.unstubAllGlobals());

describe("pencocokan dan ranking sumber", () => {
  it("metadata persis dan alternatif dipisahkan", () => {
    const { exact, alternatives } = findSetups([make(), reference], selected);
    expect(exact).toHaveLength(1);
    expect(alternatives).toHaveLength(1);
  });
  it.each([
    { carid: "ferrari_488_gt3" },
    { trackid: "spa" },
    { compound: "Wet" },
    { scope: "Baseline" },
    { scope: "Arsip LFM Sprint" },
  ])("tidak bocor lintas basis %j", (patch) => {
    expect(findSetups([make(patch)], selected)).toEqual({
      exact: [],
      alternatives: [],
    });
  });
  it.each([
    { condition: "Heavy wet" },
    { session: "Qualifying" },
    { profile: "Agresif" },
  ])("metadata spesifik berbeda menjadi alternatif eksplisit %j", (patch) => {
    const found = findSetups([make(patch)], selected);
    expect(found.exact).toHaveLength(0);
    expect(found.alternatives).toHaveLength(1);
    expect(differences(found.alternatives[0], selected)).toHaveLength(1);
  });
  it("Race umum tetap metadata berbeda untuk seluruh sesi", () => {
    expect(findSetups([reference], selected).alternatives).toHaveLength(1);
    expect(
      findSetups([reference], { ...selected, session: "Endurance" })
        .alternatives,
    ).toHaveLength(1);
    expect(
      findSetups([reference], { ...selected, session: "Practice" })
        .alternatives,
    ).toHaveLength(1);
  });
  it("Wet umum tidak menjadi dry", () => {
    const wet = make({ condition: "Wet umum", compound: "Wet" });
    expect(findSetups([wet], selected).alternatives).toHaveLength(0);
    expect(
      findSetups([wet], {
        ...selected,
        condition: "Heavy wet",
        compound: "Wet",
      }).alternatives,
    ).toHaveLength(1);
  });
  it("unknown tidak disimpulkan dari compound", () => {
    const r = make({
      condition: "Tidak disebut",
      session: "Tidak disebut",
      profile: "Tidak disebut",
    });
    expect(findSetups([r], selected).exact).toHaveLength(0);
    expect(findSetups([r], selected).alternatives).toHaveLength(1);
  });
  it("kompatibilitas, kelengkapan, versi lalu ID", () => {
    const entries = [
      make({ id: "ACC-B", version: "1.10.3" }),
      make({ id: "ACC-A", version: "1.10.3" }),
      make({ id: "ACC-V", known: 65, compatibleVerified: true }),
      make({ id: "ACC-C", known: 65, version: "1.10.4" }),
      make({ id: "ACC-D", version: "1.9.8" }),
    ];
    expect(entries.sort(compareSetups).map((r) => r.id)).toEqual([
      "ACC-V",
      "ACC-A",
      "ACC-B",
      "ACC-D",
      "ACC-C",
    ]);
  });
  it("nilai nol dan ketiga status tidak tertukar", () => {
    expect(displaySetting({ status: "available", value: 0 })).toBe("0");
    expect(displaySetting({ status: "missing" })).toBe("Data sumber kosong");
    expect(displaySetting({ status: "unverified" })).toBe(
      "Konversi belum terverifikasi",
    );
    expect(
      displaySetting({ status: "notApplicable", detail: "n/a (tetap)" }),
    ).toContain("Tidak berlaku");
    expect(copySummary(reference, catalog, selected)).toContain(
      "Pit stops aktif tersimpan: 0 stop",
    );
  });
});

describe("fuel independen", () => {
  const base = {
    ...emptyDraft().fuel,
    mode: "duration" as const,
    minutes: "30",
    lapTime: "1:45",
    consumption: "2,8",
  };
  it("durasi dibulatkan ke atas, fuel tepat terpisah liter penuh", () => {
    expect(calculateFuel(base).value).toEqual({
      laps: 18,
      exact: 53.2,
      prepared: 54,
      capacity: null,
      exceeds: false,
    });
  });
  it("formation ditambah terpisah dan batas kapasitas diperiksa pada liter disiapkan", () => {
    expect(
      calculateFuel({ ...base, formation: "1.5", capacity: "54" }).value,
    ).toMatchObject({ exact: 54.7, prepared: 55, exceeds: true });
    expect(calculateFuel({ ...base, capacity: "54" }).value?.exceeds).toBe(
      false,
    );
    expect(calculateFuel({ ...base, capacity: "50" }).value?.exceeds).toBe(
      true,
    );
  });
  it("mode lap mengabaikan pace/durasi kosong atau nol", () => {
    expect(
      calculateFuel({
        ...base,
        mode: "laps",
        laps: "10",
        lapTime: "0",
        minutes: "",
      }).value,
    ).toMatchObject({ laps: 10, exact: 30.8, prepared: 31 });
  });
  it.each([
    { consumption: "" },
    { consumption: "0" },
    { lapTime: "0" },
    { lapTime: "" },
    { minutes: "" },
    { minutes: "0" },
    { reserve: "-1" },
    { reserve: "1.1" },
    { formation: "" },
    { formation: "-1" },
    { capacity: "0" },
    { lapTime: "1:60" },
  ])("menolak input invalid %j", (patch) =>
    expect(calculateFuel({ ...base, ...patch }).value).toBeNull(),
  );
  it.each(["", "0", "-1", "2.5"])("lap harus bulat positif (%s)", (laps) =>
    expect(calculateFuel({ ...base, mode: "laps", laps }).value).toBeNull(),
  );
  it("nol reserve dan formation sah", () =>
    expect(
      calculateFuel({ ...base, reserve: "0", formation: "0" }).value?.exact,
    ).toBe(50.4));
  it("parse detik/min:detik dan menolak Infinity atau notasi tidak diminta", () => {
    expect(lapSeconds("105")).toBe(105);
    expect(lapSeconds("1:45,5")).toBe(105.5);
    expect(lapSeconds("0:00")).toBe(0);
    expect(lapSeconds("1:60")).toBeNull();
    expect(numberInput("Infinity")).toBeNull();
    expect(numberInput("0x10")).toBeNull();
  });
});

describe("tekanan empat roda", () => {
  it.each([
    [25, 26, 26.5, 25.5],
    [25.2, 27, 26.5, 24.7],
    [25.5, 26.5, 26.5, 25.5],
    [25.1, 26.2, 26.5, 25.4],
  ])("cold %s hot %s target %s → %s", (cold, hot, target, expected) => {
    expect(
      calculatePressure({
        cold: String(cold),
        hot: String(hot),
        target: String(target),
      }).value,
    ).toBe(expected);
  });
  it("pembulatan 0,1 psi", () =>
    expect(
      calculatePressure({ cold: "25.25", hot: "26", target: "26.5" }).value,
    ).toBe(25.8));
  it.each([
    { cold: "", hot: "26", target: "26.5" },
    { cold: "25", hot: "", target: "26.5" },
    { cold: "0", hot: "26", target: "26.5" },
    { cold: "1", hot: "40", target: "1" },
  ])("input tidak lengkap/hasil invalid %j", (input) =>
    expect(calculatePressure(input).value).toBeNull(),
  );
});

describe("backup dan kegagalan storage", () => {
  function saved(): PersonalState {
    const draft = emptyDraft();
    draft.notes = "catatan lama";
    return {
      lastSelection: { ...selected },
      lastContext: null,
      favorites: [
        {
          id: reference.id,
          selection: { ...selected },
          createdAt: "2026-10-02T10:00:00Z",
        },
      ],
      logs: [
        {
          id: "log-1",
          setupId: reference.id,
          carid: selected.carid,
          trackid: selected.trackid,
          selection: { ...selected },
          createdAt: "2026-10-02T10:01:00Z",
          draft,
          results: runResults(recommendRun(selected, draft, reference)),
          recommendation: recommendRun(selected, draft, reference),
          sourceSnapshot: null,
          previousLogId: null,
          legacy: false,
        },
      ],
    };
  }
  it("roundtrip backup semua input", () =>
    expect(parseBackup(exportBackup(saved()), catalog)).toEqual(saved()));
  it("merge tidak menimpa catatan ID lama", () => {
    const incoming = saved();
    incoming.logs[0].draft.notes = "catatan baru";
    incoming.logs.push({ ...incoming.logs[0], id: "log-2" });
    const result = mergePersonal(saved(), incoming);
    expect(result.logs).toHaveLength(2);
    expect(result.logs[0].draft.notes).toBe("catatan lama");
    expect(result.favorites).toHaveLength(1);
  });
  it.each([
    "{}",
    "{bad",
    JSON.stringify({
      format: "acc-setup-personal",
      schemaVersion: 3,
      state: emptyState(),
    }),
  ])("menolak file invalid", (input) =>
    expect(() => parseBackup(input, catalog)).toThrow(),
  );
  it("menolak ID/car/compound salah dan duplikasi", () => {
    for (const mutate of [
      (s: PersonalState) => {
        s.favorites[0].id = "ACC-TIDAK-ADA";
      },
      (s: PersonalState) => {
        s.logs[0].carid = "audi_r8_lms";
      },
      (s: PersonalState) => {
        s.logs[0].selection.compound = "Wet";
      },
      (s: PersonalState) => {
        s.logs.push(s.logs[0]);
      },
    ]) {
      const state = saved();
      mutate(state);
      expect(() => parseBackup(exportBackup(state), catalog)).toThrow();
    }
  });
  it("backup v2 menolak hasil yang berbeda dari snapshot rekomendasi", () => {
    const state = saved();
    state.logs[0].results.pressures.FL = 99;
    expect(() => parseBackup(exportBackup(state), catalog)).toThrow();
  });
  it("storage penuh tidak menghapus data sebelumnya", () => {
    const previous = exportBackup(saved());
    const storage = {
      getItem: () => previous,
      setItem: () => {
        throw Error("QuotaExceeded");
      },
    };
    vi.stubGlobal("localStorage", storage);
    expect(writePersonal(saved())).toContain("Gagal menyimpan");
    expect(storage.getItem()).toBe(previous);
  });
  it("storage rusak tidak ditimpa dengan emptyState", () => {
    const setItem = vi.fn();
    vi.stubGlobal("localStorage", { getItem: () => "{bad", setItem });
    expect(readPersonal(catalog).writable).toBe(false);
    expect(setItem).not.toHaveBeenCalled();
  });
  it("data valid terbaca dan tersimpan dengan key tetap", () => {
    const setItem = vi.fn();
    vi.stubGlobal("localStorage", {
      getItem: () => JSON.stringify({ schemaVersion: 2, state: saved() }),
      setItem,
    });
    expect(readPersonal(catalog).state).toEqual(saved());
    expect(writePersonal(saved())).toBeNull();
    expect(setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify({ schemaVersion: 2, state: saved() }),
    );
  });
  it("compound kondisi terkunci ditolak bila tidak konsisten", () => {
    const state = saved();
    state.lastSelection = {
      ...selected,
      condition: "Heavy wet",
      compound: "Dry slick",
    } as Selection;
    expect(() => parseBackup(exportBackup(state), catalog)).toThrow();
  });
});
