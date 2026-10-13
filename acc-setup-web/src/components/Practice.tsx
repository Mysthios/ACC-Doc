import type {
  PracticeDraft,
  SetupRecord,
  Wheel,
  PressureInput,
  FuelInput,
  Selection,
} from "../types";
import { wheels } from "../types";
import { calculateFuel } from "../lib/calculators";
import { recommendRun, qualityIssues } from "../lib/recommendations";
import { contextDifferences, measuredContext } from "../lib/context";
import { SessionFields } from "./SessionFields";

const format = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 }).format(n);
export function Practice({
  draft,
  setDraft,
  record,
  selection,
  onSave,
  onLearn,
}: {
  draft: PracticeDraft;
  setDraft: (v: PracticeDraft) => void;
  record: SetupRecord | null;
  selection: Selection;
  onSave: () => void;
  onLearn?: (parameterKey: string) => void;
}) {
  const fuel = calculateFuel(draft.fuel);
  const recommendation = recommendRun(selection, draft, record);
  const issues = qualityIssues(draft);
  const changes = contextDifferences(measuredContext(draft), draft.nextContext);
  const setFuel = (key: keyof FuelInput, value: string) =>
    setDraft({ ...draft, fuel: { ...draft.fuel, [key]: value } });
  const setPressure = (w: Wheel, key: keyof PressureInput, value: string) =>
    setDraft({
      ...draft,
      pressures: {
        ...draft.pressures,
        [w]: { ...draft.pressures[w], [key]: value },
      },
    });
  const hasFuel =
    draft.fuel.consumption !== "" ||
    draft.fuel.laps !== "" ||
    draft.fuel.minutes !== "";
  return (
    <details className="panel practice" id="practice" data-testid="practice">
      <summary>
        <span>
          Hasil Latihan <small>Opsional · fuel & tekanan ban</small>
        </span>
        <span className="summary-arrow" aria-hidden="true">
          ＋
        </span>
      </summary>
      <div className="practice-body">
        <p>
          Catat input yang benar-benar kamu pakai. Angka koreksi di sini
          terpisah dari setting sumber di atas. Endurance dihitung per stint.
        </p>
        <div className="context-grid">
          <label>
            Fuel aktual dipakai (L)
            <input
              inputMode="decimal"
              value={draft.actualFuel}
              maxLength={40}
              placeholder="Isi fuel saat run dimulai"
              onChange={(e) =>
                setDraft({ ...draft, actualFuel: e.target.value })
              }
            />
          </label>
        </div>
        <h3>Kondisi saat pengukuran</h3>
        <SessionFields
          value={draft.context}
          prefix="pengukuran"
          includeCondition
          includeTemperatures={false}
          onChange={(context) =>
            setDraft({
              ...draft,
              context,
              quality: { ...draft.quality, comparable: false },
            })
          }
        />
        <div className="context-grid">
          {(
            [
              ["air", "Suhu udara (°C)"],
              ["track", "Suhu lintasan (°C)"],
              ["grip", "Grip / kondisi latihan"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                value={draft[key]}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    [key]: e.target.value,
                    quality: { ...draft.quality, comparable: false },
                  })
                }
                inputMode={key === "grip" ? "text" : "decimal"}
                maxLength={key === "grip" ? 200 : 40}
                placeholder={key === "grip" ? "Contoh: optimum" : "Belum diisi"}
              />
            </label>
          ))}
        </div>
        <section className="calculator-section">
          <div className="section-heading">
            <h3>Kebutuhan fuel</h3>
            {onLearn && (
              <button
                className="learn-inline-link"
                onClick={() => onLearn("fuel")}
              >
                Pelajari fuel ↗
              </button>
            )}
            <span className="subtle">Per race atau stint</span>
          </div>
          <div className="fuel-grid">
            <label>
              Mode hitung
              <select
                value={draft.fuel.mode}
                onChange={(e) => setFuel("mode", e.target.value)}
              >
                <option value="laps">Jumlah lap</option>
                <option value="duration">Durasi</option>
              </select>
            </label>
            {draft.fuel.mode === "laps" ? (
              <label>
                Jumlah lap
                <input
                  inputMode="numeric"
                  value={draft.fuel.laps}
                  onChange={(e) => setFuel("laps", e.target.value)}
                  maxLength={40}
                  placeholder="Contoh: 18"
                />
              </label>
            ) : (
              <>
                <label>
                  Durasi (menit)
                  <input
                    inputMode="decimal"
                    value={draft.fuel.minutes}
                    onChange={(e) => setFuel("minutes", e.target.value)}
                    maxLength={40}
                    placeholder="Contoh: 30"
                  />
                </label>
                <label>
                  Rata-rata lap time
                  <input
                    value={draft.fuel.lapTime}
                    onChange={(e) => setFuel("lapTime", e.target.value)}
                    maxLength={40}
                    placeholder="1:45 atau 105"
                  />
                </label>
              </>
            )}
            {(
              [
                ["consumption", "Konsumsi aktual (L/lap)", "Contoh: 2,8"],
                ["reserve", "Lap cadangan", "1"],
                ["formation", "Formation fuel (L)", "0"],
                [
                  "capacity",
                  "Kapasitas tangki (L)",
                  "Opsional · isi bila diketahui",
                ],
              ] as const
            ).map(([key, label, placeholder]) => (
              <label key={key}>
                {label}
                <input
                  inputMode="decimal"
                  value={draft.fuel[key]}
                  onChange={(e) => setFuel(key, e.target.value)}
                  maxLength={40}
                  placeholder={placeholder}
                />
              </label>
            ))}
          </div>
          {fuel.value ? (
            <div className="fuel-result" data-testid="fuel-result">
              <div>
                <span>Estimasi lap</span>
                <strong>{fuel.value.laps}</strong>
              </div>
              <div>
                <span>Fuel tepat</span>
                <strong>
                  {format(fuel.value.exact)} <small>L</small>
                </strong>
              </div>
              <div>
                <span>Siapkan</span>
                <strong>
                  {fuel.value.prepared} <small>L</small>
                </strong>
              </div>
              <p>
                {fuel.value.capacity === null
                  ? "Kapasitas tangki belum dibandingkan."
                  : fuel.value.exceeds
                    ? `Melebihi kapasitas input ${format(fuel.value.capacity)} L. Kurangi durasi stint atau tinjau jumlah fuel.`
                    : `Dalam kapasitas input ${format(fuel.value.capacity)} L.`}
              </p>
            </div>
          ) : (
            <p className={hasFuel ? "validation" : "subtle"}>
              {hasFuel
                ? fuel.error
                : "Isi lap/durasi dan konsumsi aktual untuk menghitung fuel."}
            </p>
          )}
          <p className="formula-note">
            (Lap estimasi + lap cadangan) × konsumsi/lap + formation fuel.
            Jumlah yang disiapkan dibulatkan ke liter penuh.
          </p>
        </section>
        <section className="calculator-section">
          <div className="section-heading">
            <h3>Koreksi tekanan ban</h3>
            {onLearn && (
              <button
                className="learn-inline-link"
                onClick={() => onLearn("pressureFL")}
              >
                Pelajari tekanan ↗
              </button>
            )}
            <span className="subtle">Langkah 0,1 psi</span>
          </div>
          <div className="context-grid">
            <label>
              Mode target tekanan
              <select
                value={draft.targetMode}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    targetMode: e.target.value as PracticeDraft["targetMode"],
                    targetSource:
                      draft.targetSource ||
                      recommendation.profile?.source ||
                      "",
                  })
                }
              >
                <option value="range">Rentang profil ban</option>
                <option value="manual">Titik manual</option>
              </select>
            </label>
            {draft.targetMode === "manual" && (
              <label>
                Sumber/alasan target manual
                <input
                  value={draft.targetSource}
                  maxLength={1000}
                  onChange={(e) =>
                    setDraft({ ...draft, targetSource: e.target.value })
                  }
                  placeholder="Panduan sesuai mobil/patch atau hasil pengujian"
                />
              </label>
            )}
          </div>
          <p className="subtle">
            {recommendation.profile
              ? recommendation.profile.label +
                ": " +
                recommendation.profile.range.min +
                "–" +
                recommendation.profile.range.max +
                " psi hot."
              : "Profil belum mencakup model/versi ini. Gunakan target manual dan isi sumbernya."}
          </p>
          <fieldset className="quality-checks">
            <legend>Kualitas pengukuran</legend>
            <label>
              Lap pengukuran
              <input
                inputMode="numeric"
                maxLength={40}
                value={draft.quality.lap}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    quality: { ...draft.quality, lap: e.target.value },
                  })
                }
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={draft.quality.stable}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    quality: { ...draft.quality, stable: e.target.checked },
                  })
                }
              />{" "}
              Tekanan sudah relatif stabil
            </label>
            <label>
              <input
                type="checkbox"
                checked={draft.quality.incident}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    quality: { ...draft.quality, incident: e.target.checked },
                  })
                }
              />{" "}
              Ada insiden yang memengaruhi ban
            </label>
          </fieldset>
          <details className="next-context">
            <summary>Kondisi sesi berikutnya</summary>
            <SessionFields
              value={draft.nextContext}
              prefix="sesi berikutnya"
              includeCondition
              onChange={(nextContext) =>
                setDraft({
                  ...draft,
                  nextContext,
                  quality: { ...draft.quality, comparable: false },
                })
              }
            />
          </details>
          {changes.length > 0 && (
            <div className="reference-note">
              <strong>Perbedaan kondisi berikutnya</strong>
              <ul>
                {changes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          <label className="check-label">
            <input
              type="checkbox"
              checked={draft.quality.comparable}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  quality: { ...draft.quality, comparable: e.target.checked },
                })
              }
            />{" "}
            Kondisi berikutnya sebanding untuk menguji koreksi
          </label>
          {issues.length > 0 && (
            <p className="validation" data-testid="quality-gate">
              {issues.join(" ")}
            </p>
          )}
          <div className="pressure-grid">
            {wheels.map((w) => {
              const result = recommendation.pressures[w];
              const partial = Object.values(draft.pressures[w]).some(
                (v) => v !== "",
              );
              return (
                <fieldset className="pressure-card" key={w}>
                  <legend>
                    {w}{" "}
                    <small>
                      {
                        {
                          FL: "Depan kiri",
                          FR: "Depan kanan",
                          RL: "Belakang kiri",
                          RR: "Belakang kanan",
                        }[w]
                      }
                    </small>
                  </legend>
                  {(
                    [
                      ["cold", "Cold dipakai"],
                      ["hot", "Hot terukur"],
                      ["target", "Target hot"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key}>
                      {label} {w} (psi)
                      <input
                        inputMode="decimal"
                        value={
                          key === "target" && draft.targetMode === "range"
                            ? (result.target?.toString() ?? "")
                            : draft.pressures[w][key]
                        }
                        readOnly={
                          key === "target" && draft.targetMode === "range"
                        }
                        onChange={(e) => setPressure(w, key, e.target.value)}
                        maxLength={40}
                        placeholder="—"
                      />
                    </label>
                  ))}
                  <div
                    className="pressure-result"
                    data-testid={`pressure-${w}`}
                  >
                    <span>Cold berikutnya</span>
                    <strong>
                      {result.nextCold === null
                        ? "—"
                        : `${result.nextCold.toFixed(1)} psi`}
                    </strong>
                  </div>
                  {partial && (
                    <p
                      className={
                        result.nextCold === null ? "validation" : "subtle"
                      }
                    >
                      {result.status === "blocked" && issues.length > 0
                        ? "Lengkapi kualitas pengukuran di atas."
                        : result.reason}
                    </p>
                  )}
                </fieldset>
              );
            })}
          </div>
          <p className="formula-note">
            Cold berikutnya = cold dipakai + target hot − hot terukur. Perkiraan
            untuk pengujian berikutnya pada kondisi sebanding. Dalam mode
            rentang, hot yang sudah sesuai mempertahankan cold aktual; koreksi
            menuju batas terdekat. Cold/hot dan hasil: 10–50 psi; target manual:
            20–40 psi. Ini batas kewajaran aplikasi, bukan batas slider resmi
            mobil.
          </p>
          <div className="reference-note">
            <p>
              {recommendation.profile
                ? recommendation.profile.label +
                  ": profil awal yang perlu diuji pada model dan patch kamu. "
                : "Cakupan profil belum memadai untuk model/versi ini. Isi target manual beserta sumber yang sesuai. "}
              Rentang historis dan panduan publik tidak membuktikan kesesuaian
              seluruh mobil/patch.
              {recommendation.profile && (
                <>
                  {" "}
                  <a
                    href={recommendation.profile.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Baca acuan profil ↗
                  </a>
                </>
              )}
            </p>
          </div>
        </section>
        <label>
          Catatan latihan
          <textarea
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            maxLength={5000}
            rows={3}
            placeholder="Contoh: tekanan dicatat setelah 5 lap, suhu stabil."
          />
        </label>
        <div className="action-row">
          <button className="primary" onClick={onSave}>
            Simpan Latihan
          </button>
          <span className="subtle">
            {record ? "Terkait " + record.id : "Setup bawaan/milik sendiri"} ·
            simpan angka aktual run ini.
          </span>
        </div>
      </div>
    </details>
  );
}
