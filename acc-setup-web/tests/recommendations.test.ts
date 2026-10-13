import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import type {
  Catalog,
  PersonalState,
  PracticeDraft,
  PracticeLog,
  SetupRecord,
} from "../src/types";
import { wheels } from "../src/types";
import { emptyContext } from "../src/lib/context";
import { calculatePressure, emptyDraft } from "../src/lib/calculators";
import {
  compareSetups,
  defaultSelection,
  findSetups,
} from "../src/lib/selection";
import {
  compareRuns,
  compoundAdvice,
  nextRunDraft,
  pressureAdvice,
  recommendRun,
  runResults,
  tyreProfile,
} from "../src/lib/recommendations";
import {
  exportBackup,
  legacyStorageKey,
  parseBackup,
  readPersonal,
  storageKey,
} from "../src/lib/storage";

const catalog = JSON.parse(
  readFileSync("public/data/catalog.json", "utf8"),
) as Catalog;
const selected = defaultSelection(catalog);
const records = JSON.parse(
  readFileSync("public/data/cars/ferrari_296_gt3.json", "utf8"),
) as SetupRecord[];
const source = records.find((r) => r.id === "ACC-7271DDFC95")!;
function usableDraft(): PracticeDraft {
  const ctx = {
    ...emptyContext("1.10.4", "Dry"),
    bop: "Standard" as const,
    air: "22",
    track: "31",
    grip: "Optimum",
  };
  const d = emptyDraft(ctx);
  d.air = ctx.air;
  d.track = ctx.track;
  d.grip = ctx.grip;
  d.quality = { lap: "5", stable: true, incident: false, comparable: true };
  d.actualFuel = "30";
  d.fuel = { ...d.fuel, laps: "10", consumption: "2.5" };
  for (const w of wheels)
    d.pressures[w] = { cold: "25", hot: "25.5", target: "26.5" };
  return d;
}
function log(d = usableDraft(), id = "run-a"): PracticeLog {
  const rec = recommendRun(selected, d);
  return {
    id,
    setupId: null,
    carid: selected.carid,
    trackid: selected.trackid,
    selection: selected,
    createdAt: "2026-10-02T10:00:00Z",
    draft: d,
    recommendation: rec,
    results: runResults(rec),
    sourceSnapshot: null,
    previousLogId: null,
    legacy: false,
  };
}
function state(l = log()): PersonalState {
  return {
    lastSelection: selected,
    lastContext: l.draft.context,
    logs: [l],
    favorites: [],
  };
}
afterEach(() => vi.unstubAllGlobals());

describe("rekomendasi kondisi dan bukti", () => {
  it.each([
    ["Dry", "Unknown", "Dry slick"],
    ["Light wet", "Unknown", "Wet"],
    ["Heavy wet", "Unknown", "Wet"],
    ["Damp", "Dry", "Dry slick"],
    ["Drying", "Wet", "Wet"],
    ["Damp", "Unknown", null],
    ["Drying", "Unknown", null],
  ] as const)(
    "permukaan %s / racing line %s → %s",
    (condition, line, suggested) => {
      expect(compoundAdvice(condition, line).suggested).toBe(suggested);
    },
  );
  it("profil dibatasi kelas/model/versi dan bukti tidak menjadi verifikasi patch", () => {
    const d = usableDraft();
    expect(tyreProfile(selected, d.context)?.evidence).toBe("historical");
    expect(
      tyreProfile({ ...selected, className: "GT2" }, d.context),
    ).toBeNull();
    expect(
      tyreProfile(
        { ...selected, className: "CUP", carid: "porsche_991ii_gt3_cup" },
        d.context,
      ),
    ).toBeNull();
    expect(
      tyreProfile(selected, { ...d.context, gameVersion: "1.8.15" }),
    ).toBeNull();
    expect(recommendRun(selected, d, source).missing.join(" ")).toContain(
      "belum terverifikasi",
    );
  });
  it("sumber yang lebih dekat suhu didahulukan, ID menjadi penentu terakhir", () => {
    const ctx = usableDraft().context;
    const cold = { ...source, id: "A", ambient: 14, tracktemp: 21 };
    const close = { ...source, id: "Z", ambient: 22, tracktemp: 31 };
    expect(findSetups([cold, close], selected, ctx).alternatives[0].id).toBe(
      "Z",
    );
    expect(
      compareSetups(
        { ...close, id: "B" },
        { ...close, id: "A" },
        ctx,
        selected,
      ),
    ).toBeGreaterThan(0);
  });
  it("compatibility diketahui sebelum kelengkapan; suhu kosong tidak dianggap cocok", () => {
    const ctx = usableDraft().context;
    const matching = {
      ...source,
      id: "matching",
      version: "1.10.4",
      compatibleVerified: true,
      known: 60,
    };
    const old = { ...source, id: "old", version: "1.9.8", known: 68 };
    const unknown = {
      ...source,
      id: "unknown",
      ambient: null,
      tracktemp: null,
    };
    expect(compareSetups(matching, old, ctx, selected)).toBeLessThan(0);
    expect(compareSetups(source, unknown, ctx, selected)).toBeLessThan(0);
    expect(
      compareSetups(
        matching,
        { ...matching, compatibleVerified: false },
        { ...ctx, bop: "Custom" },
        selected,
      ),
    ).toBe(0);
    expect(
      compareSetups(
        matching,
        { ...matching, compatibleVerified: false },
        { ...ctx, bop: "Unknown" },
        selected,
      ),
    ).toBe(0);
  });
  it("metadata sesi didahulukan dari kedekatan suhu", () => {
    const ctx = usableDraft().context;
    const exact = {
      ...source,
      id: "exact",
      session: selected.session,
      ambient: 10,
      tracktemp: 15,
    };
    const general = { ...source, id: "general", ambient: 22, tracktemp: 31 };
    expect(compareSetups(exact, general, ctx, selected)).toBeLessThan(0);
  });
});

describe("koreksi dari pengukuran layak", () => {
  it.each([
    ["26.4", 25, "keep"],
    ["25.5", 25.5, "adjust"],
    ["27.5", 24.5, "adjust"],
  ])("hot %s → cold %s / %s", (hot, expected, status) => {
    const d = usableDraft();
    d.pressures.FL.hot = hot;
    expect(pressureAdvice(d, selected, "FL")).toMatchObject({
      nextCold: expected,
      status,
    });
  });
  it.each(["stable", "comparable"] as const)(
    "tanpa konfirmasi %s tidak mengeluarkan angka",
    (key) => {
      const d = usableDraft();
      d.quality[key] = false;
      expect(pressureAdvice(d, selected, "FL").nextCold).toBeNull();
    },
  );
  it("insiden, lap invalid dan perubahan versi/permukaan memblokir koreksi", () => {
    const mutations = [
      (d: PracticeDraft) => {
        d.quality.incident = true;
      },
      (d: PracticeDraft) => {
        d.quality.lap = "1.5";
      },
      (d: PracticeDraft) => {
        d.nextContext.gameVersion = "1.9.8";
      },
      (d: PracticeDraft) => {
        d.nextContext.condition = "Damp";
      },
      (d: PracticeDraft) => {
        d.nextContext.bop = "Custom";
      },
      (d: PracticeDraft) => {
        d.air = "abc";
      },
    ];
    for (const change of mutations) {
      const d = usableDraft();
      change(d);
      expect(pressureAdvice(d, selected, "FL").nextCold).toBeNull();
    }
  });
  it("manual memerlukan sumber dan target harus dalam rentang profil aktif", () => {
    const d = usableDraft();
    d.targetMode = "manual";
    expect(pressureAdvice(d, selected, "FL").status).toBe("blocked");
    d.targetSource = "Panduan ban sesuai model";
    expect(pressureAdvice(d, selected, "FL").nextCold).toBe(26);
    d.pressures.FL.target = "28";
    expect(pressureAdvice(d, selected, "FL").status).toBe("invalid");
  });
  it("target 60, cold/hot dan hasil di luar batas kewajaran ditolak", () => {
    expect(
      calculatePressure({ cold: "25", hot: "27", target: "60" }).value,
    ).toBeNull();
    expect(
      calculatePressure({ cold: "9", hot: "27", target: "26.5" }).value,
    ).toBeNull();
    expect(
      calculatePressure({ cold: "49", hot: "20", target: "35" }).value,
    ).toBeNull();
    const d = usableDraft();
    d.targetMode = "manual";
    d.targetSource = "Pengujian";
    d.pressures.FL.target = "60";
    expect(pressureAdvice(d, selected, "FL").nextCold).toBeNull();
  });
  it("profil tak tersedia memakai target manual dan memberi panduan", () => {
    const d = usableDraft(),
      gt2 = { ...selected, className: "GT2" };
    expect(pressureAdvice(d, gt2, "FL").status).toBe("blocked");
    d.targetMode = "manual";
    d.targetSource = "Pengukuran model GT2";
    expect(pressureAdvice(d, gt2, "FL").nextCold).toBe(26);
    expect(recommendRun(gt2, d).profile).toBeNull();
  });
  it("perbedaan compound dengan kondisi memblokir koreksi", () => {
    const d = usableDraft();
    d.context.condition = "Heavy wet";
    d.nextContext.condition = "Heavy wet";
    const result = recommendRun(selected, d);
    expect(result.compound.suggested).toBe("Wet");
    expect(result.pressures.FL.nextCold).toBeNull();
  });
  it("tidak mengubah cold hanya karena suhu berbeda", () => {
    const d = usableDraft();
    d.pressures.FL.hot = "26.4";
    d.nextContext.air = "23";
    d.nextContext.track = "32";
    expect(pressureAdvice(d, selected, "FL").nextCold).toBe(25);
  });
});

describe("run, snapshot dan migrasi", () => {
  it("run tanpa sumber menyimpan input aktual dan backup v2 roundtrip", () => {
    const saved = state();
    expect(parseBackup(exportBackup(saved), catalog)).toEqual(saved);
    expect(saved.logs[0].results.fuel?.prepared).toBe(28);
  });
  it("run berikutnya membawa cold hasil, tetapi mengosongkan hot dan konfirmasi", () => {
    const a = log();
    const d = nextRunDraft(a);
    expect(d.pressures.FL.cold).toBe("25.5");
    expect(d.pressures.FL.hot).toBe("");
    expect(d.quality.stable).toBe(false);
    expect(d.quality.comparable).toBe(false);
    expect(a.draft.pressures.FL.cold).toBe("25");
  });
  it("perbandingan mengevaluasi berkurangnya deviasi dan memperlihatkan kondisi", () => {
    const a = log(),
      d = usableDraft();
    d.pressures.FL.hot = "26.2";
    d.air = "23";
    const b = log(d, "run-b"),
      result = compareRuns(a, b);
    expect(result.values[0].improvement).toBe(0.5);
    expect(result.changes.join(" ")).toContain("Udara");
    expect(
      compareRuns(a, { ...b, selection: { ...b.selection, compound: "Wet" } })
        .comparable,
    ).toBe(false);
    const changed = usableDraft();
    changed.targetMode = "manual";
    changed.targetSource = "Panduan";
    expect(
      compareRuns(a, log(changed, "changed")).values[0].improvement,
    ).toBeNull();
  });
  it("snapshot sumber/rekomendasi lama tidak ditulis ulang saat katalog berubah", () => {
    const a = log();
    a.setupId = source.id;
    a.sourceSnapshot = {
      id: source.id,
      name: source.name,
      creator: source.creator,
      version: source.version,
      ambient: source.ambient,
      tracktemp: source.tracktemp,
      source: source.source,
    };
    const changed = structuredClone(catalog);
    const record = changed.index.find((r) => r.id === source.id)!;
    record.name = "Nama baru";
    record.version = "1.10.4";
    expect(parseBackup(exportBackup(state(a)), changed).logs[0]).toEqual(a);
  });
  it("migrasi v1 menjaga catatan/favorit dan target manual, versi menjadi tidak diketahui", () => {
    const d = usableDraft();
    const old = {
      lastSelection: selected,
      favorites: [
        {
          id: source.id,
          selection: selected,
          createdAt: "2026-10-02T10:00:00Z",
        },
      ],
      logs: [
        {
          id: "old",
          setupId: source.id,
          carid: selected.carid,
          trackid: selected.trackid,
          selection: selected,
          createdAt: "2026-10-02T10:00:00Z",
          draft: { ...d, notes: "Catatan lama" },
          results: { pressures: { FL: 99 } },
        },
      ],
    };
    const migrated = parseBackup(
      JSON.stringify({
        format: "acc-setup-personal",
        schemaVersion: 1,
        state: old,
      }),
      catalog,
    );
    expect(migrated.logs[0]).toMatchObject({
      legacy: true,
      recommendation: null,
      draft: {
        targetMode: "manual",
        context: { gameVersion: "Unknown" },
        notes: "Catatan lama",
      },
    });
    expect(migrated.logs[0].results.pressures.FL).toBe(26);
    expect(migrated.favorites).toEqual(old.favorites);
    expect(parseBackup(exportBackup(migrated), catalog)).toEqual(migrated);
  });
  it("v1 browser dibaca tanpa menimpa key lama; v2 rusak tidak jatuh diam-diam ke v1", () => {
    const old = JSON.stringify({
      lastSelection: null,
      favorites: [],
      logs: [],
    });
    const setItem = vi.fn();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => (key === legacyStorageKey ? old : null),
      setItem,
    });
    expect(readPersonal(catalog).migrated).toBe(true);
    expect(setItem).not.toHaveBeenCalled();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => (key === storageKey ? "{bad" : old),
      setItem,
    });
    expect(readPersonal(catalog).writable).toBe(false);
  });
  it("v2 menolak koreksi dan rentang profil yang dipalsukan", () => {
    const backup = JSON.parse(exportBackup(state()));
    backup.state.logs[0].recommendation.pressures.FL.nextCold = 40;
    expect(() => parseBackup(JSON.stringify(backup), catalog)).toThrow();
    const second = JSON.parse(exportBackup(state()));
    second.state.logs[0].recommendation.profile.range.max = 60;
    expect(() => parseBackup(JSON.stringify(second), catalog)).toThrow();
    const third = JSON.parse(exportBackup(state()));
    third.state.logs[0].draft.quality.stable = false;
    expect(() => parseBackup(JSON.stringify(third), catalog)).toThrow();
  });
  it("urutan properti JSON tidak memengaruhi validasi snapshot", () => {
    const backup = JSON.parse(exportBackup(state()));
    const saved = backup.state.logs[0];
    saved.results = {
      pressures: saved.results.pressures,
      fuel: saved.results.fuel,
    };
    saved.recommendation.fuel = Object.fromEntries(
      Object.entries(saved.recommendation.fuel).reverse(),
    );
    expect(parseBackup(JSON.stringify(backup), catalog)).toEqual(state());
  });
});
