export const conditions = [
  "Dry",
  "Damp",
  "Light wet",
  "Heavy wet",
  "Drying",
] as const;
export const sessions = [
  "Practice",
  "Qualifying",
  "Sprint race",
  "Endurance",
] as const;
export const profiles = ["Stabil", "Pace / hotlap", "Agresif"] as const;
export type Compound = "Dry slick" | "Wet";
export interface SessionContext {
  gameVersion: string;
  bop: "Standard" | "Custom" | "Unknown";
  air: string;
  track: string;
  grip: string;
  condition: (typeof conditions)[number] | "Unknown";
  racingLine: "Dry" | "Wet" | "Unknown";
}
export interface TyreProfile {
  id: string;
  label: string;
  classes: string[];
  compound: Compound;
  model: string;
  referenceVersion: string;
  range: { min: number; max: number };
  evidence: "historical" | "public-reference";
  source: string;
}
export interface PressureAdvice {
  cold: number | null;
  hot: number | null;
  target: number | null;
  nextCold: number | null;
  deviation: number | null;
  status: "missing" | "blocked" | "keep" | "adjust" | "invalid";
  reason: string;
}
export interface Recommendation {
  engineVersion: 1;
  confidence: "low" | "medium";
  compound: { suggested: Compound | null; reason: string };
  profile: TyreProfile | null;
  evidence: string[];
  missing: string[];
  steps: string[];
  fuel: FuelResult | null;
  pressures: Record<Wheel, PressureAdvice>;
}
export interface SourceSnapshot {
  id: string;
  name: string;
  creator: string;
  version: string;
  ambient: number | null;
  tracktemp: number | null;
  source: string;
}
export interface Selection {
  className: string;
  carid: string;
  trackid: string;
  condition: (typeof conditions)[number];
  session: (typeof sessions)[number];
  profile: (typeof profiles)[number];
  compound: Compound;
}
export interface Car {
  id: string;
  name: string;
  class: string;
  dlc: string;
  source: string;
}
export interface Track {
  id: string;
  name: string;
  dlc: string;
  source: string;
}
export interface Parameter {
  key: string;
  group: string;
  label: string;
  unit: string;
}
export type Setting =
  | { status: "available"; value: number | string }
  | { status: "notApplicable"; detail: string }
  | { status: "missing" }
  | { status: "unverified" };
export interface SetupSummary {
  id: string;
  carid: string;
  car: string;
  trackid: string;
  track: string;
  name: string;
  creator: string;
  scope: string;
  condition: string;
  session: string;
  profile: string;
  compound: string;
  known: number;
  version: string;
}
export interface SetupRecord extends SetupSummary {
  className: string;
  total: number;
  status: string;
  compatibleVerified: boolean;
  compat: string;
  bop: string;
  ambient: number | null;
  tracktemp: number | null;
  grip: string;
  laptime: number | string | null;
  source: string;
  creatorSource: string;
  mappingSource: string;
  checked: string;
  note: string;
  path: string;
  settings: Record<string, Setting>;
}
export interface Catalog {
  schemaVersion: number;
  referenceVersion: string;
  checked: string;
  snapshotSha256: string;
  repositoryCommit: string;
  mappingCommit: string;
  cars: Car[];
  tracks: Track[];
  parameters: Parameter[];
  index: SetupSummary[];
  coverage: Record<string, Record<string, number>>;
  excludedCount: number;
  counts: {
    cars: number;
    tracks: number;
    records: number;
    specific: number;
    baseline: number;
    archive: number;
    pairs: number;
  };
}
export const wheels = ["FL", "FR", "RL", "RR"] as const;
export type Wheel = (typeof wheels)[number];
export interface FuelInput {
  mode: "laps" | "duration";
  laps: string;
  minutes: string;
  lapTime: string;
  consumption: string;
  reserve: string;
  formation: string;
  capacity: string;
}
export interface PressureInput {
  cold: string;
  hot: string;
  target: string;
}
export interface PracticeDraft {
  fuel: FuelInput;
  pressures: Record<Wheel, PressureInput>;
  air: string;
  track: string;
  grip: string;
  notes: string;
  context: SessionContext;
  nextContext: SessionContext;
  quality: {
    lap: string;
    stable: boolean;
    incident: boolean;
    comparable: boolean;
  };
  targetMode: "range" | "manual";
  targetSource: string;
  actualFuel: string;
}
export interface FuelResult {
  laps: number;
  exact: number;
  prepared: number;
  capacity: number | null;
  exceeds: boolean;
}
export interface PracticeLog {
  id: string;
  setupId: string | null;
  carid: string;
  trackid: string;
  selection: Selection;
  createdAt: string;
  draft: PracticeDraft;
  results: { fuel: FuelResult | null; pressures: Record<Wheel, number | null> };
  sourceSnapshot: SourceSnapshot | null;
  recommendation: Recommendation | null;
  previousLogId: string | null;
  legacy: boolean;
}
export interface Favorite {
  id: string;
  selection: Selection;
  createdAt: string;
}
export interface PersonalState {
  lastSelection: Selection | null;
  lastContext: SessionContext | null;
  favorites: Favorite[];
  logs: PracticeLog[];
}

export type LearningExperiment =
  | "pressure"
  | "alignment"
  | "electronics"
  | "fuel"
  | "mechanical"
  | "damper"
  | "aero";
export type LearningVisual =
  | LearningExperiment
  | "foundation"
  | "grip"
  | "corner"
  | "body-motion"
  | "compound"
  | "telemetry"
  | "tyre-set"
  | "pads"
  | "pit"
  | "arb"
  | "brake"
  | "steering"
  | "differential"
  | "ducts";
export interface LearningSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  kind: "principle" | "acc-version" | "direct-testing";
  note: string;
}
export interface LearningModule {
  id: string;
  title: string;
  description: string;
}
/** Native-image pixels. The overlay scales with the original image. */
export interface LearningImageRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface LearningScreenshotAsset {
  id: string;
  src: string;
  width: number;
  height: number;
  title: string;
  alt: string;
  creator: string;
  sourceUrl: string;
  originalUrl: string;
  car: string | null;
  platform: string | null;
  version: string | null;
  versionEvidence: "visible" | "article" | "unknown";
  archive: boolean;
  note: string;
}
export interface LearningScreenshotMarker {
  id: string;
  label: string;
  explanation: string;
  parameterKeys: string[];
  box: LearningImageRect;
  detail: LearningImageRect;
  badgeSide?: "left" | "right";
}
export interface LearningScreenshotReference {
  assetId: string;
  caption: string;
  markers: LearningScreenshotMarker[];
}
export interface LearningTopic {
  id: string;
  moduleId: string;
  title: string;
  aliases: string[];
  parameterKeys: string[];
  unit: string;
  definition: string;
  increase: string;
  decrease: string;
  condition: string;
  scenario: string;
  example: string;
  checklist: string[];
  technical: string;
  limitation: string;
  sourceIds: string[];
  relatedIds: string[];
  visual: LearningVisual;
  experiment?: LearningExperiment;
  screenshots: LearningScreenshotReference[];
}
