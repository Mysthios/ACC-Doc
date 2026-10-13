import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../", import.meta.url));
const text = await readFile(`${root}data/source-snapshot.json`, "utf8");
const source = JSON.parse(text);
const ids = new Set();
const carIds = new Set(source.cars.map((c) => c.id));
const trackIds = new Set(source.tracks.map((t) => t.id));
if (
  carIds.size !== 54 ||
  trackIds.size !== 25 ||
  source.records.length !== 1602
)
  throw Error("Cakupan snapshot berubah; tinjau katalog sebelum membangun.");
const rename = (c) =>
  c.id === "mercedes_amg_gt3_evo"
    ? { ...c, name: "Mercedes-AMG GT3 Evo 2020" }
    : c;
const cars = source.cars.map(rename).map(({ mapfile, ...c }) => c);
const carNames = Object.fromEntries(cars.map((c) => [c.id, c.name]));
const parameters = source.params.map(({ key, group, label, unit }) => ({
  key,
  group,
  label,
  unit,
}));
parameters.find((p) => p.key === "nPitStops").label =
  "Pit stops aktif tersimpan";
parameters.find((p) => p.key === "pitStrategy").label =
  "Pit strategy templates";
function value(v) {
  if (v === null || v === undefined || v === "" || v === "Belum tersedia")
    return { status: "missing" };
  if (typeof v === "string" && v.startsWith("n/a"))
    return { status: "notApplicable", detail: v };
  if (v === "Konversi belum terverifikasi") return { status: "unverified" };
  if (typeof v === "number" && !Number.isFinite(v))
    throw Error("Angka tidak valid");
  return { status: "available", value: v };
}
const records = source.records.map((r) => {
  if (
    ids.has(r.id) ||
    !carIds.has(r.carid) ||
    !trackIds.has(r.trackid) ||
    r.values.length !== parameters.length
  )
    throw Error(`Record tidak valid: ${r.id}`);
  ids.add(r.id);
  for (const k of ["source", "creatorSource", "mappingSource"])
    if (r[k] && !r[k].startsWith("https://"))
      throw Error(`URL tidak valid ${r.id}`);
  const { raw, key, values, ...metadata } = r;
  const settings = Object.fromEntries(
    parameters.map((p, i) => [p.key, value(values[i])]),
  );
  // Slots JSON dapat tersimpan walau nPitStops=0. Jangan tampilkan sebagai rencana pit aktif.
  if (settings.pitStrategy.status === "available")
    settings.pitStrategy.value = String(settings.pitStrategy.value).replace(
      /Stop (\d+):/g,
      "Template $1:",
    );
  return {
    ...metadata,
    car: carNames[r.carid],
    compound: values[0],
    compatibleVerified: false,
    settings,
  };
});
const counts = {
  cars: cars.length,
  tracks: source.tracks.length,
  records: records.length,
  specific: records.filter((r) => r.scope === "Spesifik sirkuit").length,
  baseline: records.filter((r) => r.scope === "Baseline").length,
  archive: records.filter((r) => r.scope === "Arsip LFM Sprint").length,
  pairs: new Set(
    records
      .filter((r) => r.scope === "Spesifik sirkuit")
      .map((r) => `${r.carid}|${r.trackid}`),
  ).size,
};
const coverage = Object.fromEntries(
  cars.map((c) => [
    c.id,
    Object.fromEntries(
      source.tracks.map((t) => [
        t.id,
        records.filter(
          (r) =>
            r.carid === c.id &&
            r.trackid === t.id &&
            r.scope === "Spesifik sirkuit",
        ).length,
      ]),
    ),
  ]),
);
const index = records.map(
  ({
    id,
    carid,
    car,
    trackid,
    track,
    name,
    creator,
    scope,
    condition,
    session,
    profile,
    compound,
    known,
    version,
  }) => ({
    id,
    carid,
    car,
    trackid,
    track,
    name,
    creator,
    scope,
    condition,
    session,
    profile,
    compound,
    known,
    version,
  }),
);
await rm(`${root}public/data/cars`, { recursive: true, force: true });
await mkdir(`${root}public/data/cars`, { recursive: true });
for (const c of cars)
  await writeFile(
    `${root}public/data/cars/${c.id}.json`,
    JSON.stringify(records.filter((r) => r.carid === c.id)),
  );
const catalog = {
  schemaVersion: 1,
  referenceVersion: "1.10.4",
  checked: "2026-10-01",
  snapshotSha256: createHash("sha256").update(text).digest("hex"),
  repositoryCommit: source.repositoryCommit,
  mappingCommit: source.mappingCommit,
  cars,
  tracks: source.tracks,
  parameters,
  counts,
  coverage,
  index,
  excludedCount: source.exclusions.length,
};
await writeFile(`${root}public/data/catalog.json`, JSON.stringify(catalog));
console.log(
  `Data siap: ${counts.cars} mobil, ${counts.tracks} sirkuit, ${counts.records} setup; ${counts.pairs}/1350 pasangan dengan data spesifik.`,
);
