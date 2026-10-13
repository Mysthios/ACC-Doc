import type {
  Catalog,
  Selection,
  SessionContext,
  SetupRecord,
  Setting,
} from "../types";
import { numberInput } from "./calculators";

export const classLabels: Record<string, string> = {
  GT3: "GT3",
  GT4: "GT4",
  GT2: "GT2",
  CUP: "Cup",
  ST: "Super Trofeo",
  CHL: "Ferrari Challenge",
  TCX: "TCX",
};
export const classOrder = ["GT3", "GT4", "GT2", "CUP", "ST", "CHL", "TCX"];
export function defaultSelection(catalog: Catalog): Selection {
  return {
    className: "GT3",
    carid:
      catalog.cars.find((c) => c.id === "ferrari_296_gt3")?.id ??
      catalog.cars[0].id,
    trackid: "barcelona",
    condition: "Dry",
    session: "Sprint race",
    profile: "Stabil",
    compound: "Dry slick",
  };
}
export function versionScore(version: string): number {
  const match = version.match(/(?:^|v)(\d+)\.(\d+)(?:\.(\d+))?/i);
  return match
    ? Number(match[1]) * 1e6 + Number(match[2]) * 1e3 + Number(match[3] ?? 0)
    : 0;
}
export function compatibilityScore(
  r: SetupRecord,
  context: SessionContext,
): number {
  if (context.bop !== "Standard") return 0;
  if (r.version === context.gameVersion) return r.compatibleVerified ? 3 : 2;
  return r.version === "Tidak disebut" ? 1 : 0;
}
function temperatureDistance(r: SetupRecord, context: SessionContext): number {
  const requested = [
    [numberInput(context.air), r.ambient],
    [numberInput(context.track), r.tracktemp],
  ];
  let distance = 0;
  for (const [expected, actual] of requested) {
    if (expected === null) continue;
    if (actual === null) return Infinity;
    distance += Math.abs(expected - actual);
  }
  return distance;
}
export function compareSetups(
  a: SetupRecord,
  b: SetupRecord,
  context?: SessionContext,
  selection?: Selection,
): number {
  if (context && selection) {
    const ta = temperatureDistance(a, context),
      tb = temperatureDistance(b, context);
    return (
      compatibilityScore(b, context) - compatibilityScore(a, context) ||
      differences(a, selection).length - differences(b, selection).length ||
      (ta === tb ? 0 : ta < tb ? -1 : 1) ||
      b.known - a.known ||
      a.id.localeCompare(b.id)
    );
  }
  return (
    Number(b.compatibleVerified) - Number(a.compatibleVerified) ||
    b.known - a.known ||
    versionScore(b.version) - versionScore(a.version) ||
    a.id.localeCompare(b.id)
  );
}
export function sameBase(r: SetupRecord, s: Selection): boolean {
  return (
    r.scope === "Spesifik sirkuit" &&
    r.carid === s.carid &&
    r.trackid === s.trackid &&
    r.compound === s.compound
  );
}
export function differences(r: SetupRecord, s: Selection): string[] {
  return (
    [
      ["Kondisi", r.condition, s.condition],
      ["Sesi", r.session, s.session],
      ["Karakter", r.profile, s.profile],
    ] as const
  )
    .filter(([, actual, requested]) => actual !== requested)
    .map(
      ([label, actual, requested]) =>
        `${label}: sumber ${actual}; pilihan ${requested}`,
    );
}
export function findSetups(
  records: SetupRecord[],
  selection: Selection,
  context?: SessionContext,
) {
  const compare = (a: SetupRecord, b: SetupRecord) =>
    compareSetups(a, b, context, selection);
  const base = records.filter((r) => sameBase(r, selection));
  const exact = base
    .filter((r) => differences(r, selection).length === 0)
    .sort(compare);
  const alternatives = base
    .filter((r) => differences(r, selection).length > 0)
    .sort((a, b) =>
      context
        ? compare(a, b)
        : differences(a, selection).length - differences(b, selection).length ||
          compare(a, b),
    );
  return { exact, alternatives };
}
export function displaySetting(setting: Setting | undefined): string {
  if (!setting || setting.status === "missing") return "Data sumber kosong";
  if (setting.status === "unverified") return "Konversi belum terverifikasi";
  if (setting.status === "notApplicable")
    return `Tidak berlaku · ${setting.detail.replace("n/a ", "")}`;
  return typeof setting.value === "number"
    ? new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 }).format(
        setting.value,
      )
    : setting.value;
}
export function copySummary(
  r: SetupRecord,
  catalog: Catalog,
  selection?: Selection,
): string {
  const lines = [
    `ACC Setup · ${r.id}`,
    `${r.car} | ${r.track}`,
    `Sumber: ${r.creator} · ${r.name}`,
    `Metadata sumber: ${r.condition} | ${r.session} | ${r.profile} | ${r.compound}`,
    `Versi: ${r.version} · ${r.compat}`,
    `BoP: ${r.bop}`,
  ];
  if (selection)
    lines.push(
      `Pilihan: ${selection.condition} | ${selection.session} | ${selection.profile}`,
      ...differences(r, selection),
    );
  let group = "";
  for (const p of catalog.parameters) {
    if (group !== p.group) {
      group = p.group;
      lines.push(`\n${group}`);
    }
    const v = r.settings[p.key];
    const unit =
      v?.status === "available" && typeof v.value === "number"
        ? ` ${p.unit}`
        : "";
    lines.push(`${p.label}: ${displaySetting(v)}${unit}`);
  }
  lines.push(
    "\nPit templates bukan pit stop aktif. Kelengkapan data bukan validasi berkendara.",
    r.source,
  );
  return lines.join("\n");
}
