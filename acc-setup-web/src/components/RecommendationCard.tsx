import type { PracticeDraft, Selection, SetupRecord } from "../types";
import { wheels } from "../types";
import { recommendRun } from "../lib/recommendations";

export function RecommendationCard({
  draft,
  selection,
  record,
  ready,
}: {
  draft: PracticeDraft;
  selection: Selection;
  record: SetupRecord | null;
  ready: boolean;
}) {
  const result = recommendRun(selection, draft, record);
  const compoundMismatch =
    result.compound.suggested !== null &&
    result.compound.suggested !== selection.compound;
  const manualTargets = wheels.map((w) => draft.pressures[w].target);
  const manualLabel = manualTargets.every((v) => v.trim())
    ? (new Set(manualTargets).size === 1
        ? manualTargets[0]
        : wheels.map((w) => w + " " + draft.pressures[w].target).join(" / ")) +
      " psi · pilihan pengguna"
    : "Titik manual pilihan pengguna";
  return (
    <section
      className="panel recommendation-card"
      data-testid="recommendation-card"
      aria-label="Rekomendasi sesi"
    >
      <div className="section-heading">
        <h2>
          <span className="step-mark">02</span> Rekomendasi sesi
        </h2>
        <span
          className={
            "badge " + (result.confidence === "medium" ? "success" : "warning")
          }
        >
          Keyakinan hitungan:{" "}
          {result.confidence === "medium" ? "sedang" : "terbatas"}
        </span>
      </div>
      <div className="recommendation-grid">
        <div>
          <span>Acuan</span>
          <strong>
            {record
              ? record.creator + " · " + record.id
              : ready
                ? "Setup bawaan/milik sendiri"
                : "Pilih acuan atau setup sendiri"}
          </strong>
          {record && (
            <small>
              Cold dari sumber; sesuaikan dengan angka yang benar-benar dipakai.
              Udara/lintasan sumber: {record.ambient ?? "—"} /{" "}
              {record.tracktemp ?? "—"} °C · versi {record.version}.
            </small>
          )}
        </div>
        <div>
          <span>Compound untuk diuji</span>
          <strong>{result.compound.suggested ?? "Slick atau wet"}</strong>
          <small>{result.compound.reason}</small>
        </div>
        <div>
          <span>Target hot</span>
          <strong>
            {compoundMismatch
              ? "Tinjau compound dahulu"
              : draft.targetMode === "manual"
                ? manualLabel
                : result.profile
                  ? result.profile.range.min +
                    "–" +
                    result.profile.range.max +
                    " psi"
                  : "Target manual diperlukan"}
          </strong>
          <small>
            {"Compound terpilih: " + selection.compound + ". "}
            {result.profile?.label ??
              "Cakupan kelas/model/versi belum memadai."}
          </small>
        </div>
        <div>
          <span>Kebutuhan fuel</span>
          <strong>
            {result.fuel
              ? result.fuel.prepared + " L"
              : "Isi konsumsi dan kebutuhan sesi"}
          </strong>
          <small>
            {result.fuel
              ? "Estimasi " +
                result.fuel.laps +
                " lap; hitungan " +
                result.fuel.exact.toFixed(2) +
                " L, termasuk cadangan/formation."
              : "Race atau stint dihitung dari konsumsi aktual."}
          </small>
          {result.fuel?.exceeds && (
            <p className="validation">
              Kebutuhan melebihi kapasitas tangki yang diisi.
            </p>
          )}
        </div>
      </div>
      {compoundMismatch && (
        <p className="validation">
          Compound pilihan berbeda dari acuan kondisi. Pilih compound yang akan
          diuji sebelum menghitung koreksi.
        </p>
      )}
      {result.missing.length > 0 && (
        <p className="subtle">
          Perlu ditinjau: {result.missing.slice(0, 3).join(" ")}{" "}
          {result.missing.length > 3 &&
            "Lihat dasar rekomendasi untuk kekurangan bukti lainnya."}
        </p>
      )}
      <p className="subtle">
        Uji awal: catat cold dan fuel aktual, lalu ukur hot setelah lap bersih
        hingga tekanan stabil.
      </p>
      {result.profile && (
        <p className="subtle">
          Rentang ini acuan yang perlu diuji pada mobil dan patch kamu.{" "}
          <a href={result.profile.source} target="_blank" rel="noreferrer">
            Baca sumber ↗
          </a>
        </p>
      )}
      <details className="recommendation-evidence">
        <summary>Dasar rekomendasi dan informasi yang diperlukan</summary>
        <ul>
          {result.evidence.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        {result.missing.length > 0 && (
          <>
            <strong>Lengkapi atau tinjau</strong>
            <ul>
              {result.missing.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </>
        )}
      </details>
      <details>
        <summary>Langkah pengujian</summary>
        <ol>
          {result.steps.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ol>
      </details>
    </section>
  );
}
