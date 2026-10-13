import { useEffect, useRef, useState } from "react";
import {
  conditions,
  profiles,
  sessions,
  wheels,
  type Catalog,
  type PersonalState,
  type Selection,
  type SetupRecord,
  type SessionContext,
  type PracticeLog,
} from "./types";
import { loadCar, loadCatalog } from "./lib/data";
import {
  classLabels,
  classOrder,
  copySummary,
  defaultSelection,
  differences,
  findSetups,
  compatibilityScore,
} from "./lib/selection";
import {
  exportBackup,
  mergePersonal,
  parseBackup,
  readPersonal,
  writePersonal,
} from "./lib/storage";
import { SetupDetail } from "./components/SetupDetail";
import { Practice } from "./components/Practice";
import { DataGuide } from "./components/DataGuide";
import { SessionFields } from "./components/SessionFields";
import { RecommendationCard } from "./components/RecommendationCard";
import { RunComparison } from "./components/RunComparison";
import { emptyContext } from "./lib/context";
import {
  draftFromSource,
  nextRunDraft,
  pressureInputIssue,
  recommendRun,
  runResults,
} from "./lib/recommendations";
import { numberInput } from "./lib/calculators";
import { LearningLesson, LearningPage } from "./components/Learning";
import { readLearningHash, topicById, topicForParameter } from "./lib/learning";

type Tab =
  | "Cari Setup"
  | "Favorit"
  | "Riwayat Latihan"
  | "Data & Panduan"
  | "Belajar Setup";
export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [learningRoute, setLearningRoute] = useState(() =>
    readLearningHash(window.location.hash),
  );
  useEffect(() => {
    const read = () => setLearningRoute(readLearningHash(window.location.hash));
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  function openLearning(id: string | null) {
    const hash = id ? "#belajar/" + encodeURIComponent(id) : "#belajar";
    window.location.hash = hash;
    setLearningRoute(readLearningHash(hash));
  }
  function leaveLearning() {
    if (readLearningHash(window.location.hash).active)
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    setLearningRoute({ active: false, topicId: null });
  }
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    loadCatalog(controller.signal)
      .then(setCatalog)
      .catch((e) => {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "Katalog gagal dimuat.");
      });
    return () => controller.abort();
  }, [retry]);
  if (!catalog && learningRoute.active)
    return (
      <>
        <header className="learn-standalone-header">
          <strong>ACC Setup · belajar lokal</strong>
          <button className="secondary compact" onClick={leaveLearning}>
            Kembali ke garasi
          </button>
        </header>
        <main className="main-container">
          <LearningPage
            topicId={learningRoute.topicId}
            onOpenTopic={openLearning}
          />
        </main>
      </>
    );
  if (!catalog)
    return (
      <main className="boot">
        <div className="brand-mark">A</div>
        <h1>ACC Setup</h1>
        {error ? (
          <div role="alert">
            <p>{error}</p>
            <button className="primary" onClick={() => setRetry(retry + 1)}>
              Coba lagi
            </button>
          </div>
        ) : (
          <p role="status">Menyiapkan katalog garasi…</p>
        )}
        <button className="secondary" onClick={() => openLearning(null)}>
          Belajar Setup
        </button>
      </main>
    );
  return (
    <Garage
      catalog={catalog}
      learningRoute={learningRoute}
      onOpenLearning={openLearning}
      onLeaveLearning={leaveLearning}
    />
  );
}

function Garage({
  catalog,
  learningRoute,
  onOpenLearning,
  onLeaveLearning,
}: {
  catalog: Catalog;
  learningRoute: ReturnType<typeof readLearningHash>;
  onOpenLearning: (id: string | null) => void;
  onLeaveLearning: () => void;
}) {
  const [initial] = useState(() => readPersonal(catalog));
  const [personal, setPersonal] = useState<PersonalState>(initial.state);
  const personalRef = useRef(personal);
  const [selection, setSelection] = useState<Selection>(
    () => initial.state.lastSelection ?? defaultSelection(catalog),
  );
  const [baseTab, setBaseTab] = useState<Tab>("Cari Setup");
  const tab = learningRoute.active ? "Belajar Setup" : baseTab;
  function setTab(next: Tab) {
    if (next === "Belajar Setup") onOpenLearning(null);
    else {
      setBaseTab(next);
      onLeaveLearning();
    }
  }
  const [context, setContext] = useState<SessionContext>(
    () =>
      initial.state.lastContext ??
      emptyContext(catalog.referenceVersion, selection.condition),
  );
  const [ownSetup, setOwnSetup] = useState(false);
  const [previousLogId, setPreviousLogId] = useState<string | null>(null);
  const [records, setRecords] = useState<SetupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [retry, setRetry] = useState(0);
  const [searched, setSearched] = useState(false);
  const [active, setActive] = useState<SetupRecord | null>(null);
  const [activeMode, setActiveMode] = useState<"exact" | "reference">("exact");
  const [draft, setDraft] = useState(() => draftFromSource(context, null));
  const [altPage, setAltPage] = useState(0);
  const [inspected, setInspected] = useState<SetupRecord | null>(null);
  const [lessonHelp, setLessonHelp] = useState<{
    topicId: string;
    parameterKey?: string;
    returnParameterKey?: string;
  } | null>(null);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(
    null,
  );
  const [storageError, setStorageError] = useState(initial.error);
  const [importing, setImporting] = useState(false);
  const modal = useRef<HTMLDialogElement>(null);
  const dialogTrigger = useRef<HTMLElement | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const inspectRequest = useRef(0);
  useEffect(() => {
    if (initial.migrated && initial.writable) {
      const error = writePersonal(initial.state);
      if (error) setStorageError(error);
    }
  }, [initial]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setRecords([]);
    setDataError("");
    loadCar(selection.carid, catalog, controller.signal)
      .then((r) => {
        if (controller.signal.aborted) return;
        setRecords(r);
        setLoading(false);
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setDataError(
            e instanceof Error ? e.message : "Data mobil gagal dimuat.",
          );
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [selection.carid, catalog, retry]);
  useEffect(() => {
    if ((inspected || lessonHelp) && modal.current && !modal.current.open) {
      dialogTrigger.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      modal.current.showModal();
    }
    if (lessonHelp)
      modal.current
        ?.querySelector<HTMLElement>(".learn-lesson-header h2")
        ?.focus();
  }, [inspected, lessonHelp]);
  function openParameterHelp(key: string) {
    const topic = topicForParameter(key);
    if (topic)
      setLessonHelp({
        topicId: topic.id,
        parameterKey: key,
        returnParameterKey: key,
      });
  }
  function closeDetail() {
    modal.current?.close();
    setLessonHelp(null);
    setInspected(null);
    restoreDialogFocus();
  }
  function restoreDialogFocus() {
    requestAnimationFrame(() => {
      if (dialogTrigger.current?.isConnected)
        dialogTrigger.current.focus({ preventScroll: true });
    });
  }
  function notify(text: string, error = false) {
    setNotice({ text, error });
  }
  function persist(next: PersonalState): boolean {
    personalRef.current = next;
    setPersonal(next);
    const error = initial.writable ? writePersonal(next) : initial.error;
    if (error) {
      setStorageError(error);
      notify(error, true);
      return false;
    }
    setStorageError(null);
    return true;
  }
  function updateSelection(next: Selection) {
    const nextContext = { ...context, condition: next.condition };
    setContext(nextContext);
    setOwnSetup(false);
    setPreviousLogId(null);
    setSelection(next);
    setSearched(false);
    setActive(null);
    setDraft(draftFromSource(nextContext, null));
    setAltPage(0);
    setNotice(null);
    persist({ ...personal, lastSelection: next, lastContext: nextContext });
  }
  function updateContext(next: SessionContext) {
    setContext(next);
    setSearched(false);
    setActive(null);
    setOwnSetup(false);
    setPreviousLogId(null);
    setDraft(draftFromSource(next, null));
    setAltPage(0);
    persist({ ...personal, lastContext: next });
  }
  function selectSetup(r: SetupRecord, mode: "exact" | "reference") {
    setOwnSetup(false);
    setPreviousLogId(null);
    setActive(r);
    setActiveMode(mode);
    setDraft(draftFromSource(context, r));
  }
  const found = findSetups(records, selection, context);
  function search() {
    setSearched(true);
    setAltPage(0);
    setNotice(null);
    const verified =
      found.exact.find((r) => compatibilityScore(r, context) === 3) ?? null;
    setDraft(draftFromSource(context, verified));
    setActive(verified);
    setOwnSetup(false);
    setPreviousLogId(null);
    setActiveMode("exact");
  }
  function useOwnSetup() {
    setSearched(true);
    setActive(null);
    setOwnSetup(true);
    setPreviousLogId(null);
    setDraft(draftFromSource(context, null));
  }
  function startNextRun(log: PracticeLog) {
    const next = nextRunDraft(log);
    const condition =
      next.context.condition === "Unknown"
        ? log.selection.condition
        : next.context.condition;
    const nextSelection = {
      ...log.selection,
      condition,
      compound:
        condition === "Dry"
          ? ("Dry slick" as const)
          : ["Light wet", "Heavy wet"].includes(condition)
            ? ("Wet" as const)
            : log.selection.compound,
    };
    setSelection(nextSelection);
    setContext(next.context);
    setDraft(next);
    setActive(null);
    setOwnSetup(true);
    setPreviousLogId(log.id);
    setSearched(true);
    setTab("Cari Setup");
    persist({
      ...personal,
      lastSelection: nextSelection,
      lastContext: next.context,
    });
    notify(
      "Run berikutnya dimulai dari tekanan hasil run sebelumnya. Isi pengukuran baru dan konfirmasi kondisinya.",
    );
  }
  function sourceSelection(r: SetupRecord): Selection {
    if (
      r.carid === selection.carid &&
      r.trackid === selection.trackid &&
      r.compound === selection.compound
    )
      return selection;
    return {
      className: catalog.cars.find((c) => c.id === r.carid)!.class,
      carid: r.carid,
      trackid: r.trackid,
      condition: conditions.includes(r.condition as Selection["condition"])
        ? (r.condition as Selection["condition"])
        : r.compound === "Wet"
          ? "Heavy wet"
          : "Dry",
      session: sessions.includes(r.session as Selection["session"])
        ? (r.session as Selection["session"])
        : "Sprint race",
      profile: profiles.includes(r.profile as Selection["profile"])
        ? (r.profile as Selection["profile"])
        : "Stabil",
      compound: r.compound as Selection["compound"],
    };
  }
  function toggleFavorite(r: SetupRecord) {
    const exists = personal.favorites.some((f) => f.id === r.id);
    const favorites = exists
      ? personal.favorites.filter((f) => f.id !== r.id)
      : [
          ...personal.favorites,
          {
            id: r.id,
            selection: sourceSelection(r),
            createdAt: new Date().toISOString(),
          },
        ];
    if (persist({ ...personal, favorites }))
      notify(exists ? "Favorit dihapus." : "Setup disimpan ke Favorit.");
  }
  async function copy(r: SetupRecord, s?: Selection) {
    try {
      await navigator.clipboard.writeText(copySummary(r, catalog, s));
      notify("Ringkasan berhasil disalin.");
    } catch {
      notify(
        "Browser menolak akses clipboard. Blok tabel setting atau coba salin dari browser biasa pada alamat lokal.",
        true,
      );
    }
  }
  function savePractice() {
    if (!active && !ownSetup) return;
    if (
      draft.actualFuel.trim() &&
      (numberInput(draft.actualFuel) === null ||
        numberInput(draft.actualFuel)! < 0)
    ) {
      notify("Fuel aktual harus angka 0 L atau lebih.", true);
      return;
    }
    const recommendation = recommendRun(selection, draft, active);
    for (const wheel of wheels) {
      const issue = pressureInputIssue(draft, selection, wheel);
      if (issue || recommendation.pressures[wheel].status === "invalid") {
        notify(
          wheel + ": " + (issue || recommendation.pressures[wheel].reason),
          true,
        );
        return;
      }
    }
    const results = runResults(recommendation);
    if (
      !results.fuel &&
      !wheels.some((w) => results.pressures[w] !== null) &&
      !wheels.some(
        (w) => draft.pressures[w].cold.trim() || draft.pressures[w].hot.trim(),
      ) &&
      !draft.notes.trim()
    ) {
      notify(
        "Isi hasil hitung yang lengkap atau catatan latihan sebelum menyimpan.",
        true,
      );
      return;
    }
    if (personal.logs.length >= 2000) {
      notify(
        "Batas 2.000 latihan tercapai. Ekspor backup dan hapus riwayat yang tidak dibutuhkan sebelum menambah latihan.",
        true,
      );
      return;
    }
    const log: PracticeLog = {
      id: crypto.randomUUID(),
      setupId: active?.id ?? null,
      carid: selection.carid,
      trackid: selection.trackid,
      selection: { ...selection },
      createdAt: new Date().toISOString(),
      draft: structuredClone(draft),
      results,
      recommendation,
      sourceSnapshot: active
        ? {
            id: active.id,
            name: active.name,
            creator: active.creator,
            version: active.version,
            ambient: active.ambient,
            tracktemp: active.tracktemp,
            source: active.source,
          }
        : null,
      previousLogId,
      legacy: false,
    };
    if (persist({ ...personal, logs: [...personal.logs, log] }))
      notify("Latihan disimpan. Buka Riwayat Latihan untuk melihatnya.");
  }
  async function inspect(id: string) {
    const request = ++inspectRequest.current;
    const summary = catalog.index.find((r) => r.id === id);
    if (!summary) {
      notify("ID setup tidak ada dalam snapshot.", true);
      return;
    }
    try {
      const records = await loadCar(summary.carid, catalog);
      const r = records.find((r) => r.id === id);
      if (request !== inspectRequest.current) return;
      if (!r) throw Error("Setup tidak ada pada file data mobil.");
      setInspected(r);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Gagal memuat detail.", true);
    }
  }
  function downloadBackup() {
    const url = URL.createObjectURL(
      new Blob([exportBackup(personal)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `acc-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Backup JSON diekspor.");
  }
  async function importFile(file: File) {
    setImporting(true);
    try {
      if (file.size > 8 * 1024 * 1024)
        throw Error("Backup terlalu besar. Batas file 8 MB.");
      const incoming = parseBackup(await file.text(), catalog);
      // Gabungkan ke state terbaru jika pengguna membuat catatan saat file dibaca.
      const current = personalRef.current;
      const merged = mergePersonal(current, incoming);
      if (merged.logs.length > 2000)
        throw Error(
          "Hasil gabungan melebihi batas 2.000 latihan. Tidak ada data yang dihapus.",
        );
      const saved = persist(merged);
      if (current.lastSelection === null && merged.lastSelection !== null) {
        setSelection(merged.lastSelection);
        setSearched(false);
        setActive(null);
        const restoredContext =
          merged.lastContext ??
          emptyContext(
            catalog.referenceVersion,
            merged.lastSelection.condition,
          );
        setDraft(draftFromSource(restoredContext, null));
        setContext(restoredContext);
        setOwnSetup(false);
        setAltPage(0);
      }
      if (saved)
        notify(
          `Backup digabungkan: ${merged.favorites.length - current.favorites.length} favorit dan ${merged.logs.length - current.logs.length} latihan baru. Catatan lama dipertahankan.`,
        );
    } catch (e) {
      notify(e instanceof Error ? e.message : "Gagal membaca backup.", true);
    } finally {
      setImporting(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }
  const detailProps = (r: SetupRecord) => ({
    record: r,
    catalog,
    onCopy: () => copy(r, r === active ? selection : undefined),
    onFavorite: () => toggleFavorite(r),
    favorite: personal.favorites.some((f) => f.id === r.id),
    onLearn: openParameterHelp,
  });
  return (
    <>
      <a href="#main" className="skip-link">
        Lewati ke konten
      </a>
      <header className="app-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#main"
            onClick={() => setTab("Cari Setup")}
          >
            <span className="brand-mark">A</span>
            <span>
              ACC <strong>Setup</strong>
              <small>GARASI PRIBADI</small>
            </span>
          </a>
          <nav aria-label="Navigasi utama">
            {(
              [
                "Cari Setup",
                "Belajar Setup",
                "Favorit",
                "Riwayat Latihan",
                "Data & Panduan",
              ] as Tab[]
            ).map((t) => (
              <button
                key={t}
                className={tab === t ? "nav-active" : ""}
                aria-current={tab === t ? "page" : undefined}
                onClick={() => {
                  setTab(t);
                  setNotice(null);
                }}
              >
                {t}
                {t === "Favorit" && personal.favorites.length > 0 && (
                  <span className="nav-count">{personal.favorites.length}</span>
                )}
              </button>
            ))}
          </nav>
          <span className="local-indicator">
            <span /> Lokal
          </span>
        </div>
      </header>
      <main id="main" className="main-container" tabIndex={-1}>
        {storageError && (
          <div className="error storage-alert" role="alert">
            {storageError}
          </div>
        )}
        {notice && (
          <div
            className={`notice ${notice.error ? "error" : "success"}`}
            role={notice.error ? "alert" : "status"}
          >
            <span>{notice.text}</span>
            <button
              aria-label="Tutup pemberitahuan"
              onClick={() => setNotice(null)}
            >
              ×
            </button>
          </div>
        )}
        {tab === "Cari Setup" && (
          <div className="page-stack">
            <div className="hero">
              <div>
                <span className="eyebrow">ASSETTO CORSA COMPETIZIONE · PC</span>
                <h1>
                  Setup untuk sesi
                  <br className="desktop-break" /> berikutnya.
                </h1>
                <p>
                  Pilih mobil dan sirkuit. Temukan sumber yang cocok,
                  <br className="desktop-break" /> lalu sesuaikan fuel dan
                  tekanan dari latihanmu.
                </p>
              </div>
              <div className="hero-stats">
                <div>
                  <strong>54</strong>
                  <span>mobil & varian</span>
                </div>
                <div>
                  <strong>25</strong>
                  <span>sirkuit</span>
                </div>
                <div>
                  <strong>1.602</strong>
                  <span>setup publik</span>
                </div>
              </div>
            </div>
            <section className="panel search-panel">
              <div className="section-heading">
                <h2>
                  <span className="step-mark">01</span> Pilih kombinasi
                </h2>
                <span className="subtle">
                  Acuan ACC {catalog.referenceVersion}
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  search();
                }}
              >
                <div className="car-grid">
                  <label>
                    Kelas mobil
                    <select
                      value={selection.className}
                      onChange={(e) =>
                        updateSelection({
                          ...selection,
                          className: e.target.value,
                          carid: catalog.cars.find(
                            (c) => c.class === e.target.value,
                          )!.id,
                        })
                      }
                    >
                      {classOrder.map((c) => (
                        <option value={c} key={c}>
                          {classLabels[c]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Mobil & varian
                    <select
                      value={selection.carid}
                      onChange={(e) =>
                        updateSelection({ ...selection, carid: e.target.value })
                      }
                    >
                      {catalog.cars
                        .filter((c) => c.class === selection.className)
                        .map((c) => (
                          <option value={c.id} key={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Sirkuit
                    <select
                      value={selection.trackid}
                      onChange={(e) =>
                        updateSelection({
                          ...selection,
                          trackid: e.target.value,
                        })
                      }
                    >
                      {catalog.tracks.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="session-grid">
                  <label>
                    Kondisi
                    <select
                      value={selection.condition}
                      onChange={(e) => {
                        const condition = e.target
                          .value as Selection["condition"];
                        updateSelection({
                          ...selection,
                          condition,
                          compound:
                            condition === "Dry"
                              ? "Dry slick"
                              : ["Light wet", "Heavy wet"].includes(condition)
                                ? "Wet"
                                : selection.compound,
                        });
                      }}
                    >
                      {conditions.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Sesi
                    <select
                      value={selection.session}
                      onChange={(e) =>
                        updateSelection({
                          ...selection,
                          session: e.target.value as Selection["session"],
                        })
                      }
                    >
                      {sessions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Karakter
                    <select
                      value={selection.profile}
                      onChange={(e) =>
                        updateSelection({
                          ...selection,
                          profile: e.target.value as Selection["profile"],
                        })
                      }
                    >
                      {profiles.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Compound
                    <select
                      value={selection.compound}
                      disabled={
                        !["Damp", "Drying"].includes(selection.condition)
                      }
                      onChange={(e) =>
                        updateSelection({
                          ...selection,
                          compound: e.target.value as Selection["compound"],
                        })
                      }
                    >
                      <option value="Dry slick">Slick (dry)</option>
                      <option value="Wet">Wet</option>
                    </select>
                  </label>
                </div>
                <h3>Konteks sesi</h3>
                <SessionFields
                  value={context}
                  prefix="sesi"
                  onChange={updateContext}
                />
                <div className="search-footer">
                  <p>
                    Stabil sebagai pilihan awal. “Terbaik” berarti kecocokan
                    sumber dan kelengkapan data.
                  </p>
                  <button
                    type="submit"
                    className="primary search-button"
                    disabled={loading || !!dataError}
                  >
                    {loading ? "Memuat data…" : "Cari Setup"}{" "}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
              {dataError && (
                <div className="error" role="alert">
                  {dataError}{" "}
                  <button
                    className="secondary compact"
                    onClick={() => setRetry(retry + 1)}
                  >
                    Coba lagi
                  </button>
                </div>
              )}
            </section>
            <div className="own-setup-action">
              <button
                type="button"
                className="secondary"
                disabled={ownSetup}
                onClick={useOwnSetup}
              >
                Gunakan setup bawaan/milik sendiri
              </button>
              <p className="subtle">
                Latihan tersedia tanpa sumber katalog. Masukkan tekanan dan fuel
                aktual.
              </p>
            </div>
            {searched && (
              <RecommendationCard
                draft={draft}
                selection={selection}
                record={active}
                ready={!!active || ownSetup}
              />
            )}
            {!searched && (
              <div className="search-hint">
                <span className="hint-symbol" aria-hidden="true">
                  ↳
                </span>
                <div>
                  <strong>Mulai dari kombinasi di atas.</strong>
                  <p>
                    Hasil akan menampilkan nilai sumber, metadata, dan detail
                    setting mengikuti menu ACC.
                  </p>
                </div>
              </div>
            )}
            {searched && !active && !ownSetup && (
              <section className="panel empty-state" data-testid="empty-result">
                <span className="badge warning">Belum tersedia</span>
                <h2>
                  {found.exact.length
                    ? "Pilih acuan dengan metadata cocok."
                    : "Tidak ada kecocokan persis."}
                </h2>
                <p>
                  {found.exact.length
                    ? "Sumber belum terverifikasi untuk sesi ini. Tinjau lalu pilih sebagai acuan secara eksplisit."
                    : found.alternatives.length
                      ? "Ada sumber dengan metadata yang lebih umum. Tinjau perbedaannya, lalu pilih sebagai acuan di bawah."
                      : "Snapshot ini belum punya sumber yang memenuhi kombinasi maupun aturan alternatif. Ubah pilihan untuk mencari kombinasi lain."}
                </p>
                <p className="subtle">
                  {selection.condition} · {selection.session} ·{" "}
                  {selection.profile} · {selection.compound}
                </p>
              </section>
            )}
            {active && (
              <details className="panel source-details">
                <summary>Detail sumber dan seluruh parameter</summary>
                <SetupDetail
                  {...detailProps(active)}
                  selection={selection}
                  mode={activeMode}
                />
              </details>
            )}
            {(active || ownSetup) && (
              <Practice
                draft={draft}
                setDraft={setDraft}
                record={active}
                selection={selection}
                onSave={savePractice}
                onLearn={openParameterHelp}
              />
            )}
            {searched && found.exact.length > 0 && (
              <section className="panel">
                <h2>Sumber dengan metadata cocok</h2>
                <div className="candidate-list">
                  {found.exact.map((r) => (
                    <div className="candidate" key={r.id}>
                      <div>
                        <strong>{r.creator}</strong>
                        <span>
                          {r.id} · {r.known}/68 parameter · {r.version}
                        </span>
                      </div>
                      <button
                        className="secondary compact"
                        disabled={active?.id === r.id}
                        onClick={() => selectSetup(r, "exact")}
                      >
                        {active?.id === r.id
                          ? "Sedang dipakai"
                          : "Pakai sebagai acuan"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {searched && found.alternatives.length > 0 && (
              <section className="panel alternatives">
                <div className="section-heading">
                  <h2>Alternatif sumber</h2>
                  <span className="subtle">
                    {found.alternatives.length} tersedia · pilih eksplisit
                  </span>
                </div>
                <p>
                  Mobil/varian, sirkuit, dan compound tetap sama. Perbedaan
                  metadata di bawah belum diuji untuk pilihanmu.
                </p>
                <div className="candidate-list">
                  {found.alternatives
                    .slice(altPage * 6, (altPage + 1) * 6)
                    .map((r) => (
                      <div className="candidate" key={r.id}>
                        <div>
                          <strong>
                            {r.creator} <code>{r.id}</code>
                          </strong>
                          <span>
                            {r.known}/68 parameter · {r.version} · {r.compound}
                          </span>
                          <ul>
                            {differences(r, selection).map((d) => (
                              <li key={d}>{d}</li>
                            ))}
                          </ul>
                        </div>
                        <button
                          className="secondary"
                          disabled={active?.id === r.id}
                          onClick={() => selectSetup(r, "reference")}
                        >
                          {active?.id === r.id
                            ? "Sedang dipakai"
                            : "Pakai sebagai acuan"}
                        </button>
                      </div>
                    ))}
                </div>
                {found.alternatives.length > 6 && (
                  <div className="pagination">
                    <span>
                      Halaman {altPage + 1}/
                      {Math.ceil(found.alternatives.length / 6)}
                    </span>
                    <button
                      className="secondary compact"
                      disabled={altPage === 0}
                      onClick={() => setAltPage(altPage - 1)}
                    >
                      Sebelumnya
                    </button>
                    <button
                      className="secondary compact"
                      disabled={(altPage + 1) * 6 >= found.alternatives.length}
                      onClick={() => setAltPage(altPage + 1)}
                    >
                      Berikutnya
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
        {tab === "Favorit" && (
          <div className="page-stack">
            <div className="page-title">
              <span className="eyebrow">GARASI TERSIMPAN</span>
              <h1>Favorit</h1>
              <p>{personal.favorites.length} setup disimpan di browser ini.</p>
            </div>
            {!personal.favorites.length ? (
              <section className="panel empty-state">
                <h2>Belum ada favorit.</h2>
                <p>Temukan sumber di Cari Setup, lalu tekan Simpan Favorit.</p>
                <button
                  className="primary"
                  onClick={() => setTab("Cari Setup")}
                >
                  Cari Setup
                </button>
              </section>
            ) : (
              personal.favorites.map((f) => {
                const r = catalog.index.find((r) => r.id === f.id)!;
                return (
                  <section className="panel saved-card" key={f.id}>
                    <span className="eyebrow">{r.scope}</span>
                    <h2>{r.car}</h2>
                    <p>
                      {r.track} · {r.creator}
                    </p>
                    <p className="subtle">
                      Metadata sumber: {r.condition} · {r.session} · {r.profile}{" "}
                      · {r.compound}
                    </p>
                    <code>{r.id}</code>
                    <div className="action-row">
                      <button className="primary" onClick={() => inspect(f.id)}>
                        Lihat detail
                      </button>
                      <button
                        className="secondary"
                        onClick={() => {
                          updateSelection(f.selection);
                          setTab("Cari Setup");
                        }}
                      >
                        Cari kombinasi ini
                      </button>
                      <button
                        className="text-button"
                        onClick={() => {
                          if (
                            persist({
                              ...personal,
                              favorites: personal.favorites.filter(
                                (old) => old.id !== f.id,
                              ),
                            })
                          )
                            notify("Favorit dihapus.");
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </section>
                );
              })
            )}
          </div>
        )}
        {tab === "Riwayat Latihan" && (
          <div className="page-stack">
            <div className="page-title">
              <span className="eyebrow">CATATAN PRIBADI</span>
              <h1>Riwayat Latihan</h1>
              <p>
                Setting aktual, pengukuran, dan rekomendasi saat run disimpan.
              </p>
            </div>
            <section className="panel backup-panel">
              <div>
                <h2>Backup pribadi</h2>
                <p>
                  Ekspor pilihan, favorit, dan riwayat. Impor menggabungkan ID
                  baru serta menjaga catatan lama.
                </p>
                <p className="subtle">
                  Penyimpanan lokal di browser pada origin ini. Tidak ada
                  sinkronisasi cloud.
                </p>
              </div>
              <div className="action-row">
                <button className="secondary" onClick={downloadBackup}>
                  Ekspor Backup
                </button>
                <button
                  className="primary"
                  disabled={importing}
                  onClick={() => fileInput.current?.click()}
                >
                  {importing ? "Memvalidasi…" : "Impor Backup"}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".json,application/json"
                  className="sr-only"
                  aria-label="File backup JSON"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void importFile(file);
                  }}
                />
              </div>
            </section>
            {!personal.logs.length ? (
              <section className="panel empty-state">
                <h2>Belum ada latihan tersimpan.</h2>
                <p>
                  Buka Hasil Latihan setelah memilih setup untuk mencatat fuel,
                  tekanan, dan konteksnya.
                </p>
              </section>
            ) : (
              <>
                <RunComparison
                  logs={[...personal.logs].reverse()}
                  catalog={catalog}
                />
                {[...personal.logs].reverse().map((log) => (
                  <section className="panel log-card" key={log.id}>
                    <div className="section-heading">
                      <div>
                        <span className="eyebrow">
                          {new Date(log.createdAt).toLocaleString("id-ID")}
                        </span>
                        <h2>
                          {catalog.cars.find((c) => c.id === log.carid)?.name}
                        </h2>
                        <p>
                          {
                            catalog.tracks.find((t) => t.id === log.trackid)
                              ?.name
                          }{" "}
                          · {log.selection.condition} · {log.selection.session}{" "}
                          · {log.selection.profile}
                        </p>
                      </div>
                      <code>{log.setupId ?? "Setup sendiri"}</code>
                    </div>
                    <p className="subtle">
                      Versi pengukuran: {log.draft.context.gameVersion} · target{" "}
                      {log.draft.targetMode === "range" ? "rentang" : "manual"}{" "}
                      · fuel aktual {log.draft.actualFuel || "—"} L.
                    </p>
                    {log.legacy && (
                      <p className="reference-note">
                        Data v1: versi/kualitas pengukuran belum diketahui.
                        Target lama tetap manual; hasil historis bukan koreksi
                        baru.
                      </p>
                    )}
                    {log.sourceSnapshot && (
                      <p className="subtle">
                        Sumber saat run: {log.sourceSnapshot.creator} ·{" "}
                        {log.sourceSnapshot.name} · versi{" "}
                        {log.sourceSnapshot.version} · udara/lintasan{" "}
                        {log.sourceSnapshot.ambient ?? "—"}/
                        {log.sourceSnapshot.tracktemp ?? "—"} °C.
                      </p>
                    )}
                    {log.previousLogId && (
                      <p className="subtle">Lanjutan run {log.previousLogId}</p>
                    )}
                    <div className="log-results">
                      <div>
                        <span>Fuel tepat / disiapkan</span>
                        <strong>
                          {log.results.fuel
                            ? `${Number(log.results.fuel.exact.toFixed(3))} / ${log.results.fuel.prepared} L`
                            : "Belum dihitung"}
                        </strong>
                      </div>
                      <div>
                        <span>Cold berikutnya FL / FR / RL / RR</span>
                        <strong>
                          {wheels
                            .map(
                              (w) =>
                                log.results.pressures[w]?.toFixed(1) ?? "—",
                            )
                            .join(" / ")}{" "}
                          psi
                        </strong>
                      </div>
                      <div>
                        <span>Udara / lintasan · grip</span>
                        <strong>
                          {log.draft.air || "—"} / {log.draft.track || "—"} °C ·{" "}
                          {log.draft.grip || "—"}
                        </strong>
                      </div>
                    </div>
                    {log.draft.notes && (
                      <p className="log-notes">{log.draft.notes}</p>
                    )}
                    <details>
                      <summary>Input latihan tersimpan</summary>
                      <div className="table-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th>Roda</th>
                              <th>Cold</th>
                              <th>Hot</th>
                              <th>Target</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wheels.map((w) => (
                              <tr key={w}>
                                <th>{w}</th>
                                <td>{log.draft.pressures[w].cold || "—"}</td>
                                <td>{log.draft.pressures[w].hot || "—"}</td>
                                <td>
                                  {log.draft.targetMode === "range"
                                    ? log.recommendation?.profile
                                      ? log.recommendation.profile.range.min +
                                        "–" +
                                        log.recommendation.profile.range.max
                                      : "—"
                                    : log.draft.pressures[w].target || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p>
                        Mode {log.draft.fuel.mode === "laps" ? "lap" : "durasi"}
                        ; lap {log.draft.fuel.laps || "—"}; menit{" "}
                        {log.draft.fuel.minutes || "—"}; lap time{" "}
                        {log.draft.fuel.lapTime || "—"}; konsumsi{" "}
                        {log.draft.fuel.consumption || "—"} L/lap; cadangan{" "}
                        {log.draft.fuel.reserve}; formation{" "}
                        {log.draft.fuel.formation} L; kapasitas{" "}
                        {log.draft.fuel.capacity || "—"} L.
                      </p>
                    </details>
                    {log.recommendation && (
                      <details>
                        <summary>Rekomendasi saat run disimpan</summary>
                        <p>
                          Lap pengukuran {log.draft.quality.lap || "—"}; tekanan{" "}
                          {log.draft.quality.stable
                            ? "stabil"
                            : "belum dikonfirmasi stabil"}
                          ; insiden{" "}
                          {log.draft.quality.incident
                            ? "ada"
                            : "tidak dilaporkan"}
                          ; kondisi berikutnya{" "}
                          {log.draft.quality.comparable
                            ? "dinyatakan sebanding"
                            : "belum dikonfirmasi"}
                          .
                        </p>
                        <p>
                          Compound aktual {log.selection.compound}; versi
                          berikutnya {log.draft.nextContext.gameVersion};
                          permukaan {log.draft.nextContext.condition}; BoP{" "}
                          {log.draft.nextContext.bop}; udara/lintasan{" "}
                          {log.draft.nextContext.air || "—"}/
                          {log.draft.nextContext.track || "—"} °C; grip{" "}
                          {log.draft.nextContext.grip || "—"}.
                        </p>
                        {log.draft.targetMode === "manual" && (
                          <p>
                            Sumber target manual:{" "}
                            {log.draft.targetSource || "Belum dicatat"}.
                          </p>
                        )}
                        <p>
                          Keyakinan hitungan{" "}
                          {log.recommendation.confidence === "medium"
                            ? "sedang"
                            : "terbatas"}
                          . {log.recommendation.compound.reason}
                        </p>
                        <ul>
                          {log.recommendation.evidence.map((e) => (
                            <li key={e}>{e}</li>
                          ))}
                        </ul>
                        {log.recommendation.missing.length > 0 && (
                          <>
                            <strong>Informasi yang masih diperlukan</strong>
                            <ul>
                              {log.recommendation.missing.map((e) => (
                                <li key={e}>{e}</li>
                              ))}
                            </ul>
                          </>
                        )}
                        <ul>
                          {wheels.map((w) => (
                            <li key={w}>
                              {w}: {log.recommendation!.pressures[w].reason}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                    <div className="action-row">
                      <button
                        className="primary"
                        onClick={() => startNextRun(log)}
                      >
                        Mulai run berikutnya
                      </button>
                      <button
                        className="secondary"
                        disabled={log.setupId === null}
                        onClick={() => {
                          if (log.setupId) void inspect(log.setupId);
                        }}
                      >
                        Lihat setup sumber
                      </button>
                      <button
                        className="text-button"
                        onClick={() => {
                          if (
                            persist({
                              ...personal,
                              logs: personal.logs.filter(
                                (l) => l.id !== log.id,
                              ),
                            })
                          )
                            notify("Latihan dihapus.");
                        }}
                      >
                        Hapus latihan
                      </button>
                    </div>
                  </section>
                ))}
              </>
            )}
          </div>
        )}
        {tab === "Data & Panduan" && (
          <DataGuide
            catalog={catalog}
            initialCar={selection.carid}
            onInspect={(r) => setInspected(r)}
            onLearn={openParameterHelp}
            onOpenLearning={onOpenLearning}
          />
        )}
        {tab === "Belajar Setup" && (
          <LearningPage
            topicId={learningRoute.topicId}
            onOpenTopic={onOpenLearning}
          />
        )}
      </main>
      <footer className="app-footer">
        <span>ACC Setup · pribadi & lokal</span>
        <span>
          Snapshot {catalog.checked} · ACC PC {catalog.referenceVersion}
        </span>
      </footer>
      {(inspected || lessonHelp) && (
        <dialog
          className="detail-dialog"
          aria-label={lessonHelp ? "Bantuan setup" : "Detail sumber setup"}
          ref={modal}
          onCancel={(e) => {
            e.preventDefault();
            closeDetail();
          }}
          onClose={() => {
            setLessonHelp(null);
            setInspected(null);
            restoreDialogFocus();
          }}
        >
          <div className="dialog-toolbar">
            <strong>
              {lessonHelp ? "Pelajari parameter" : "Detail sumber"}
            </strong>
            {lessonHelp && inspected && (
              <button
                className="secondary compact"
                onClick={() => {
                  const key = lessonHelp.returnParameterKey;
                  setLessonHelp(null);
                  requestAnimationFrame(() =>
                    modal.current
                      ?.querySelector<HTMLElement>(
                        '[data-testid="setting-' + key + '"] button',
                      )
                      ?.focus(),
                  );
                }}
              >
                ← Kembali ke detail sumber
              </button>
            )}
            <button className="secondary compact" onClick={closeDetail}>
              {lessonHelp ? "Tutup bantuan ×" : "Tutup detail ×"}
            </button>
          </div>
          {notice && (
            <div
              className={`notice ${notice.error ? "error" : "success"}`}
              role={notice.error ? "alert" : "status"}
            >
              <span>{notice.text}</span>
              <button
                aria-label="Tutup pemberitahuan detail"
                onClick={() => setNotice(null)}
              >
                ×
              </button>
            </div>
          )}
          {lessonHelp ? (
            <LearningLesson
              key={lessonHelp.topicId}
              topic={topicById(lessonHelp.topicId)!}
              parameterKey={lessonHelp.parameterKey}
              parameterLabel={
                catalog.parameters.find(
                  (p) => p.key === lessonHelp.parameterKey,
                )?.label
              }
              dialog
              onOpenTopic={(id) =>
                setLessonHelp({
                  topicId: id,
                  returnParameterKey: lessonHelp.returnParameterKey,
                })
              }
            />
          ) : (
            inspected && (
              <SetupDetail {...detailProps(inspected)} mode="library" />
            )
          )}
        </dialog>
      )}
    </>
  );
}
