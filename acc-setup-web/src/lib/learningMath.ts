import { numberInput, type Calculation } from "./calculators";

export function springForce(
  rateNPerMm: string,
  compressionMm: string,
): Calculation<number> {
  const k = numberInput(rateNPerMm),
    x = numberInput(compressionMm);
  if (k === null || x === null || k <= 0 || x < 0 || k > 1000 || x > 100)
    return {
      value: null,
      error:
        "Isi kekakuan > 0–1.000 N/mm dan kompresi 0–100 mm untuk model belajar.",
    };
  return { value: k * x, error: null };
}
export function damperForce(
  coefficient: string,
  speed: string,
): Calculation<number> {
  const c = numberInput(coefficient),
    v = numberInput(speed);
  if (c === null || v === null || c <= 0 || c > 50000 || v < 0 || v > 2)
    return {
      value: null,
      error: "Isi c > 0–50.000 N·s/m dan besar kecepatan 0–2 m/s.",
    };
  return { value: c * v, error: null };
}
export function aeroForce(
  speedKmH: string,
): Calculation<{ force: number; ratio: number; metersPerSecond: number }> {
  const speed = numberInput(speedKmH);
  if (speed === null || speed < 0 || speed > 400)
    return {
      value: null,
      error: "Isi kecepatan 0–400 km/jam untuk model belajar.",
    };
  const ratio = (speed / 100) ** 2;
  return {
    value: { force: 1000 * ratio, ratio, metersPerSecond: speed / 3.6 },
    error: null,
  };
}
export function steeringAngle(
  wheelAngle: string,
  ratio: string,
): Calculation<number> {
  const angle = numberInput(wheelAngle),
    r = numberInput(ratio);
  if (
    angle === null ||
    r === null ||
    r <= 0 ||
    Math.abs(angle) > 1080 ||
    r > 50
  )
    return { value: null, error: "Isi sudut setir ±1.080° dan rasio > 0–50." };
  return { value: angle / r, error: null };
}
export function rakeDifference(
  frontMm: string,
  rearMm: string,
): Calculation<number> {
  const front = numberInput(frontMm),
    rear = numberInput(rearMm);
  if (
    front === null ||
    rear === null ||
    front < 0 ||
    rear < 0 ||
    front > 200 ||
    rear > 200
  )
    return {
      value: null,
      error:
        "Isi tinggi depan/belakang 0–200 mm untuk ilustrasi, bukan batas slider ACC.",
    };
  return { value: rear - front, error: null };
}
