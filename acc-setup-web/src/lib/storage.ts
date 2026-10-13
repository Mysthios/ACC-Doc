import {
  conditions,
  profiles,
  sessions,
  wheels,
  type Catalog,
  type PersonalState,
  type PracticeDraft,
  type PracticeLog,
  type Recommendation,
  type Selection,
  type SessionContext,
  type SourceSnapshot,
} from "../types";
import {
  calculateFuel,
  calculatePressure,
  emptyDraft,
  numberInput,
} from "./calculators";
import { emptyContext, measuredContext } from "./context";
import { compoundAdvice, qualityIssues, runResults } from "./recommendations";

export const storageKey = "acc-setup-personal-v2";
export const legacyStorageKey = "acc-setup-personal-v1";
export const emptyState = (): PersonalState => ({
  lastSelection: null,
  lastContext: null,
  favorites: [],
  logs: [],
});
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const string = (v: unknown, max = 500): v is string =>
  typeof v === "string" && v.length <= max;
const numeric = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
function sameData(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((v, i) => sameData(v, b[i]));
  if (!object(a) || !object(b)) return false;
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => Object.hasOwn(b, key) && sameData(a[key], b[key]))
  );
}
function fail(): never {
  throw Error(
    "Backup tidak valid atau tidak cocok dengan katalog. Data saat ini tetap tersimpan.",
  );
}
function date(v: unknown): string {
  return string(v, 40) && !Number.isNaN(Date.parse(v)) ? v : fail();
}
export function validSelection(v: unknown, catalog: Catalog): v is Selection {
  if (!object(v)) return false;
  const car = catalog.cars.find((c) => c.id === v.carid);
  return (
    !!car &&
    car.class === v.className &&
    catalog.tracks.some((t) => t.id === v.trackid) &&
    conditions.includes(v.condition as Selection["condition"]) &&
    sessions.includes(v.session as Selection["session"]) &&
    profiles.includes(v.profile as Selection["profile"]) &&
    ["Dry slick", "Wet"].includes(v.compound as string) &&
    (v.condition !== "Dry" || v.compound === "Dry slick") &&
    (!["Light wet", "Heavy wet"].includes(v.condition as string) ||
      v.compound === "Wet")
  );
}
function selection(v: unknown, catalog: Catalog): Selection {
  if (!validSelection(v, catalog)) return fail();
  const { className, carid, trackid, condition, session, profile, compound } =
    v;
  return { className, carid, trackid, condition, session, profile, compound };
}
function context(v: unknown): SessionContext {
  if (
    !object(v) ||
    !string(v.gameVersion, 40) ||
    !["Standard", "Custom", "Unknown"].includes(v.bop as string) ||
    ![...conditions, "Unknown"].includes(v.condition as never) ||
    !["Dry", "Wet", "Unknown"].includes(v.racingLine as string) ||
    !string(v.air, 40) ||
    !string(v.track, 40) ||
    !string(v.grip, 200)
  )
    return fail();
  return {
    gameVersion: v.gameVersion,
    bop: v.bop,
    condition: v.condition,
    racingLine: v.racingLine,
    air: v.air,
    track: v.track,
    grip: v.grip,
  } as SessionContext;
}
function draft(v: unknown, version: number): PracticeDraft {
  if (!object(v) || !object(v.fuel) || !object(v.pressures)) return fail();
  if (!["laps", "duration"].includes(v.fuel.mode as string)) return fail();
  for (const key of [
    "laps",
    "minutes",
    "lapTime",
    "consumption",
    "reserve",
    "formation",
    "capacity",
  ])
    if (!string(v.fuel[key], 40)) return fail();
  for (const w of wheels) {
    const p = v.pressures[w];
    if (!object(p) || !["cold", "hot", "target"].every((k) => string(p[k], 40)))
      return fail();
  }
  for (const key of ["air", "track", "grip", "notes"])
    if (!string(v[key], key === "notes" ? 5000 : 200)) return fail();
  const base = emptyDraft();
  base.fuel = { ...v.fuel } as unknown as PracticeDraft["fuel"];
  base.pressures = Object.fromEntries(
    wheels.map((w) => [w, { ...(v.pressures as Record<string, object>)[w] }]),
  ) as PracticeDraft["pressures"];
  base.air = v.air as string;
  base.track = v.track as string;
  base.grip = v.grip as string;
  base.notes = v.notes as string;
  if (version === 1) {
    base.targetMode = "manual";
    base.targetSource = "Target manual pada data v1; sumber belum dicatat.";
    base.context = {
      ...emptyContext(),
      air: base.air,
      track: base.track,
      grip: base.grip,
    };
    base.nextContext = { ...base.context };
    return base;
  }
  if (
    !object(v.quality) ||
    !string(v.quality.lap, 40) ||
    !["stable", "incident", "comparable"].every(
      (k) => typeof (v.quality as Record<string, unknown>)[k] === "boolean",
    ) ||
    !["range", "manual"].includes(v.targetMode as string) ||
    !string(v.targetSource, 1000) ||
    !string(v.actualFuel, 40)
  )
    return fail();
  base.context = context(v.context);
  base.nextContext = context(v.nextContext);
  base.quality = {
    lap: v.quality.lap,
    stable: v.quality.stable,
    incident: v.quality.incident,
    comparable: v.quality.comparable,
  } as PracticeDraft["quality"];
  base.targetMode = v.targetMode as PracticeDraft["targetMode"];
  base.targetSource = v.targetSource;
  base.actualFuel = v.actualFuel;
  return base;
}
function sourceSnapshot(v: unknown, id: string | null): SourceSnapshot | null {
  if (v === null) return null;
  if (
    !object(v) ||
    v.id !== id ||
    !string(v.name) ||
    !string(v.creator) ||
    !string(v.version) ||
    !string(v.source, 3000) ||
    !v.source.startsWith("https://") ||
    !(v.ambient === null || numeric(v.ambient)) ||
    !(v.tracktemp === null || numeric(v.tracktemp))
  )
    return fail();
  return structuredClone(v) as unknown as SourceSnapshot;
}
function stringArray(v: unknown): boolean {
  return Array.isArray(v) && v.length <= 50 && v.every((s) => string(s, 1500));
}
function recommendation(
  v: unknown,
  d: PracticeDraft,
  legacy: boolean,
  selected: Selection,
): Recommendation | null {
  if (v === null) return legacy ? null : fail();
  if (
    !object(v) ||
    v.engineVersion !== 1 ||
    !["low", "medium"].includes(v.confidence as string) ||
    !object(v.compound) ||
    ![null, "Dry slick", "Wet"].includes(v.compound.suggested as never) ||
    !string(v.compound.reason, 1500) ||
    !["evidence", "missing", "steps"].every((k) => stringArray(v[k])) ||
    !object(v.pressures)
  )
    return fail();
  if (v.profile !== null) {
    const p = v.profile;
    if (
      !object(p) ||
      !["dhf-v19", "wet-public"].includes(p.id as string) ||
      !string(p.label) ||
      !Array.isArray(p.classes) ||
      p.classes.length > 10 ||
      !p.classes.every((c) => string(c, 40)) ||
      !["Dry slick", "Wet"].includes(p.compound as string) ||
      !string(p.model) ||
      !string(p.referenceVersion) ||
      !["historical", "public-reference"].includes(p.evidence as string) ||
      !string(p.source, 3000) ||
      !p.source.startsWith("https://") ||
      !object(p.range) ||
      p.range.min !== (p.id === "dhf-v19" ? 26 : 30) ||
      p.range.max !== (p.id === "dhf-v19" ? 27 : 31)
    )
      return fail();
  }
  if (!sameData(v.fuel, calculateFuel(d.fuel).value)) return fail();
  for (const w of wheels) {
    const p = v.pressures[w];
    if (
      !object(p) ||
      !["missing", "blocked", "keep", "adjust", "invalid"].includes(
        p.status as string,
      ) ||
      !string(p.reason, 1500) ||
      !["cold", "hot", "target", "nextCold", "deviation"].every(
        (k) => p[k] === null || numeric(p[k]),
      )
    )
      return fail();
    if (
      p.cold !== numberInput(d.pressures[w].cold) ||
      p.hot !== numberInput(d.pressures[w].hot)
    )
      return fail();
    if (p.nextCold !== null) {
      const profile = v.profile as Recommendation["profile"];
      const target =
        d.targetMode === "range" && profile && numeric(p.hot)
          ? Math.min(profile.range.max, Math.max(profile.range.min, p.hot))
          : numberInput(d.pressures[w].target);
      const suggested = compoundAdvice(
        measuredContext(d).condition,
        measuredContext(d).racingLine,
      ).suggested;
      const expected = calculatePressure({
        cold: String(p.cold),
        hot: String(p.hot),
        target: String(p.target),
      }).value;
      if (
        expected === null ||
        qualityIssues(d).length > 0 ||
        (suggested !== null && suggested !== selected.compound) ||
        (d.targetMode === "range" && !profile) ||
        (d.targetMode === "manual" &&
          (!d.targetSource.trim() ||
            (profile &&
              target !== null &&
              (target < profile.range.min || target > profile.range.max)))) ||
        p.target !== target ||
        !numeric(p.hot) ||
        !numeric(p.target) ||
        p.deviation !== Math.round(Math.abs(p.hot - p.target) * 1000) / 1000 ||
        p.status !== (p.deviation === 0 ? "keep" : "adjust") ||
        !["keep", "adjust"].includes(p.status as string) ||
        p.nextCold !== (p.deviation === 0 ? p.cold : expected)
      )
        return fail();
    } else if (["keep", "adjust"].includes(p.status as string)) return fail();
  }
  return structuredClone(v) as unknown as Recommendation;
}
function legacyResults(d: PracticeDraft): PracticeLog["results"] {
  return {
    fuel: calculateFuel(d.fuel).value,
    pressures: Object.fromEntries(
      wheels.map((w) => {
        const p = d.pressures[w],
          cold = numberInput(p.cold),
          hot = numberInput(p.hot),
          target = numberInput(p.target);
        const value =
          cold !== null &&
          hot !== null &&
          target !== null &&
          cold > 0 &&
          hot > 0 &&
          target > 0
            ? Math.round((cold + target - hot + Number.EPSILON) * 10) / 10
            : null;
        return [
          w,
          value !== null && Number.isFinite(value) && value > 0 && value <= 100
            ? value
            : null,
        ];
      }),
    ) as PracticeLog["results"]["pressures"],
  };
}
export function validateState(
  input: unknown,
  catalog: Catalog,
  version = 2,
): PersonalState {
  if (
    !object(input) ||
    !Array.isArray(input.favorites) ||
    !Array.isArray(input.logs) ||
    input.favorites.length > catalog.index.length ||
    input.logs.length > 2000
  )
    return fail();
  const favorites = input.favorites.map((v) => {
    if (
      !object(v) ||
      !string(v.id) ||
      !catalog.index.some((r) => r.id === v.id)
    )
      return fail();
    const s = selection(v.selection, catalog),
      r = catalog.index.find((r) => r.id === v.id)!;
    if (
      s.carid !== r.carid ||
      s.trackid !== r.trackid ||
      s.compound !== r.compound
    )
      return fail();
    return { id: v.id, selection: s, createdAt: date(v.createdAt) };
  });
  const logs: PracticeLog[] = input.logs.map((v) => {
    if (
      !object(v) ||
      !string(v.id, 100) ||
      !v.id ||
      !(
        (v.setupId === null && version === 2) ||
        (string(v.setupId, 100) && !!v.setupId)
      )
    )
      return fail();
    const s = selection(v.selection, catalog);
    if (v.carid !== s.carid || v.trackid !== s.trackid) return fail();
    const id = v.setupId as string | null,
      r = catalog.index.find((r) => r.id === id);
    if (
      version === 1 &&
      (!r ||
        r.carid !== s.carid ||
        r.trackid !== s.trackid ||
        r.compound !== s.compound)
    )
      return fail();
    if (
      r &&
      (r.carid !== s.carid ||
        r.trackid !== s.trackid ||
        r.compound !== s.compound)
    )
      return fail();
    const d = draft(v.draft, version);
    const legacy = version === 1 || v.legacy === true;
    if (version === 2 && typeof v.legacy !== "boolean") return fail();
    const rec =
      version === 1 ? null : recommendation(v.recommendation, d, legacy, s);
    const results = rec ? runResults(rec) : legacyResults(d);
    if (version === 2 && !sameData(v.results, results)) return fail();
    const snap = version === 1 ? null : sourceSnapshot(v.sourceSnapshot, id);
    if (version === 2 && id !== null && !r && !snap) return fail();
    if (
      version === 2 &&
      !(v.previousLogId === null || string(v.previousLogId, 100))
    )
      return fail();
    return {
      id: v.id,
      setupId: id,
      carid: s.carid,
      trackid: s.trackid,
      selection: s,
      createdAt: date(v.createdAt),
      draft: d,
      results,
      sourceSnapshot: snap,
      recommendation: rec,
      previousLogId: version === 1 ? null : (v.previousLogId as string | null),
      legacy,
    };
  });
  if (
    new Set(favorites.map((f) => f.id)).size !== favorites.length ||
    new Set(logs.map((l) => l.id)).size !== logs.length
  )
    return fail();
  return {
    lastSelection:
      input.lastSelection === null
        ? null
        : selection(input.lastSelection, catalog),
    lastContext:
      version === 1 || input.lastContext === null
        ? null
        : context(input.lastContext),
    favorites,
    logs,
  };
}
export function readPersonal(catalog: Catalog): {
  state: PersonalState;
  error: string | null;
  writable: boolean;
  migrated: boolean;
} {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw !== null) {
      const envelope: unknown = JSON.parse(raw);
      if (!object(envelope) || envelope.schemaVersion !== 2) return fail();
      return {
        state: validateState(envelope.state, catalog),
        error: null,
        writable: true,
        migrated: false,
      };
    }
    const old = localStorage.getItem(legacyStorageKey);
    return {
      state:
        old === null
          ? emptyState()
          : validateState(JSON.parse(old), catalog, 1),
      error: null,
      writable: true,
      migrated: old !== null,
    };
  } catch {
    return {
      state: emptyState(),
      error:
        "Penyimpanan browser tidak bisa dibaca atau formatnya rusak. Data lama tidak ditimpa. Pencarian tetap tersedia; ekspor perubahan baru sebagai backup.",
      writable: false,
      migrated: false,
    };
  }
}
export function writePersonal(state: PersonalState): string | null {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ schemaVersion: 2, state }),
    );
    return null;
  } catch {
    return "Gagal menyimpan di browser (ruang penuh atau akses ditolak). Perubahan ini belum tersimpan; data sebelumnya tetap ada. Ekspor backup untuk menyimpan salinan.";
  }
}
export function exportBackup(state: PersonalState): string {
  return JSON.stringify(
    {
      format: "acc-setup-personal",
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      state,
    },
    null,
    2,
  );
}
export function parseBackup(text: string, catalog: Catalog): PersonalState {
  if (text.length > 8 * 1024 * 1024)
    throw Error("Backup terlalu besar. Batas file 8 MB.");
  let v: unknown;
  try {
    v = JSON.parse(text);
  } catch {
    return fail();
  }
  if (
    !object(v) ||
    v.format !== "acc-setup-personal" ||
    ![1, 2].includes(v.schemaVersion as number)
  )
    return fail();
  return validateState(v.state, catalog, v.schemaVersion as number);
}
export function mergePersonal(
  current: PersonalState,
  incoming: PersonalState,
): PersonalState {
  return {
    lastSelection: current.lastSelection ?? incoming.lastSelection,
    lastContext: current.lastContext ?? incoming.lastContext,
    favorites: [
      ...current.favorites,
      ...incoming.favorites.filter(
        (f) => !current.favorites.some((old) => old.id === f.id),
      ),
    ],
    logs: [
      ...current.logs,
      ...incoming.logs.filter(
        (l) => !current.logs.some((old) => old.id === l.id),
      ),
    ],
  };
}
