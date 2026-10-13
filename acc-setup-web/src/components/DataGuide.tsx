import { useEffect, useState } from "react";
import type { Catalog, SetupRecord } from "../types";
import { loadCar } from "../lib/data";
import { classLabels } from "../lib/selection";

export function DataGuide({
  catalog,
  initialCar,
  onInspect,
  onLearn,
  onOpenLearning,
}: {
  catalog: Catalog;
  initialCar: string;
  onInspect: (r: SetupRecord) => void;
  onLearn?: (parameterKey: string) => void;
  onOpenLearning?: (topicId: string | null) => void;
}) {
  const [carid, setCarid] = useState(initialCar);
  const [scope, setScope] = useState("Spesifik sirkuit");
  const [records, setRecords] = useState<SetupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [page, setPage] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setRecords([]);
    loadCar(carid, catalog, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setRecords(data);
        setLoading(false);
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : "Data gagal dimuat.");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [carid, catalog, retry]);
  const list = records.filter((r) => r.scope === scope);
  return (
    <div className="page-stack">
      <div className="page-title">
        <span className="eyebrow">TRANSPARANSI DATA</span>
        <h1>Data & Panduan</h1>
        <p>Telusuri sumber, cakupan nyata, dan cara membaca hasil.</p>
        {onOpenLearning && (
          <button className="secondary" onClick={() => onOpenLearning(null)}>
            Buka Belajar Setup →
          </button>
        )}
      </div>
      <section className="panel">
        <h2>Snapshot ACC PC {catalog.referenceVersion}</h2>
        <div className="stat-grid">
          {[
            [catalog.counts.cars, "mobil & varian"],
            [catalog.counts.tracks, "sirkuit"],
            [catalog.counts.records.toLocaleString("id-ID"), "setup publik"],
            [`${catalog.counts.pairs}/1350`, "pasangan berisi data spesifik"],
          ].map(([count, text]) => (
            <div key={text}>
              <strong>{count}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p>
          1.241 setup spesifik sirkuit, 206 baseline, dan 155 arsip LFM.
          Snapshot diperiksa {catalog.checked}; bukan pembaruan otomatis.
          Kombinasi tanpa sumber tetap dapat memakai setup bawaan/milik sendiri
          untuk mencatat dan mengevaluasi latihan. BoP sumber tidak disebut;
          tidak ada penanda custom pada data rekomendasi, tetapi kesesuaiannya
          belum diuji.
        </p>
        <div className="source-links">
          <a
            href="https://assettocorsa.gg/assetto-corsa-competizione/"
            target="_blank"
            rel="noreferrer"
          >
            Katalog resmi ACC ↗
          </a>
          <a
            href="https://support.505games.com/support/solutions/articles/150000217831-assetto-corsa-competizione-changelog-v1-10-4-2025-dec-22-pc-"
            target="_blank"
            rel="noreferrer"
          >
            Changelog acuan 1.10.4 ↗
          </a>
          <a
            href={`https://github.com/Lon3035/ACC_Setups/tree/${catalog.repositoryCommit}`}
            target="_blank"
            rel="noreferrer"
          >
            Snapshot repositori ↗
          </a>
          <a href="https://www.accsetups.com/" target="_blank" rel="noreferrer">
            ACCSetups ↗
          </a>
        </div>
        <p className="subtle">
          Atribusi per record berdasarkan nama file/README; tautan pembuat
          disertakan jika tersedia. Tidak mengklaim seluruh file sudah
          dikonfirmasi langsung oleh pembuat. {catalog.excludedCount} file
          bertanda custom/premium dikeluarkan.
        </p>
      </section>
      <section className="panel">
        <div className="section-heading">
          <h2>Pustaka sumber</h2>
          <span className="subtle">
            Baseline dan LFM hanya untuk penelusuran
          </span>
        </div>
        <div className="library-filter">
          <label>
            Mobil pustaka
            <select
              value={carid}
              onChange={(e) => {
                setCarid(e.target.value);
                setPage(0);
              }}
            >
              {catalog.cars.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Jenis data
            <select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value);
                setPage(0);
              }}
            >
              {["Spesifik sirkuit", "Baseline", "Arsip LFM Sprint"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <p role="status">Memuat data mobil…</p>
        ) : error ? (
          <div className="error" role="alert">
            {error}{" "}
            <button onClick={() => setRetry(retry + 1)}>Coba lagi</button>
          </div>
        ) : !list.length ? (
          <p className="empty">
            Belum tersedia untuk mobil dan jenis data ini.
          </p>
        ) : (
          <>
            <div className="table-scroll">
              <table className="library-table">
                <caption className="sr-only">Daftar setup sumber</caption>
                <thead>
                  <tr>
                    <th>ID / pembuat</th>
                    <th>Sirkuit</th>
                    <th>Metadata sumber</th>
                    <th>Versi</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {list.slice(page * 15, (page + 1) * 15).map((r) => (
                    <tr key={r.id}>
                      <td>
                        <code>{r.id}</code>
                        <small>{r.creator}</small>
                      </td>
                      <td>{r.track}</td>
                      <td>
                        {r.condition} · {r.compound}
                        <small>
                          {r.session} · {r.profile}
                        </small>
                      </td>
                      <td>
                        {r.version}
                        <small>{r.known}/68 parameter</small>
                      </td>
                      <td>
                        <button
                          className="secondary compact"
                          onClick={() => onInspect(r)}
                        >
                          Lihat detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                {list.length} sumber · halaman {page + 1}/
                {Math.ceil(list.length / 15)}
              </span>
              <button
                className="secondary compact"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Sebelumnya
              </button>
              <button
                className="secondary compact"
                disabled={(page + 1) * 15 >= list.length}
                onClick={() => setPage(page + 1)}
              >
                Berikutnya
              </button>
            </div>
          </>
        )}
      </section>
      <section className="panel">
        <h2>Cakupan mobil terpilih</h2>
        <p>
          Jumlah setup spesifik per sirkuit untuk{" "}
          <strong>{catalog.cars.find((c) => c.id === carid)?.name}</strong>.
          Jumlah record tidak berarti semua kondisi, sesi, atau karakter sudah
          tersedia.
        </p>
        <div className="coverage-grid">
          {catalog.tracks.map((t) => (
            <div key={t.id}>
              <span>{t.name}</span>
              <strong
                className={
                  catalog.coverage[carid][t.id] ? "has-data" : "no-data"
                }
              >
                {catalog.coverage[carid][t.id] || "Belum tersedia"}
              </strong>
            </div>
          ))}
        </div>
      </section>
      <section className="panel guide">
        <h2>Cara pakai</h2>
        {onOpenLearning && (
          <p>
            Untuk memahami dampak angka,{" "}
            <button
              className="learn-inline-link"
              onClick={() => onOpenLearning("membaca-setup")}
            >
              pelajari cara membaca setup
            </button>{" "}
            atau{" "}
            <button
              className="learn-inline-link"
              onClick={() => onOpenLearning("uji-perubahan")}
            >
              cara menguji perubahan
            </button>
            .
          </p>
        )}
        <ol>
          <li>
            Pilih kelas, mobil/varian, sirkuit, kondisi, sesi, dan karakter di
            Cari Setup. Isi versi game, BoP, suhu dan grip. Untuk damp/drying,
            amati racing line sebelum memilih compound yang akan diuji.
          </li>
          <li>
            Tekan Cari Setup. Sumber diurutkan menurut kompatibilitas yang
            diketahui, metadata sesi, kedekatan suhu, kelengkapan lalu ID.
            “Metadata cocok” tidak membuktikan kesesuaian patch/BoP.
          </li>
          <li>
            Jika kosong, tinjau perbedaan alternatif dan tekan Pakai sebagai
            acuan secara eksplisit untuk sumber belum terverifikasi.
            Mobil/varian, sirkuit, dan compound harus tetap sama. Setup sendiri
            selalu tersedia.
          </li>
          <li>
            Salin Ringkasan atau masukkan angka sumber secara manual mengikuti
            enam menu ACC. FL/FR = depan kiri/kanan; RL/RR = belakang
            kiri/kanan.
          </li>
          <li>
            Catat cold dan fuel aktual, lap pengukuran, hot, kondisi, dan
            konsumsi. Konfirmasi tekanan stabil, run bebas insiden yang
            memengaruhi ban, serta kondisi berikutnya sebanding sebelum angka
            koreksi tersedia. Di dalam rentang target, cold dipertahankan; di
            luar rentang, koreksi menuju batas terdekat. Suhu tidak dipakai
            untuk prediksi cold universal.
          </li>
          <li>
            Rentang slick 26–27 psi adalah acuan historis DHF era v1.9; wet
            30–31 psi adalah acuan publik. Cakupan model/versi dibatasi dan
            belum diuji untuk seluruh mobil/patch. Model yang belum tercakup
            perlu target manual beserta sumbernya. Batas target 20–40 dan
            cold/hot/hasil 10–50 psi adalah batas kewajaran aplikasi, bukan
            slider resmi mobil.
          </li>
          <li>
            Mulai run berikutnya dari hasil tersimpan dan ukur ulang. Bandingkan
            mobil, lintasan, compound dan versi yang sama dengan target yang
            sama. Evaluasi memakai deviasi tekanan; app tidak menilai
            peningkatan waktu lap.
          </li>
          <li>
            Simpan favorit/latihan, lalu ekspor backup dari Riwayat Latihan.
            Schema v2 menjaga snapshot rekomendasi dan menerima backup v1 dengan
            target lama tetap manual, konteks baru belum diketahui. Data berada
            di browser pada alamat 127.0.0.1:5173; browser, profil, port, atau
            host lain memakai penyimpanan berbeda.
          </li>
        </ol>
        <div className="legend">
          <p>
            <strong>0</strong> adalah nilai sah. <strong>Tidak berlaku</strong>{" "}
            berarti parameter tidak dapat diatur pada model tersebut.{" "}
            <strong>Data sumber kosong</strong> berarti belum tercatat.{" "}
            <strong>Konversi belum terverifikasi</strong> berarti indeks mentah
            tidak boleh dibaca sebagai mm/derajat/persen.
          </p>
          <p>
            Template pit tersimpan tidak berarti pit aktif. Setup lama, metadata
            “Tidak disebut”, Wet umum, dan Race umum tidak diubah menjadi varian
            hasil pengujian baru.
          </p>
        </div>
      </section>
      <section className="panel">
        <details>
          <summary>
            Katalog seluruh mobil dan DLC ({catalog.cars.length})
          </summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Mobil</th>
                  <th>Kelas</th>
                  <th>DLC</th>
                </tr>
              </thead>
              <tbody>
                {catalog.cars.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <a href={c.source} target="_blank" rel="noreferrer">
                        {c.name}
                      </a>
                    </td>
                    <td>{classLabels[c.class]}</td>
                    <td>{c.dlc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <details>
          <summary>
            Katalog seluruh sirkuit dan DLC ({catalog.tracks.length})
          </summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Sirkuit / layout</th>
                  <th>DLC</th>
                </tr>
              </thead>
              <tbody>
                {catalog.tracks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <a href={t.source} target="_blank" rel="noreferrer">
                        {t.name}
                      </a>
                    </td>
                    <td>{t.dlc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <details>
          <summary>Kamus parameter ({catalog.parameters.length})</summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Menu</th>
                  <th>Setting</th>
                  <th>Satuan</th>
                  <th>Pelajaran</th>
                </tr>
              </thead>
              <tbody>
                {catalog.parameters.map((p) => (
                  <tr key={p.key}>
                    <td>{p.group}</td>
                    <td>{p.label}</td>
                    <td>{p.unit}</td>
                    <td>
                      {onLearn && (
                        <button
                          className="learn-inline-link"
                          onClick={() => onLearn(p.key)}
                          aria-label={"Pelajari " + p.label}
                        >
                          Pelajari ↗
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <details>
          <summary>Identitas snapshot</summary>
          <p className="break-word">
            Repositori: <code>{catalog.repositoryCommit}</code>
            <br />
            Pemetaan: <code>{catalog.mappingCommit}</code>
            <br />
            SHA-256 sumber: <code>{catalog.snapshotSha256}</code>
          </p>
        </details>
      </section>
    </div>
  );
}
