import { useEffect, useRef, useState } from "react";
import type { LearningTopic } from "../types";
import {
  learningModules,
  learningSources,
  learningTopics,
  searchLearning,
  topicById,
} from "../lib/learning";
import { LearningDiagram } from "./LearningVisuals";
import { LearningExperimentPanel } from "./LearningExperiments";
import { LearningScreenshot } from "./LearningScreenshot";

const sourceKinds = {
  principle: "Prinsip fisika",
  "acc-version": "ACC menurut versi",
  "direct-testing": "Pengujian langsung",
};
export function LearningLesson({
  topic,
  parameterLabel,
  parameterKey,
  onOpenTopic,
  dialog = false,
}: {
  topic: LearningTopic;
  parameterLabel?: string;
  parameterKey?: string;
  onOpenTopic?: (id: string) => void;
  dialog?: boolean;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const module = learningModules.find((m) => m.id === topic.moduleId)!;
  const wheelPositions = [
    ["FL", "depan kiri"],
    ["FR", "depan kanan"],
    ["RL", "belakang kiri"],
    ["RR", "belakang kanan"],
  ].filter(([position]) =>
    topic.parameterKeys.some(
      (key) =>
        key.endsWith(position) ||
        (position === "FL" && key === "casterLF") ||
        (position === "FR" && key === "casterRF"),
    ),
  );
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    if (!dialog) titleRef.current?.scrollIntoView({ block: "start" });
  }, [topic.id, dialog]);
  return (
    <article className="learning-lesson" data-testid="learning-lesson">
      <header className="learn-lesson-header">
        <span className="eyebrow">{module.title}</span>
        <h2 ref={titleRef} tabIndex={-1}>
          {topic.title}
        </h2>
        <p>
          {parameterLabel
            ? "Parameter yang dibuka: " + parameterLabel + " · "
            : ""}
          {topic.unit}
        </p>
        {wheelPositions.length > 0 && (
          <div
            className="learn-wheel-positions"
            aria-label="Posisi parameter pada mobil"
          >
            <span className="learn-note">
              Satu pelajaran untuk posisi roda berikut:
            </span>
            {wheelPositions.map(([position, description]) => (
              <span className="badge" key={position}>
                {position} · {description}
              </span>
            ))}
          </div>
        )}
      </header>
      <section className="learn-section">
        <h3>
          <span>01</span>Apa ini?
        </h3>
        <p>{topic.definition}</p>
      </section>
      <LearningScreenshot
        key={topic.id + (parameterKey ?? "")}
        topic={topic}
        parameterKey={parameterKey}
      />
      <section className="learn-section">
        <h3>
          <span>02</span>Apa yang berubah?
        </h3>
        <div className="learn-effects">
          <div>
            <h4>Naik / lebih banyak</h4>
            <p>{topic.increase}</p>
          </div>
          <div>
            <h4>Turun / lebih sedikit</h4>
            <p>{topic.decrease}</p>
          </div>
        </div>
        <p className="learn-condition">{topic.condition}</p>
      </section>
      <section className="learn-section">
        <h3>
          <span>03</span>Lihat contohnya
        </h3>
        <div className="learn-scenario">
          <LearningDiagram kind={topic.visual} topicId={topic.id} />
          <div>
            <span className="eyebrow">SKENARIO</span>
            <p>{topic.scenario}</p>
          </div>
        </div>
      </section>
      <section className="learn-section">
        <h3>
          <span>04</span>Coba sendiri
        </h3>
        <pre className="learn-worked-example">{topic.example}</pre>
        {topic.experiment ? (
          <LearningExperimentPanel kind={topic.experiment} topicId={topic.id} />
        ) : (
          <p className="learn-note">
            Gunakan contoh ini untuk memahami hubungan, lalu lakukan checklist
            di game. Tidak ada rekomendasi klik otomatis.
          </p>
        )}
      </section>
      <section className="learn-section">
        <h3>
          <span>05</span>Uji di game
        </h3>
        <p className="learn-note">
          Checklist sementara untuk membantu pengujian; tidak disimpan sebagai
          hasil run.
        </p>
        <div className="learn-checklist">
          {topic.checklist.map((text, i) => (
            <label key={text}>
              <input
                type="checkbox"
                checked={checked.includes(String(i))}
                onChange={(e) =>
                  setChecked(
                    e.target.checked
                      ? [...checked, String(i)]
                      : checked.filter((x) => x !== String(i)),
                  )
                }
              />
              <span>{text}</span>
            </label>
          ))}
        </div>
      </section>
      <section className="learn-section">
        <details className="learn-technical">
          <summary>06 · Detail teknis, keterbatasan & sumber</summary>
          <div className="learn-technical-body">
            <h4>Prinsip dan perhitungan</h4>
            <p>{topic.technical}</p>
            <h4>Keterbatasan</h4>
            <p>{topic.limitation}</p>
            <h4>Dasar materi</h4>
            <p className="learn-note">
              Prinsip menjelaskan mekanisme; sumber ACC menyebut versi; arah
              tuning diperlakukan sebagai hipotesis untuk diuji.
            </p>
            <ul className="learn-source-list">
              {topic.sourceIds.map((id) => {
                const s = learningSources.find((s) => s.id === id)!;
                return (
                  <li key={id}>
                    <span className="badge">{sourceKinds[s.kind]}</span>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.title} ↗
                    </a>
                    <strong>{s.publisher}</strong>
                    <p>{s.note}</p>
                    <small>Tautan memerlukan internet.</small>
                  </li>
                );
              })}
            </ul>
          </div>
        </details>
      </section>
      {onOpenTopic && topic.relatedIds.length > 0 && (
        <div className="learn-related">
          <span>Pelajaran terkait</span>
          {topic.relatedIds.map((id) => (
            <button
              className="secondary compact"
              key={id}
              onClick={() => onOpenTopic(id)}
            >
              {topicById(id)!.title}
            </button>
          ))}
        </div>
      )}
      {dialog && (
        <p className="learn-note">
          Contoh dan checklist di bantuan ini terpisah dari draft latihan yang
          sedang kamu isi.
        </p>
      )}
    </article>
  );
}

export function LearningPage({
  topicId,
  onOpenTopic,
}: {
  topicId: string | null;
  onOpenTopic: (id: string | null) => void;
}) {
  const topic = topicById(topicId);
  const [query, setQuery] = useState("");
  const [moduleId, setModuleId] = useState(topic?.moduleId ?? "all");
  const [mobileListOpen, setMobileListOpen] = useState(false);
  useEffect(() => {
    setQuery("");
    if (topic) setModuleId(topic.moduleId);
    setMobileListOpen(false);
  }, [topicId]); // Route changes select one lesson without changing garage state.
  const list = searchLearning(query).filter(
    (t) => !!query.trim() || moduleId === "all" || t.moduleId === moduleId,
  );
  const selectedIndex = topic
    ? learningTopics.findIndex((t) => t.id === topic.id)
    : -1;
  const choose = (id: string) => {
    setMobileListOpen(false);
    onOpenTopic(id);
  };
  const topicLinks = (
    <nav aria-label="Daftar topik belajar">
      {list.map((t) => (
        <button
          key={t.id}
          className={topic?.id === t.id ? "learn-topic active" : "learn-topic"}
          aria-current={topic?.id === t.id ? "page" : undefined}
          onClick={() => choose(t.id)}
        >
          <span>{t.title}</span>
          <small>
            {learningModules.find((m) => m.id === t.moduleId)!.title}
          </small>
        </button>
      ))}
      {!list.length && (
        <p className="empty">
          Tidak ada topik. Coba “camber”, “tekanan”, “TC2”, atau “rem”.
        </p>
      )}
    </nav>
  );
  return (
    <div className="page-stack learning-page">
      <div className="page-title">
        <span className="eyebrow">PAHAMI · COBA · UJI DI GAME</span>
        <h1>Belajar Setup</h1>
        <p>
          Satu topik, satu hubungan yang lebih jelas. Materi lengkap bisa dibuka
          sesuai kebutuhan.
        </p>
      </div>
      <div className="learn-search-row">
        <label>
          Cari istilah atau parameter
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setMobileListOpen(true);
            }}
            placeholder="Camber, sudut roda, TC2, brake bias…"
          />
        </label>
        {topic && (
          <button className="secondary" onClick={() => onOpenTopic(null)}>
            Semua modul
          </button>
        )}
      </div>
      <div className="learn-layout">
        <aside className="learn-sidebar">
          <div className="learn-desktop-categories">
            <button
              className={moduleId === "all" ? "active" : ""}
              onClick={() => setModuleId("all")}
            >
              Semua kategori
            </button>
            {learningModules.map((m) => (
              <button
                key={m.id}
                className={moduleId === m.id ? "active" : ""}
                onClick={() => setModuleId(m.id)}
              >
                {m.title}
              </button>
            ))}
          </div>
          <label className="learn-mobile-category">
            Kategori belajar
            <select
              value={moduleId}
              onChange={(e) => {
                setModuleId(e.target.value);
                setMobileListOpen(true);
                setQuery("");
              }}
            >
              <option value="all">Semua kategori</option>
              {learningModules.map((m) => (
                <option value={m.id} key={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </label>
          <div className="learn-desktop-topics">
            <p className="learn-list-count">
              {list.length} topik {query.trim() ? "ditemukan" : "tersedia"}
            </p>
            {topicLinks}
          </div>
          <details
            className="learn-mobile-topics"
            open={mobileListOpen}
            onToggle={(e) => setMobileListOpen(e.currentTarget.open)}
          >
            <summary>
              {list.length} topik {query.trim() ? "ditemukan" : "tersedia"} ·
              buka daftar
            </summary>
            {topicLinks}
          </details>
        </aside>
        <div className="learn-content">
          {query.trim() ? (
            <section className="panel learn-search-results">
              <h2>Hasil pencarian: {query}</h2>
              <p>{list.length} topik ditemukan di seluruh kategori.</p>
              {list.map((t) => (
                <button
                  key={t.id}
                  className="learn-search-result"
                  onClick={() => choose(t.id)}
                >
                  <strong>{t.title}</strong>
                  <span>{t.definition}</span>
                </button>
              ))}
              {!list.length && (
                <p className="empty">
                  Belum ditemukan. Gunakan nama Indonesia atau label ACC.
                </p>
              )}
            </section>
          ) : topic ? (
            <>
              <LearningLesson
                key={topic.id}
                topic={topic}
                onOpenTopic={choose}
              />
              <div className="learn-pagination">
                <button
                  className="secondary"
                  disabled={selectedIndex <= 0}
                  onClick={() => choose(learningTopics[selectedIndex - 1].id)}
                >
                  ← Sebelumnya
                </button>
                <span>
                  {selectedIndex + 1} / {learningTopics.length}
                </span>
                <button
                  className="secondary"
                  disabled={selectedIndex >= learningTopics.length - 1}
                  onClick={() => choose(learningTopics[selectedIndex + 1].id)}
                >
                  Berikutnya →
                </button>
              </div>
            </>
          ) : (
            <>
              <section className="panel learn-start">
                <span className="eyebrow">MULAI DARI DASAR</span>
                <h2>Kenali masalahnya sebelum mengubah angka.</h2>
                <p>
                  Pelajari grip, fase tikungan, dan cara menguji perubahan.
                  Semua topik tersedia; tidak perlu menyelesaikan modul lain
                  dahulu.
                </p>
                <button className="primary" onClick={() => choose("grip")}>
                  Mulai dari dasar →
                </button>
                <span className="learn-note">
                  {learningTopics.length} topik · 7 eksperimen · tanpa kuis
                </span>
              </section>
              <div className="learn-module-grid">
                {learningModules
                  .filter((m) => m.id !== "dasar")
                  .map((m, i) => (
                    <button
                      className="panel learn-module-card"
                      key={m.id}
                      onClick={() =>
                        choose(
                          learningTopics.find((t) => t.moduleId === m.id)!.id,
                        )
                      }
                    >
                      <span className="learn-module-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <strong>{m.title}</strong>
                      <p>{m.description}</p>
                      <small>
                        {
                          learningTopics.filter((t) => t.moduleId === m.id)
                            .length
                        }{" "}
                        topik · buka modul →
                      </small>
                    </button>
                  ))}
              </div>
              <section className="panel learn-media">
                <h2>Video lanjutan & cara membaca sumber</h2>
                <p>
                  Playlist TL;DW Aris.Drives membahas fisika, ban, handling, dan
                  setup. Materi arsip bisa memakai patch serta angka lama;
                  gunakan untuk memahami konsep dan cocokkan dengan versi game.
                </p>
                <a
                  href="https://www.youtube.com/playlist?list=PLOo3YiGzVthAR7piYqmUHAb-hCTwTHSn7"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buka playlist Aris.Drives ↗ · perlu internet
                </a>
                <p className="learn-note">
                  Materi utama, diagram dan eksperimen tersedia lokal. Video
                  berbahasa asli; penjelasan inti tersedia dalam bahasa
                  Indonesia di setiap topik.
                </p>
                <div className="learn-source-legend">
                  <span>Prinsip fisika</span>
                  <span>ACC menurut versi</span>
                  <span>Hipotesis untuk diuji</span>
                </div>
                <p className="learn-note">
                  Sumber dapat dibuka pada “Detail teknis” setiap pelajaran.
                  Tidak ada klaim bahwa satu setting cocok untuk semua mobil.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
