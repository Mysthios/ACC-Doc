import { useState } from "react";
import type { Catalog, PracticeLog } from "../types";
import { compareRuns } from "../lib/recommendations";

export function RunComparison({
  logs,
  catalog,
}: {
  logs: PracticeLog[];
  catalog: Catalog;
}) {
  const [first, setFirst] = useState(""),
    [second, setSecond] = useState("");
  const a = logs.find((l) => l.id === first),
    b = logs.find((l) => l.id === second);
  const result = a && b && a.id !== b.id ? compareRuns(a, b) : null;
  const label = (l: PracticeLog) =>
    (catalog.cars.find((c) => c.id === l.carid)?.name ?? l.carid) +
    " · " +
    (catalog.tracks.find((t) => t.id === l.trackid)?.name ?? l.trackid) +
    " · " +
    new Date(l.createdAt).toLocaleString("id-ID");
  return (
    <section className="panel" data-testid="run-comparison">
      <h2>Bandingkan run</h2>
      <p>
        Evaluasi deviasi tekanan terhadap target. Pilih dua run pada mobil,
        lintasan, compound, dan versi yang sama.
      </p>
      <div className="context-grid">
        {[
          ["Run A", first, setFirst],
          ["Run B", second, setSecond],
        ].map(([name, value, setter]) => (
          <label key={name as string}>
            {name as string}
            <select
              value={value as string}
              onChange={(e) => (setter as (id: string) => void)(e.target.value)}
            >
              <option value="">Pilih run</option>
              {logs.map((l) => (
                <option value={l.id} key={l.id}>
                  {label(l)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {a && b && a.id === b.id && (
        <p className="validation">Pilih dua run yang berbeda.</p>
      )}
      {result && (
        <>
          {!result.comparable && (
            <p className="validation">
              Mobil, lintasan, compound atau versi berbeda/tidak diketahui.
              Evaluasi perubahan belum tersedia.
            </p>
          )}
          {result.changes.length > 0 && (
            <>
              <strong>Perbedaan kondisi</strong>
              <ul>
                {result.changes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="subtle">
                Perbedaan kondisi perlu ditinjau sebelum mengaitkan hasil dengan
                perubahan setup.
              </p>
            </>
          )}
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Roda</th>
                  <th>Deviasi A</th>
                  <th>Deviasi B</th>
                  <th>Hasil</th>
                </tr>
              </thead>
              <tbody>
                {result.values.map((v) => (
                  <tr key={v.wheel}>
                    <th>{v.wheel}</th>
                    <td>
                      {v.before === null ? "—" : v.before.toFixed(2) + " psi"}
                    </td>
                    <td>
                      {v.after === null ? "—" : v.after.toFixed(2) + " psi"}
                    </td>
                    <td>
                      {v.improvement === null
                        ? "Perlu target/pengukuran sebanding"
                        : v.improvement > 0
                          ? "Deviasi berkurang " +
                            v.improvement.toFixed(2) +
                            " psi"
                          : v.improvement < 0
                            ? "Deviasi bertambah " +
                              Math.abs(v.improvement).toFixed(2) +
                              " psi"
                            : "Deviasi tetap"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="subtle">
            Penilaian ini tidak mengukur peningkatan waktu lap.
          </p>
        </>
      )}
    </section>
  );
}
