import {
  wheels,
  type FuelInput,
  type FuelResult,
  type PracticeDraft,
  type PressureInput,
} from "../types";
import { emptyContext } from "./context";
import type { SessionContext } from "../types";

export type Calculation<T> =
  { value: T; error: null } | { value: null; error: string };
export function numberInput(text: string): number | null {
  const normalized = text.trim().replace(",", ".");
  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const result = Number(normalized);
  return Number.isFinite(result) ? result : null;
}
export function lapSeconds(text: string): number | null {
  const trimmed = text.trim();
  if (!trimmed.includes(":")) return numberInput(trimmed);
  const parts = trimmed.split(":");
  if (parts.length !== 2 || !/^\d+$/.test(parts[0])) return null;
  const seconds = numberInput(parts[1]);
  return seconds !== null && seconds >= 0 && seconds < 60
    ? Number(parts[0]) * 60 + seconds
    : null;
}
export function calculateFuel(input: FuelInput): Calculation<FuelResult> {
  const consumption = numberInput(input.consumption),
    reserve = numberInput(input.reserve),
    formation = numberInput(input.formation);
  if (consumption === null || consumption <= 0)
    return { value: null, error: "Isi konsumsi aktual lebih dari 0 L/lap." };
  if (reserve === null || reserve < 0 || !Number.isInteger(reserve))
    return {
      value: null,
      error: "Lap cadangan harus bilangan bulat 0 atau lebih.",
    };
  if (formation === null || formation < 0)
    return { value: null, error: "Formation fuel harus 0 L atau lebih." };
  let laps: number;
  if (input.mode === "duration") {
    const minutes = numberInput(input.minutes),
      seconds = lapSeconds(input.lapTime);
    if (minutes === null || minutes <= 0)
      return {
        value: null,
        error: "Isi durasi race/stint lebih dari 0 menit.",
      };
    if (seconds === null || seconds <= 0)
      return {
        value: null,
        error: "Isi lap time lebih dari 0, dalam detik atau menit:detik.",
      };
    laps = Math.ceil((minutes * 60) / seconds);
  } else {
    const requested = numberInput(input.laps);
    if (requested === null || requested <= 0 || !Number.isInteger(requested))
      return {
        value: null,
        error: "Jumlah lap harus bilangan bulat lebih dari 0.",
      };
    laps = requested;
  }
  const capacity =
    input.capacity.trim() === "" ? null : numberInput(input.capacity);
  if (input.capacity.trim() !== "" && (capacity === null || capacity <= 0))
    return {
      value: null,
      error: "Kapasitas tangki harus lebih dari 0 L atau dikosongkan.",
    };
  const exact =
    Math.round(((laps + reserve) * consumption + formation) * 1e9) / 1e9;
  const prepared = Math.ceil(exact);
  if (!Number.isSafeInteger(laps) || !Number.isSafeInteger(prepared))
    return { value: null, error: "Nilai terlalu besar untuk dihitung." };
  return {
    value: {
      laps,
      exact,
      prepared,
      capacity,
      exceeds: capacity !== null && prepared > capacity,
    },
    error: null,
  };
}
export function calculatePressure(input: PressureInput): Calculation<number> {
  const cold = numberInput(input.cold),
    hot = numberInput(input.hot),
    target = numberInput(input.target);
  if (
    cold === null ||
    hot === null ||
    target === null ||
    cold < 10 ||
    cold > 50 ||
    hot < 10 ||
    hot > 50 ||
    target < 20 ||
    target > 40
  )
    return {
      value: null,
      error:
        "Cold/hot harus 10–50 psi dan target 20–40 psi. Ini batas kewajaran aplikasi, bukan batas slider mobil.",
    };
  const value = Math.round((cold + target - hot + Number.EPSILON) * 10) / 10;
  if (!Number.isFinite(value) || value < 10 || value > 50)
    return {
      value: null,
      error: "Hasil tidak wajar; periksa kembali input tekanan.",
    };
  return { value, error: null };
}
export function emptyDraft(
  context: SessionContext = emptyContext(),
): PracticeDraft {
  return {
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
    pressures: {
      FL: { cold: "", hot: "", target: "" },
      FR: { cold: "", hot: "", target: "" },
      RL: { cold: "", hot: "", target: "" },
      RR: { cold: "", hot: "", target: "" },
    },
    air: "",
    track: "",
    grip: "",
    notes: "",
    context: { ...context },
    nextContext: { ...context },
    quality: { lap: "", stable: false, incident: false, comparable: false },
    targetMode: "range",
    targetSource: "",
    actualFuel: "",
  };
}
export function practiceResults(draft: PracticeDraft) {
  return {
    fuel: calculateFuel(draft.fuel).value,
    pressures: Object.fromEntries(
      wheels.map((w) => [w, calculatePressure(draft.pressures[w]).value]),
    ) as Record<(typeof wheels)[number], number | null>,
  };
}
