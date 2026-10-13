import type {
  PracticeDraft,
  PracticeLog,
  PressureAdvice,
  Recommendation,
  Selection,
  SessionContext,
  SetupRecord,
  TyreProfile,
} from "../types";
import { wheels } from "../types";
import {
  calculateFuel,
  calculatePressure,
  emptyDraft,
  numberInput,
} from "./calculators";
import { contextDifferences, measuredContext } from "./context";
import { differences } from "./selection";

const slick: TyreProfile = {
  id: "dhf-v19",
  label: "Acuan slick DHF era v1.9",
  classes: ["GT3", "GT4", "CUP", "ST", "CHL"],
  compound: "Dry slick",
  model: "DHF 2023",
  referenceVersion: "1.9",
  range: { min: 26, max: 27 },
  evidence: "historical",
  source: "https://coachdaveacademy.com/announcements/1-9-acc-faq-coach-dave/",
};
const wet: TyreProfile = {
  id: "wet-public",
  label: "Acuan publik wet ACC",
  classes: ["GT3", "GT4", "CUP", "ST", "CHL"],
  compound: "Wet",
  model: "Wet ACC",
  referenceVersion: "Panduan publik v1.10",
  range: { min: 30, max: 31 },
  evidence: "public-reference",
  source:
    "https://coachdaveacademy.com/documentation/coach-dave-delta-help-centre-the-complete-faq-guide/",
};
const modernSingleMakes = [
  "porsche_992_gt3_cup",
  "lamborghini_huracan_st_evo2",
  "ferrari_488_challenge_evo",
];
export function tyreProfile(
  selection: Selection,
  context: SessionContext,
): TyreProfile | null {
  const profile = selection.compound === "Wet" ? wet : slick;
  const version = context.gameVersion.trim().replace(/^v/i, "");
  if (
    !/^1\.(9|10)(?:\.\d+)?$/.test(version) ||
    !profile.classes.includes(selection.className)
  )
    return null;
  if (
    ["CUP", "ST", "CHL"].includes(selection.className) &&
    !modernSingleMakes.includes(selection.carid)
  )
    return null;
  return structuredClone(profile);
}
export function compoundAdvice(
  condition: SessionContext["condition"],
  line: SessionContext["racingLine"],
): Recommendation["compound"] {
  if (condition === "Dry")
    return {
      suggested: "Dry slick",
      reason: "Permukaan dry: gunakan slick sebagai acuan.",
    };
  if (condition === "Light wet" || condition === "Heavy wet")
    return {
      suggested: "Wet",
      reason:
        "Permukaan basah: gunakan wet sebagai acuan dan periksa kondisi racing line.",
    };
  if (condition === "Damp" || condition === "Drying") {
    if (line === "Dry")
      return {
        suggested: "Dry slick",
        reason:
          "Racing line dilaporkan kering. Slick menjadi opsi uji; pantau bagian basah dan perubahan kondisi.",
      };
    if (line === "Wet")
      return {
        suggested: "Wet",
        reason:
          "Racing line masih basah. Wet menjadi opsi uji; pantau pengeringan lintasan.",
      };
  }
  return {
    suggested: null,
    reason:
      "Slick dan wet masih menjadi opsi. Amati racing line dan jalankan pengujian sebelum menetapkan compound.",
  };
}
export function qualityIssues(draft: PracticeDraft): string[] {
  const issues: string[] = [];
  const lap = numberInput(draft.quality.lap);
  if (lap === null || lap < 1 || !Number.isInteger(lap))
    issues.push("Isi lap pengukuran sebagai bilangan bulat positif.");
  if (!draft.quality.stable)
    issues.push("Konfirmasi tekanan sudah relatif stabil.");
  if (draft.quality.incident)
    issues.push(
      "Ulangi pengukuran setelah run bebas insiden yang memengaruhi ban.",
    );
  if (!draft.quality.comparable)
    issues.push("Konfirmasi kondisi sesi berikutnya sebanding.");
  const measured = measuredContext(draft),
    next = draft.nextContext;
  if (
    !/^1\.\d+(?:\.\d+)?$/.test(measured.gameVersion.trim()) ||
    !/^1\.\d+(?:\.\d+)?$/.test(next.gameVersion.trim())
  )
    issues.push(
      "Isi versi game yang valid saat pengukuran dan sesi berikutnya (contoh: 1.10.4).",
    );
  for (const ctx of [measured, next]) {
    if (
      (ctx.air && numberInput(ctx.air) === null) ||
      (ctx.track && numberInput(ctx.track) === null)
    )
      issues.push(
        "Suhu udara/lintasan harus angka atau dikosongkan jika belum diketahui.",
      );
  }
  if (measured.gameVersion.trim() !== next.gameVersion.trim())
    issues.push("Versi berbeda; ukur ulang pada versi sesi berikutnya.");
  if (measured.condition === "Unknown" || next.condition === "Unknown")
    issues.push("Isi kondisi permukaan saat pengukuran dan sesi berikutnya.");
  if (measured.condition !== next.condition || measured.bop !== next.bop)
    issues.push("Permukaan/BoP berubah; ukur ulang pada kondisi berikutnya.");
  return [...new Set(issues)];
}
export function pressureInputIssue(
  draft: PracticeDraft,
  selection: Selection,
  wheel: (typeof wheels)[number],
): string | null {
  const input = draft.pressures[wheel];
  for (const key of ["cold", "hot"] as const) {
    if (!input[key].trim()) continue;
    const value = numberInput(input[key]);
    if (value === null || value < 10 || value > 50)
      return "Cold/hot harus angka 10–50 psi. Ini batas kewajaran aplikasi, bukan batas slider mobil.";
  }
  if (draft.targetMode === "manual" && input.target.trim()) {
    const target = numberInput(input.target);
    if (target === null || target < 20 || target > 40)
      return "Target manual harus angka 20–40 psi. Ini batas kewajaran aplikasi, bukan batas slider mobil.";
    const profile = tyreProfile(selection, measuredContext(draft));
    if (profile && (target < profile.range.min || target > profile.range.max))
      return (
        "Target manual di luar rentang profil aktif " +
        profile.range.min +
        "–" +
        profile.range.max +
        " psi."
      );
  }
  return null;
}
export function pressureAdvice(
  draft: PracticeDraft,
  selection: Selection,
  wheel: (typeof wheels)[number],
): PressureAdvice {
  const input = draft.pressures[wheel],
    cold = numberInput(input.cold),
    hot = numberInput(input.hot);
  const result: PressureAdvice = {
    cold,
    hot,
    target: null,
    nextCold: null,
    deviation: null,
    status: "missing",
    reason: "Isi cold aktual dan hot terukur.",
  };
  const inputIssue = pressureInputIssue(draft, selection, wheel);
  if (inputIssue) return { ...result, status: "invalid", reason: inputIssue };
  if (cold === null || hot === null) return result;
  const profile = tyreProfile(selection, measuredContext(draft));
  let target = numberInput(input.target);
  if (draft.targetMode === "range") {
    if (!profile)
      return {
        ...result,
        status: "blocked",
        reason:
          "Cakupan profil belum memadai. Pilih target manual dan isi sumbernya.",
      };
    target = Math.min(profile.range.max, Math.max(profile.range.min, hot));
  } else {
    if (target === null)
      return { ...result, reason: "Isi target titik manual." };
    if (!draft.targetSource.trim())
      return {
        ...result,
        status: "blocked",
        reason: "Isi sumber/alasan target manual.",
      };
    if (profile && (target < profile.range.min || target > profile.range.max))
      return {
        ...result,
        status: "invalid",
        reason:
          "Target manual di luar rentang profil aktif " +
          profile.range.min +
          "–" +
          profile.range.max +
          " psi.",
      };
  }
  const calculated = calculatePressure({
    cold: String(cold),
    hot: String(hot),
    target: String(target),
  });
  if (!calculated.value)
    return {
      ...result,
      target,
      status: "invalid",
      reason: calculated.error || "Input tekanan tidak valid.",
    };
  const issues = qualityIssues(draft);
  const deviation = Math.round(Math.abs(hot - target) * 1000) / 1000;
  if (issues.length)
    return {
      ...result,
      target,
      deviation,
      status: "blocked",
      reason: issues.join(" "),
    };
  return {
    ...result,
    target,
    deviation,
    nextCold: deviation === 0 ? cold : calculated.value,
    status: deviation === 0 ? "keep" : "adjust",
    reason:
      deviation === 0
        ? "Hot sudah sesuai target; pertahankan cold aktual."
        : "Koreksi menuju target untuk uji pada kondisi sebanding; bukan prediksi suhu otomatis.",
  };
}
export function recommendRun(
  selection: Selection,
  draft: PracticeDraft,
  source: SetupRecord | null = null,
): Recommendation {
  const context = measuredContext(draft),
    profile = tyreProfile(selection, context);
  const compound = compoundAdvice(context.condition, context.racingLine);
  const missing = qualityIssues(draft);
  const evidence: string[] = [];
  if (profile)
    evidence.push(
      profile.label +
        ": " +
        profile.range.min +
        "–" +
        profile.range.max +
        " psi hot. Belum terverifikasi untuk seluruh mobil/patch.",
    );
  else
    missing.push(
      "Profil ban belum mencakup kelas/model/versi ini; gunakan target manual beserta sumbernya.",
    );
  if (context.bop === "Unknown") missing.push("BoP pengguna belum diketahui.");
  if (!context.air || !context.track)
    missing.push("Suhu udara/lintasan belum lengkap.");
  if (!context.grip) missing.push("Grip lintasan belum diketahui.");
  if (!draft.actualFuel.trim()) missing.push("Fuel aktual run belum dicatat.");
  if (compound.suggested && compound.suggested !== selection.compound)
    missing.push(
      "Compound pilihan berbeda dari acuan kondisi; tinjau pilihan sebelum mengoreksi tekanan.",
    );
  if (source) {
    missing.push(
      ...differences(source, selection).map(
        (difference) => difference + "; belum diuji pada pilihan ini.",
      ),
    );
    for (const [label, value] of [
      ["kondisi", source.condition],
      ["sesi", source.session],
      ["karakter", source.profile],
      ["grip", source.grip],
    ])
      if (!value || value === "Tidak disebut")
        missing.push("Metadata " + label + " sumber belum diketahui.");
    if (source.ambient === null || source.tracktemp === null)
      missing.push(
        "Suhu udara/lintasan sumber belum lengkap; kedekatan suhu belum dapat dinilai penuh.",
      );
    evidence.push(
      "Acuan " +
        source.id +
        " · versi " +
        source.version +
        " · udara/lintasan " +
        (source.ambient ?? "—") +
        "/" +
        (source.tracktemp ?? "—") +
        " °C.",
    );
    if (
      !source.compatibleVerified ||
      source.version !== context.gameVersion ||
      context.bop !== "Standard"
    )
      missing.push(
        "Kesesuaian patch/BoP sumber belum terverifikasi untuk sesi ini.",
      );
  } else
    evidence.push("Menggunakan setting aktual setup bawaan/milik sendiri.");
  const pressures = Object.fromEntries(
    wheels.map((wheel) => {
      const advice = pressureAdvice(draft, selection, wheel);
      return [
        wheel,
        compound.suggested &&
        compound.suggested !== selection.compound &&
        advice.status !== "invalid"
          ? {
              ...advice,
              nextCold: null,
              status: "blocked",
              reason: "Tinjau compound yang berbeda dari acuan kondisi.",
            }
          : advice,
      ];
    }),
  ) as Recommendation["pressures"];
  for (const wheel of wheels) {
    const advice = pressures[wheel];
    if (["missing", "invalid"].includes(advice.status))
      missing.push(wheel + ": " + advice.reason);
  }
  const ready = wheels.every((w) => pressures[w].nextCold !== null);
  return {
    engineVersion: 1,
    confidence: ready && missing.length === 0 ? "medium" : "low",
    compound,
    profile,
    evidence,
    missing: [...new Set(missing)],
    steps: [
      "Catat tekanan cold dan fuel yang benar-benar dipakai.",
      "Jalankan lap bersih hingga tekanan relatif stabil; catat lap, hot, dan kondisi.",
      "Konfirmasi kondisi berikutnya sebanding, lalu uji koreksi satu run.",
      "Bandingkan deviasi tekanan terhadap target; waktu lap tidak dinilai oleh app.",
    ],
    fuel: calculateFuel(draft.fuel).value,
    pressures,
  };
}
export function runResults(recommendation: Recommendation) {
  return {
    fuel: recommendation.fuel,
    pressures: Object.fromEntries(
      wheels.map((w) => [w, recommendation.pressures[w].nextCold]),
    ) as Record<(typeof wheels)[number], number | null>,
  };
}
export function draftFromSource(
  context: SessionContext,
  source: SetupRecord | null,
): PracticeDraft {
  const draft = emptyDraft(context);
  draft.air = context.air;
  draft.track = context.track;
  draft.grip = context.grip;
  if (source) {
    for (const wheel of wheels) {
      const setting = source.settings["pressure" + wheel];
      if (setting?.status === "available" && typeof setting.value === "number")
        draft.pressures[wheel].cold = String(setting.value);
    }
    const fuel = source.settings.fuel;
    if (fuel?.status === "available") draft.actualFuel = String(fuel.value);
  }
  return draft;
}
export function nextRunDraft(log: PracticeLog): PracticeDraft {
  const draft = emptyDraft(log.draft.nextContext);
  draft.air = draft.context.air;
  draft.track = draft.context.track;
  draft.grip = draft.context.grip;
  draft.targetMode = log.draft.targetMode;
  draft.targetSource = log.draft.targetSource;
  draft.fuel = { ...log.draft.fuel };
  draft.actualFuel = log.draft.actualFuel;
  for (const wheel of wheels) {
    draft.pressures[wheel] = {
      cold: String(
        log.results.pressures[wheel] ?? log.draft.pressures[wheel].cold,
      ),
      hot: "",
      target: log.draft.pressures[wheel].target,
    };
  }
  return draft;
}
export function compareRuns(a: PracticeLog, b: PracticeLog) {
  const ca = measuredContext(a.draft),
    cb = measuredContext(b.draft);
  const comparable =
    a.carid === b.carid &&
    a.trackid === b.trackid &&
    a.selection.compound === b.selection.compound &&
    ca.gameVersion !== "Unknown" &&
    ca.gameVersion === cb.gameVersion;
  const changes = contextDifferences(ca, cb);
  const values = wheels.map((wheel) => {
    const x = a.recommendation?.pressures[wheel],
      y = b.recommendation?.pressures[wheel];
    const sameTarget =
      a.draft.targetMode === b.draft.targetMode &&
      (a.draft.targetMode === "range"
        ? !!a.recommendation?.profile &&
          a.recommendation.profile.id === b.recommendation?.profile?.id &&
          a.recommendation.profile.range.min ===
            b.recommendation.profile.range.min &&
          a.recommendation.profile.range.max ===
            b.recommendation.profile.range.max
        : numberInput(a.draft.pressures[wheel].target) ===
          numberInput(b.draft.pressures[wheel].target));
    const valid =
      comparable &&
      sameTarget &&
      !qualityIssues(a.draft).length &&
      !qualityIssues(b.draft).length &&
      x?.deviation !== null &&
      x?.deviation !== undefined &&
      y?.deviation !== null &&
      y?.deviation !== undefined &&
      ["keep", "adjust"].includes(x.status) &&
      ["keep", "adjust"].includes(y.status);
    return {
      wheel,
      before: x?.deviation ?? null,
      after: y?.deviation ?? null,
      improvement: valid
        ? Math.round((x!.deviation! - y!.deviation!) * 1000) / 1000
        : null,
    };
  });
  return { comparable, changes, values };
}
