import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import {
  learningModules,
  learningSources,
  learningTopics,
  experimentIds,
  visualIds,
  topicById,
  topicForParameter,
  searchLearning,
  readLearningHash,
} from "../src/lib/learning";
import {
  springForce,
  damperForce,
  aeroForce,
  steeringAngle,
  rakeDifference,
} from "../src/lib/learningMath";
import { calculateFuel, emptyDraft } from "../src/lib/calculators";
import { emptyContext } from "../src/lib/context";
import { pressureAdvice } from "../src/lib/recommendations";
import type { Catalog, Selection } from "../src/types";

const catalog = JSON.parse(
  readFileSync("public/data/catalog.json", "utf8"),
) as Catalog;
describe("integritas kurikulum lokal", () => {
  test("seluruh 68 parameter punya tepat satu pelajaran dan dapat dicari lewat label ACC", () => {
    expect(catalog.parameters).toHaveLength(68);
    for (const p of catalog.parameters) {
      expect(
        learningTopics.filter((t) => t.parameterKeys.includes(p.key)),
        p.key,
      ).toHaveLength(1);
      expect(
        searchLearning(p.label).map((t) => t.id),
        p.label,
      ).toContain(topicForParameter(p.key)!.id);
    }
  });
  test("38 topik lengkap, ID unik, sumber/relasi/visual terhubung dan tujuh eksperimen tersedia", () => {
    expect(learningTopics).toHaveLength(38);
    for (const list of [learningModules, learningSources, learningTopics])
      expect(new Set(list.map((t) => t.id)).size).toBe(list.length);
    expect(
      new Set(learningTopics.map((t) => t.experiment).filter(Boolean)),
    ).toEqual(new Set(experimentIds));
    for (const t of learningTopics) {
      expect(learningModules.some((m) => m.id === t.moduleId)).toBe(true);
      for (const key of [
        "definition",
        "increase",
        "decrease",
        "condition",
        "scenario",
        "example",
        "technical",
        "limitation",
      ] as const)
        expect(t[key].length, t.id + ":" + key).toBeGreaterThan(25);
      expect(t.checklist.length).toBeGreaterThanOrEqual(3);
      expect(t.aliases.length).toBeGreaterThan(0);
      expect(visualIds).toContain(t.visual);
      for (const id of t.sourceIds)
        expect(learningSources.some((s) => s.id === id)).toBe(true);
      for (const id of t.relatedIds) expect(topicById(id)).toBeDefined();
      if (t.experiment) expect(experimentIds).toContain(t.experiment);
    }
    for (const s of learningSources)
      expect(new URL(s.url).protocol).toBe("https:");
  });
  test("alias Indonesia/Inggris, pencarian multi kata dan route tidak dikenal", () => {
    expect(searchLearning("sudut roda").map((t) => t.id)).toContain("camber");
    expect(searchLearning("cold psi").map((t) => t.id)).toContain("tekanan");
    expect(searchLearning(" TC2 ").map((t) => t.id)).toContain("tc2");
    expect(searchLearning("tidak-ada-istilah-ini")).toHaveLength(0);
    expect(readLearningHash("#belajar/camber")).toEqual({
      active: true,
      topicId: "camber",
    });
    for (const h of ["#belajar/tidak-ada", "#belajar/%E0%A4%A", "#belajar"])
      expect(readLearningHash(h)).toEqual({ active: true, topicId: null });
    expect(readLearningHash("#main").active).toBe(false);
  });
});
describe("contoh dan batas model belajar", () => {
  test("satuan per, damper, rasio, rake dan hubungan kuadrat aero", () => {
    expect(springForce("100", "10").value).toBe(1000);
    expect(springForce("100,5", "0").value).toBe(0);
    expect(damperForce("4000", "0,1").value).toBe(400);
    expect(damperForce("4000", "0").value).toBe(0);
    expect(steeringAngle("140", "14").value).toBe(10);
    expect(rakeDifference("55", "70").value).toBe(15);
    expect(rakeDifference("70", "55").value).toBe(-15);
    expect(aeroForce("100").value!.force).toBe(1000);
    expect(aeroForce("200").value!.force).toBe(4000);
    expect(aeroForce("0").value!.force).toBe(0);
    expect(aeroForce("36").value!.metersPerSecond).toBe(10);
  });
  test("model menolak input kosong, negatif, nonfinite dan batas yang tidak masuk akal", () => {
    for (const s of ["", "abc", "Infinity", "1e999", "-1"]) {
      expect(springForce(s, "10").value).toBeNull();
      expect(damperForce(s, "0.1").value).toBeNull();
      expect(aeroForce(s).value).toBeNull();
    }
    expect(steeringAngle("140", "0").value).toBeNull();
    expect(rakeDifference("201", "70").value).toBeNull();
    expect(springForce("100", "-1").value).toBeNull();
    expect(damperForce("4000", "-0.1").value).toBeNull();
  });
  test("contoh fuel memakai kalkulator app: 54,2 dan 55 liter", () => {
    const f = calculateFuel({
      mode: "duration",
      laps: "18",
      minutes: "30",
      lapTime: "1:45",
      consumption: "2,8",
      reserve: "1",
      formation: "1",
      capacity: "50",
    });
    expect(f.value).toMatchObject({
      laps: 18,
      exact: 54.2,
      prepared: 55,
      exceeds: true,
    });
  });
  test("contoh tekanan memakai aturan app: rentang, titik, pembulatan dan kelayakan", () => {
    const selection: Selection = {
      className: "GT3",
      carid: "ferrari_296_gt3",
      trackid: "barcelona",
      condition: "Dry",
      session: "Practice",
      profile: "Stabil",
      compound: "Dry slick",
    };
    const d = emptyDraft(emptyContext("1.10.4", "Dry"));
    d.quality = { lap: "5", stable: true, incident: false, comparable: true };
    d.pressures.FL = { cold: "23,8", hot: "27,5", target: "27" };
    expect(pressureAdvice(d, selection, "FL").nextCold).toBe(23.3);
    d.pressures.FL.hot = "26.6";
    expect(pressureAdvice(d, selection, "FL")).toMatchObject({
      status: "keep",
      nextCold: 23.8,
    });
    d.targetMode = "manual";
    d.targetSource = "Contoh";
    d.pressures.FL.hot = "27.44";
    expect(pressureAdvice(d, selection, "FL").nextCold).toBe(23.4);
    d.pressures.FL.target = "60";
    expect(pressureAdvice(d, selection, "FL").status).toBe("invalid");
    d.pressures.FL.target = "27";
    d.quality.stable = false;
    expect(pressureAdvice(d, selection, "FL").nextCold).toBeNull();
    d.quality.stable = true;
    d.quality.incident = true;
    expect(pressureAdvice(d, selection, "FL").nextCold).toBeNull();
    d.quality.incident = false;
    d.nextContext.condition = "Heavy wet";
    expect(pressureAdvice(d, selection, "FL").nextCold).toBeNull();
  });
});
