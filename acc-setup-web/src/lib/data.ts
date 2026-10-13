import type { Catalog, SetupRecord } from "../types";

async function getJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw Error(`Data gagal dimuat (HTTP ${response.status}).`);
  return response.json();
}
export async function loadCatalog(signal?: AbortSignal): Promise<Catalog> {
  const value = (await getJson("/data/catalog.json", signal)) as Catalog;
  if (
    value.schemaVersion !== 1 ||
    !Array.isArray(value.cars) ||
    !Array.isArray(value.index) ||
    value.index.length !== value.counts.records
  )
    throw Error("Format katalog tidak valid. Jalankan npm run prepare:data.");
  return value;
}
const cache = new Map<string, SetupRecord[]>();
export async function loadCar(
  carid: string,
  catalog: Catalog,
  signal?: AbortSignal,
): Promise<SetupRecord[]> {
  if (!catalog.cars.some((c) => c.id === carid))
    throw Error("Mobil tidak ada di katalog.");
  if (cache.has(carid)) return cache.get(carid)!;
  const records = await getJson(`/data/cars/${carid}.json`, signal);
  if (
    !Array.isArray(records) ||
    records.length !== catalog.index.filter((r) => r.carid === carid).length ||
    !records.every(
      (r) =>
        r.carid === carid &&
        r.settings &&
        catalog.index.some((s) => s.id === r.id),
    )
  )
    throw Error("File data mobil tidak sesuai katalog.");
  cache.set(carid, records);
  return records;
}
