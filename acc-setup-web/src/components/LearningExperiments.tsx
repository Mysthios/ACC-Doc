import { useState, type ReactNode } from "react";
import {
  wheels,
  type LearningExperiment,
  type FuelInput,
  type Selection,
  type Compound,
  type PracticeDraft,
} from "../types";
import { calculateFuel, emptyDraft, numberInput } from "../lib/calculators";
import { emptyContext } from "../lib/context";
import { pressureAdvice, tyreProfile } from "../lib/recommendations";
import {
  aeroForce,
  damperForce,
  rakeDifference,
  springForce,
} from "../lib/learningMath";
import {
  AeroPlatform,
  AlignmentDiagram,
  DamperDiagram,
  ForceBars,
  SpringDiagram,
} from "./LearningVisuals";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(n);
function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode = "decimal",
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  inputMode?: "text" | "decimal";
}) {
  return (
    <label>
      {label}
      <input
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={inputMode === "text" ? 1000 : 40}
      />
    </label>
  );
}
function Range({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="learn-range">
      {label}
      <output>
        {fmt(value)} {unit}
      </output>
      <input
        aria-label={label}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
function Lab({ children, reset }: { children: ReactNode; reset: () => void }) {
  return (
    <div className="learning-lab">
      <div className="learn-lab-heading">
        <span className="badge">ANGKA CONTOH · TERPISAH DARI LATIHAN</span>
        <button className="secondary compact" onClick={reset}>
          Reset contoh
        </button>
      </div>
      {children}
    </div>
  );
}
const exampleCars: Record<string, string> = {
  GT3: "ferrari_296_gt3",
  GT4: "bmw_m4_gt4",
  GT2: "maserati_mc20_gt2",
  TCX: "bmw_m2_cs_racing",
  CUP: "porsche_992_gt3_cup",
};
function exampleSelection(className: string, compound: Compound): Selection {
  return {
    className,
    carid: exampleCars[className],
    trackid: "barcelona",
    condition: compound === "Wet" ? "Light wet" : "Dry",
    session: "Practice",
    profile: "Stabil",
    compound,
  };
}
function pressureDraft(): PracticeDraft {
  const context = {
    ...emptyContext("1.10.4", "Dry"),
    bop: "Standard" as const,
    air: "20",
    track: "30",
    grip: "Optimum",
  };
  const d = emptyDraft(context);
  d.air = "20";
  d.track = "30";
  d.grip = "Optimum";
  d.quality = { lap: "5", stable: true, incident: false, comparable: true };
  d.targetSource = "Pilihan pengguna untuk contoh belajar.";
  const hot = ["27.5", "26.6", "25.7", "26.8"];
  wheels.forEach((w, i) => {
    d.pressures[w] = { cold: "23.8", hot: hot[i], target: "27" };
  });
  return d;
}
function PressureLab() {
  const [draft, setDraft] = useState(pressureDraft);
  const [className, setClassName] = useState("GT3");
  const [compound, setCompound] = useState<Compound>("Dry slick");
  const selection = exampleSelection(className, compound);
  const profile = tyreProfile(selection, draft.context);
  const setVersion = (gameVersion: string) =>
    setDraft({
      ...draft,
      context: { ...draft.context, gameVersion },
      nextContext: { ...draft.nextContext, gameVersion },
    });
  const quality = (key: "stable" | "incident" | "comparable", value: boolean) =>
    setDraft({ ...draft, quality: { ...draft.quality, [key]: value } });
  const reset = () => {
    setDraft(pressureDraft());
    setClassName("GT3");
    setCompound("Dry slick");
  };
  return (
    <Lab reset={reset}>
      <div className="learn-input-grid">
        <label>
          Kelas contoh
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          >
            {Object.keys(exampleCars).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Compound contoh
          <select
            value={compound}
            onChange={(e) => {
              const c = e.target.value as Compound;
              setCompound(c);
              const condition = c === "Wet" ? "Light wet" : "Dry";
              setDraft({
                ...draft,
                context: { ...draft.context, condition },
                nextContext: { ...draft.nextContext, condition },
              });
            }}
          >
            <option>Dry slick</option>
            <option>Wet</option>
          </select>
        </label>
        <Field
          label="Versi contoh"
          value={draft.context.gameVersion}
          onChange={setVersion}
        />
        <label>
          Target contoh
          <select
            aria-label="Target contoh"
            value={draft.targetMode}
            onChange={(e) =>
              setDraft({
                ...draft,
                targetMode: e.target.value as "range" | "manual",
              })
            }
          >
            <option value="range">Rentang profil</option>
            <option value="manual">Titik manual</option>
          </select>
        </label>
      </div>
      <div className="learn-evidence">
        {profile ? (
          <>
            <strong>
              {profile.label}: {profile.range.min}–{profile.range.max} psi hot
            </strong>
            <p>
              {profile.evidence === "historical"
                ? "Bukti historis"
                : "Acuan publik"}{" "}
              · {profile.referenceVersion}. Belum terverifikasi seluruh
              mobil/patch. Model contoh: {selection.carid.replaceAll("_", " ")}.
            </p>
            <a href={profile.source} target="_blank" rel="noreferrer">
              Sumber profil ↗ · internet
            </a>
          </>
        ) : (
          <>
            <strong>Cakupan profil belum memadai</strong>
            <p>
              Pilih target manual dan isi sumber/alasan; tidak ada target
              otomatis untuk contoh ini.
            </p>
          </>
        )}
      </div>
      {draft.targetMode === "manual" && (
        <Field
          label="Sumber/alasan target contoh"
          value={draft.targetSource}
          inputMode="text"
          onChange={(targetSource) => setDraft({ ...draft, targetSource })}
        />
      )}
      <div className="learn-quality">
        <Field
          label="Lap pengukuran contoh"
          value={draft.quality.lap}
          onChange={(lap) =>
            setDraft({ ...draft, quality: { ...draft.quality, lap } })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={draft.quality.stable}
            onChange={(e) => quality("stable", e.target.checked)}
          />
          Tekanan contoh sudah stabil
        </label>
        <label>
          <input
            type="checkbox"
            checked={draft.quality.incident}
            onChange={(e) => quality("incident", e.target.checked)}
          />
          Contoh mengalami insiden yang memengaruhi ban
        </label>
        <label>
          <input
            type="checkbox"
            checked={draft.quality.comparable}
            onChange={(e) => quality("comparable", e.target.checked)}
          />
          Kondisi berikutnya sebanding
        </label>
      </div>
      <div className="learn-wheel-grid">
        {wheels.map((w) => {
          const advice = pressureAdvice(draft, selection, w);
          const set = (key: "cold" | "hot" | "target", value: string) =>
            setDraft({
              ...draft,
              pressures: {
                ...draft.pressures,
                [w]: { ...draft.pressures[w], [key]: value },
              },
            });
          return (
            <section className="learn-wheel" key={w}>
              <h4>
                {w} ·{" "}
                {w === "FL"
                  ? "depan kiri"
                  : w === "FR"
                    ? "depan kanan"
                    : w === "RL"
                      ? "belakang kiri"
                      : "belakang kanan"}
              </h4>
              <Field
                label={"Contoh cold " + w + " (psi)"}
                value={draft.pressures[w].cold}
                onChange={(v) => set("cold", v)}
              />
              <Field
                label={"Contoh hot " + w + " (psi)"}
                value={draft.pressures[w].hot}
                onChange={(v) => set("hot", v)}
              />
              {draft.targetMode === "manual" && (
                <Field
                  label={"Contoh target " + w + " (psi)"}
                  value={draft.pressures[w].target}
                  onChange={(v) => set("target", v)}
                />
              )}
              <div
                className="learn-result"
                aria-live="polite"
                data-testid={"learn-pressure-" + w}
              >
                <strong>
                  {advice.nextCold === null
                    ? "Belum ada koreksi"
                    : fmt(advice.nextCold) + " psi cold"}
                </strong>
                <p>{advice.reason}</p>
                {advice.nextCold !== null && (
                  <code>
                    {advice.status === "keep"
                      ? "Dalam target: cold dipertahankan."
                      : fmt(advice.cold!) +
                        " + " +
                        fmt(advice.target!) +
                        " − " +
                        fmt(advice.hot!) +
                        " = " +
                        fmt(advice.nextCold)}
                  </code>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <p className="learn-note">
        Asumsi awal adalah contoh run bersih pada kondisi yang sama, bukan
        pengukuran game. Batas target 20–40; cold/hot/hasil 10–50 psi adalah
        batas app, bukan slider mobil.
      </p>
    </Lab>
  );
}
function AlignmentLab({ topicId }: { topicId?: string }) {
  const initialMode =
    topicId === "toe" || topicId === "caster" ? topicId : "camber";
  const [mode, setMode] = useState<"camber" | "toe" | "caster">(initialMode);
  const [angles, setAngles] = useState({ camber: -3, toe: -0.2, caster: 8 });
  const reset = () => {
    setMode(initialMode);
    setAngles({ camber: -3, toe: -0.2, caster: 8 });
  };
  const bounds =
    mode === "camber"
      ? [-5, 2, 0.1]
      : mode === "toe"
        ? [-1, 1, 0.1]
        : [0, 15, 0.5];
  return (
    <Lab reset={reset}>
      <label>
        Geometri contoh
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as typeof mode)}
        >
          <option value="camber">Camber · depan</option>
          <option value="toe">Toe · atas</option>
          <option value="caster">Caster · samping</option>
        </select>
      </label>
      <Range
        label={"Sudut " + mode + " contoh"}
        value={angles[mode]}
        min={bounds[0]}
        max={bounds[1]}
        step={bounds[2]}
        unit="°"
        onChange={(a) => setAngles({ ...angles, [mode]: a })}
      />
      <AlignmentDiagram mode={mode} angle={angles[mode]} />
      <div className="learn-result" aria-live="polite">
        <strong>
          {mode === "camber"
            ? angles.camber < 0
              ? "Atas roda ke dalam"
              : angles.camber > 0
                ? "Atas roda ke luar"
                : "Roda tegak"
            : mode === "toe"
              ? angles.toe < 0
                ? "Toe-out: ujung depan ke luar"
                : angles.toe > 0
                  ? "Toe-in: ujung depan ke dalam"
                  : "Roda sejajar"
              : "Sumbu kemudi dilihat dari samping"}
        </strong>
        <p>
          Rentang kontrol hanya untuk ilustrasi, bukan batas slider ACC. Tidak
          ada prediksi persen grip atau temperatur.
        </p>
      </div>
    </Lab>
  );
}
function ElectronicsLab({ topicId }: { topicId?: string }) {
  const initialMode = topicId === "abs" ? "ABS" : "TC";
  const [mode, setMode] = useState(initialMode);
  const [slip, setSlip] = useState(10),
    [threshold, setThreshold] = useState(8),
    [cut, setCut] = useState(20);
  const [enabled, setEnabled] = useState(true),
    [locked, setLocked] = useState(true);
  const active = enabled && (mode === "TC" ? slip > threshold : locked);
  const reset = () => {
    setMode(initialMode);
    setSlip(10);
    setThreshold(8);
    setCut(20);
    setEnabled(true);
    setLocked(true);
  };
  return (
    <Lab reset={reset}>
      <label>
        Sistem contoh
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option>TC</option>
          <option>ABS</option>
        </select>
      </label>
      <label className="learn-check">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Bantuan ilustratif aktif
      </label>
      {mode === "TC" ? (
        <div className="learn-input-grid">
          <Range
            label="Slip roda ilustratif"
            value={slip}
            min={0}
            max={30}
            unit="%"
            onChange={setSlip}
          />
          <Range
            label="Ambang intervensi ilustratif"
            value={threshold}
            min={1}
            max={30}
            unit="%"
            onChange={setThreshold}
          />
          <Range
            label="Pemotongan torsi ilustratif"
            value={cut}
            min={0}
            max={60}
            unit="%"
            onChange={setCut}
          />
        </div>
      ) : (
        <label className="learn-check">
          <input
            type="checkbox"
            checked={locked}
            onChange={(e) => setLocked(e.target.checked)}
          />
          Tuntutan rem menyebabkan kecenderungan lockup pada contoh
        </label>
      )}
      <div
        className="learn-control-flow"
        role="img"
        aria-label={
          "Contoh " + mode + ": " + (active ? "intervensi" : "tanpa intervensi")
        }
      >
        <span>
          {mode === "TC"
            ? "Slip " + fmt(slip) + "%"
            : locked
              ? "Lockup diminta"
              : "Roda menggelinding"}
        </span>
        <span aria-hidden="true">→</span>
        <span className={active ? "flow-active" : ""}>
          {active ? "Intervensi" : "Tidak intervensi"}
        </span>
        <span aria-hidden="true">→</span>
        <span>
          {mode === "TC"
            ? "Torsi contoh " + (active ? 100 - cut : 100) + "%"
            : active
              ? "Rem dimodulasi"
              : locked
                ? "Lockup belum dibatasi"
                : "Rem biasa"}
        </span>
      </div>
      <div
        className="learn-result"
        aria-live="polite"
        data-testid="learn-electronics-result"
      >
        <strong>
          {active
            ? mode + " berintervensi pada model contoh"
            : mode + " tidak berintervensi pada model contoh"}
        </strong>
        <p>
          {mode === "TC"
            ? "Model ambang sederhana: slip > ambang memicu cut. TC nyata punya filter dan peta; ini bukan setting TC1/TC2 game."
            : "ABS nyata melakukan siklus modulasi. Diagram hanya menunjukkan alasan tindakan, tanpa menghitung jarak pengereman."}
        </p>
      </div>
    </Lab>
  );
}
const initialFuel: FuelInput = {
  mode: "duration",
  laps: "18",
  minutes: "30",
  lapTime: "1:45",
  consumption: "2.8",
  reserve: "1",
  formation: "1",
  capacity: "",
};
function FuelLab() {
  const [input, setInput] = useState<FuelInput>({ ...initialFuel });
  const result = calculateFuel(input);
  const set = (key: keyof FuelInput, value: string) =>
    setInput({ ...input, [key]: value });
  return (
    <Lab reset={() => setInput({ ...initialFuel })}>
      <div className="learn-input-grid">
        <label>
          Mode fuel contoh
          <select
            value={input.mode}
            onChange={(e) => set("mode", e.target.value)}
          >
            <option value="duration">Durasi</option>
            <option value="laps">Jumlah lap</option>
          </select>
        </label>
        {input.mode === "duration" ? (
          <>
            <Field
              label="Durasi contoh (menit)"
              value={input.minutes}
              onChange={(v) => set("minutes", v)}
            />
            <Field
              label="Lap time contoh"
              value={input.lapTime}
              onChange={(v) => set("lapTime", v)}
              placeholder="1:45"
              inputMode="text"
            />
          </>
        ) : (
          <Field
            label="Jumlah lap contoh"
            value={input.laps}
            onChange={(v) => set("laps", v)}
          />
        )}
        <Field
          label="Konsumsi contoh (L/lap)"
          value={input.consumption}
          onChange={(v) => set("consumption", v)}
        />
        <Field
          label="Lap cadangan contoh"
          value={input.reserve}
          onChange={(v) => set("reserve", v)}
        />
        <Field
          label="Formation fuel contoh (L)"
          value={input.formation}
          onChange={(v) => set("formation", v)}
        />
        <Field
          label="Kapasitas tangki contoh (L)"
          value={input.capacity}
          onChange={(v) => set("capacity", v)}
          placeholder="Opsional"
        />
      </div>
      <div
        className="learn-result"
        aria-live="polite"
        data-testid="learn-fuel-result"
      >
        {result.value ? (
          <>
            <strong>
              {fmt(result.value.exact)} L · disiapkan{" "}
              {fmt(result.value.prepared)} L
            </strong>
            <ol>
              <li>
                {input.mode === "duration"
                  ? "Durasi ÷ lap time, dibulatkan ke atas"
                  : "Jumlah lap dipilih"}
                : {result.value.laps} lap.
              </li>
              <li>
                ({result.value.laps} + {input.reserve}) × {input.consumption} +{" "}
                {input.formation} = {fmt(result.value.exact)} L.
              </li>
              <li>Pembulatan liter ke atas: {result.value.prepared} L.</li>
            </ol>
            {result.value.exceeds && (
              <p className="error" role="alert">
                Kebutuhan melebihi kapasitas {fmt(result.value.capacity!)} L.
                Tinjau rencana stint, bukan memasukkan fuel melebihi tangki.
              </p>
            )}
          </>
        ) : (
          <p role="alert">{result.error}</p>
        )}
      </div>
      <p className="learn-note">
        Cadangan perlu menampung aturan lap akhir, outlap dan kebutuhan lain
        yang belum dihitung. Angka ini contoh, bukan fuel aktual pada draft.
      </p>
    </Lab>
  );
}
function MechanicalLab() {
  const [rate, setRate] = useState("100"),
    [compression, setCompression] = useState(10),
    [engagement, setEngagement] = useState(15);
  const spring = springForce(rate, String(compression));
  const additional = Math.max(0, compression - engagement) * 200;
  const total = spring.value === null ? null : spring.value + additional;
  const reset = () => {
    setRate("100");
    setCompression(10);
    setEngagement(15);
  };
  return (
    <Lab reset={reset}>
      <div className="learn-input-grid">
        <Field
          label="Kekakuan per contoh (N/mm)"
          value={rate}
          onChange={setRate}
        />
        <Range
          label="Kompresi per contoh"
          value={compression}
          min={0}
          max={30}
          unit="mm"
          onChange={setCompression}
        />
        <Range
          label="Engagement bumpstop contoh"
          value={engagement}
          min={0}
          max={30}
          unit="mm"
          onChange={setEngagement}
        />
      </div>
      <SpringDiagram compression={compression} engagement={engagement} />
      <div
        className="learn-result"
        aria-live="polite"
        data-testid="learn-mechanical-result"
      >
        {spring.value !== null ? (
          <>
            <strong>Per utama: {fmt(spring.value)} N</strong>
            <p>
              {rate} N/mm × {compression} mm = {fmt(spring.value)} N.
            </p>
            <p>
              Bumpstop ilustratif: {fmt(additional)} N · total model:{" "}
              {fmt(total!)} N.
            </p>
          </>
        ) : (
          <p role="alert">{spring.error}</p>
        )}
      </div>
      <p className="learn-note">
        Tambahan 200 N/mm setelah engagement hanya model belajar linear.
        Bumpstop ACC dapat progresif, memiliki travel terbatas, dan angka rate
        katalog dalam N tidak dikonversi ke model ini.
      </p>
    </Lab>
  );
}
function DamperLab({ topicId }: { topicId?: string }) {
  const initialDirection = topicId?.includes("rebound") ? "rebound" : "bump";
  const initialFast = topicId?.startsWith("fast") ?? false;
  const [direction, setDirection] = useState<"bump" | "rebound">(
      initialDirection,
    ),
    [fast, setFast] = useState(initialFast);
  const [speed, setSpeed] = useState(initialFast ? 0.3 : 0.1),
    [coefficient, setCoefficient] = useState("4000");
  const result = damperForce(coefficient, String(speed));
  const reset = () => {
    setDirection(initialDirection);
    setFast(initialFast);
    setSpeed(initialFast ? 0.3 : 0.1);
    setCoefficient("4000");
  };
  return (
    <Lab reset={reset}>
      <div className="learn-input-grid">
        <label>
          Arah gerak contoh
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as typeof direction)}
          >
            <option value="bump">Bump · kompresi</option>
            <option value="rebound">Rebound · pemanjangan</option>
          </select>
        </label>
        <label>
          Kejadian contoh
          <select
            value={fast ? "fast" : "slow"}
            onChange={(e) => {
              const f = e.target.value === "fast";
              setFast(f);
              setSpeed(f ? 0.3 : 0.1);
            }}
          >
            <option value="slow">Transisi bertahap</option>
            <option value="fast">Benturan cepat</option>
          </select>
        </label>
        <Field
          label="Koefisien damper contoh (N·s/m)"
          value={coefficient}
          onChange={setCoefficient}
        />
        <Range
          label="Kecepatan gerak damper contoh"
          value={speed}
          min={0}
          max={0.5}
          step={0.01}
          unit="m/s"
          onChange={setSpeed}
        />
      </div>
      <DamperDiagram direction={direction} fast={fast} />
      <div
        className="learn-result"
        aria-live="polite"
        data-testid="learn-damper-result"
      >
        {result.value !== null ? (
          <>
            <strong>
              |F| = {fmt(result.value)} N · melawan{" "}
              {direction === "bump" ? "kompresi" : "pemanjangan"}
            </strong>
            <p>
              {coefficient} × {fmt(speed)} = {fmt(result.value)} N.
            </p>
          </>
        ) : (
          <p role="alert">{result.error}</p>
        )}
      </div>
      {result.value !== null && (
        <ForceBars baseline={400} current={result.value} />
      )}
      <p className="learn-note">
        Pilihan kejadian mengisi kecepatan contoh, bukan batas slow/fast resmi.
        Kurva bump/rebound nyata tidak harus sama atau linear; klik ACC tidak
        dikonversi ke koefisien ini.
      </p>
    </Lab>
  );
}
function AeroLab() {
  const [speed, setSpeed] = useState(100),
    [front, setFront] = useState("55"),
    [rear, setRear] = useState("70");
  const result = aeroForce(String(speed)),
    rake = rakeDifference(front, rear);
  const reset = () => {
    setSpeed(100);
    setFront("55");
    setRear("70");
  };
  return (
    <Lab reset={reset}>
      <Range
        label="Kecepatan udara relatif contoh"
        value={speed}
        min={0}
        max={300}
        step={10}
        unit="km/jam"
        onChange={setSpeed}
      />
      <div
        className="learn-result"
        aria-live="polite"
        data-testid="learn-aero-result"
      >
        <strong>
          {fmt(result.value!.force)} N · {fmt(result.value!.ratio)}× acuan
        </strong>
        <p>
          Acuan ilustratif: 1.000 N pada 100 km/jam. Rasio = ({speed} ÷ 100)².
          Kecepatan SI: {fmt(result.value!.metersPerSecond)} m/s.
        </p>
      </div>
      <ForceBars baseline={1000} current={result.value!.force} />
      <div className="learn-input-grid">
        <Field
          label="Tinggi depan contoh (mm)"
          value={front}
          onChange={setFront}
        />
        <Field
          label="Tinggi belakang contoh (mm)"
          value={rear}
          onChange={setRear}
        />
      </div>
      {rake.value !== null && (
        <AeroPlatform front={numberInput(front)!} rear={numberInput(rear)!} />
      )}
      <div
        className="learn-result"
        aria-live="polite"
        data-testid="learn-rake-result"
      >
        {rake.value !== null ? (
          <>
            <strong>Selisih rake: {fmt(rake.value)} mm</strong>
            <p>
              {rear} − {front} = {fmt(rake.value)} mm; bukan sudut derajat.
            </p>
          </>
        ) : (
          <p role="alert">{rake.error}</p>
        )}
      </div>
      <p className="learn-note">
        Koefisien aero dianggap tetap untuk perbandingan kecepatan. Angka tinggi
        tidak mengubah gaya model ini; dibutuhkan peta aero mobil. Gaya ×4 tidak
        berarti grip ×4.
      </p>
    </Lab>
  );
}
export function LearningExperimentPanel({
  kind,
  topicId,
}: {
  kind: LearningExperiment;
  topicId?: string;
}) {
  if (kind === "pressure") return <PressureLab />;
  if (kind === "alignment") return <AlignmentLab topicId={topicId} />;
  if (kind === "electronics") return <ElectronicsLab topicId={topicId} />;
  if (kind === "fuel") return <FuelLab />;
  if (kind === "mechanical") return <MechanicalLab />;
  if (kind === "damper") return <DamperLab topicId={topicId} />;
  return <AeroLab />;
}
