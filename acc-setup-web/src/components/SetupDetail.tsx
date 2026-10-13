import type { Catalog, Selection, SetupRecord } from "../types";
import { differences, displaySetting } from "../lib/selection";

export function SetupDetail({
  record,
  catalog,
  selection,
  mode,
  onCopy,
  onFavorite,
  favorite,
  onLearn,
}: {
  record: SetupRecord;
  catalog: Catalog;
  selection?: Selection;
  mode: "exact" | "reference" | "library";
  onCopy: () => void;
  onFavorite: () => void;
  favorite: boolean;
  onLearn?: (parameterKey: string) => void;
}) {
  const mismatch = selection ? differences(record, selection) : [];
  const groups = [...new Set(catalog.parameters.map((p) => p.group))];
  return (
    <article className="setup-detail" data-testid="setup-detail">
      <div className="panel result-head">
        <div className="result-top">
          <div>
            <span
              className={`badge ${mode === "exact" ? "success" : "warning"}`}
            >
              {mode === "exact"
                ? "Metadata cocok"
                : mode === "reference"
                  ? "Alternatif · acuan dipilih manual"
                  : `Pustaka · ${record.scope}`}
            </span>
            <h2>{record.car}</h2>
            <p className="result-sub">
              {record.track} <span>·</span> {record.creator}
            </p>
          </div>
          <div className="action-row">
            <button className="secondary" onClick={onCopy}>
              Salin Ringkasan
            </button>
            <button
              className={favorite ? "secondary" : "primary"}
              onClick={onFavorite}
            >
              {favorite ? "Hapus Favorit" : "Simpan Favorit"}
            </button>
          </div>
        </div>
        <p className="reason">
          {mode === "exact"
            ? "Metadata cocok dengan pilihan. Kesesuaian berkendara dan patch/BoP dinilai terpisah; kelengkapan data bukan tingkat keyakinan rekomendasi."
            : mode === "reference"
              ? "Kamu memilih sumber ini sebagai acuan. Perbedaan dengan pencarian tetap terlihat di bawah."
              : "Detail sumber dari pustaka. Baseline dan arsip LFM tidak masuk rekomendasi BoP standar."}
        </p>
        {mismatch.length > 0 && (
          <ul className="mismatches">
            {mismatch.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
        <div className="metadata-grid">
          {[
            ["Kondisi sumber", record.condition],
            ["Sesi sumber", record.session],
            ["Karakter sumber", record.profile],
            ["Compound", record.compound],
            ["Versi sumber", record.version],
            ["Parameter tersedia", `${record.known}/${record.total}`],
            [
              "Udara / lintasan",
              `${record.ambient ?? "—"} / ${record.tracktemp ?? "—"} °C`,
            ],
            ["Grip", record.grip],
            ["Lap time sumber", record.laptime ?? "Tidak disebut"],
          ].map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="source-note">
          <p>
            <strong>{record.compat}</strong>. Acuan katalog: ACC PC{" "}
            {catalog.referenceVersion}. BoP: {record.bop}.
          </p>
          <p>Kelengkapan data bukan validasi berkendara. {record.note}</p>
        </div>
        <div className="source-links">
          <code>{record.id}</code>
          <a href={record.source} target="_blank" rel="noreferrer">
            File sumber ↗
          </a>
          {record.creatorSource && (
            <a href={record.creatorSource} target="_blank" rel="noreferrer">
              Pembuat / panduan ↗
            </a>
          )}
          <a href={record.mappingSource} target="_blank" rel="noreferrer">
            Pemetaan nilai ↗
          </a>
          <span>Diperiksa {record.checked}</span>
        </div>
        <details className="file-name">
          <summary>Nama file sumber</summary>
          <p>{record.name}</p>
        </details>
      </div>
      <div className="settings-grid">
        {groups.map((group, i) => (
          <section className="panel setting-group" key={group}>
            <div className="group-heading">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{group}</h3>
            </div>
            <table>
              <caption className="sr-only">Setting {group}</caption>
              <thead>
                <tr>
                  <th>Setting ACC</th>
                  <th>Nilai sumber (tekanan ban: cold awal)</th>
                </tr>
              </thead>
              <tbody>
                {catalog.parameters
                  .filter((p) => p.group === group)
                  .map((p) => {
                    const v = record.settings[p.key];
                    return (
                      <tr key={p.key} data-testid={`setting-${p.key}`}>
                        <th scope="row">
                          {p.label}
                          <small>{p.unit === "deg" ? "°" : p.unit}</small>
                          {onLearn && (
                            <button
                              className="learn-inline-link"
                              onClick={() => onLearn(p.key)}
                              aria-label={"Pelajari " + p.label}
                            >
                              Pelajari ↗
                            </button>
                          )}
                        </th>
                        <td
                          className={
                            v?.status !== "available" ? "status-value" : ""
                          }
                        >
                          {p.key === "pitStrategy" &&
                          v?.status === "available" ? (
                            <details>
                              <summary>Lihat template tersimpan</summary>
                              <p className="template-note">
                                Template slot; jumlah stop aktif lihat Pit stops
                                aktif tersimpan. Bukan strategi race yang
                                direkomendasikan.
                              </p>
                              <ul className="pit-templates">
                                {String(v.value)
                                  .split("; Template ")
                                  .map((t, n) => (
                                    <li key={n}>{n ? `Template ${t}` : t}</li>
                                  ))}
                              </ul>
                            </details>
                          ) : (
                            displaySetting(v)
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </article>
  );
}
