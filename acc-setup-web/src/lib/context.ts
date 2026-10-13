import type { PracticeDraft, SessionContext } from "../types";

export function emptyContext(
  gameVersion = "Unknown",
  condition: SessionContext["condition"] = "Unknown",
): SessionContext {
  return {
    gameVersion,
    condition,
    bop: "Unknown",
    air: "",
    track: "",
    grip: "",
    racingLine: "Unknown",
  };
}

export function measuredContext(draft: PracticeDraft): SessionContext {
  return {
    ...draft.context,
    air: draft.air,
    track: draft.track,
    grip: draft.grip,
  };
}

export function contextDifferences(
  a: SessionContext,
  b: SessionContext,
): string[] {
  const labels: Record<keyof SessionContext, string> = {
    gameVersion: "Versi",
    bop: "BoP",
    air: "Udara",
    track: "Lintasan",
    grip: "Grip",
    condition: "Permukaan",
    racingLine: "Racing line",
  };
  return (Object.keys(labels) as (keyof SessionContext)[])
    .filter((key) => a[key] !== b[key])
    .map(
      (key) =>
        labels[key] +
        ": " +
        (a[key] || "tidak diketahui") +
        " → " +
        (b[key] || "tidak diketahui"),
    );
}
