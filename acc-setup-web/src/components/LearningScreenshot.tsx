import { useId, useState } from "react";
import type { LearningImageRect, LearningTopic } from "../types";
import { screenshotAssetById } from "../lib/learningMedia";

const viewBox = (r: LearningImageRect) =>
  `${r.x} ${r.y} ${r.width} ${r.height}`;

/** Read-only media state stays separate from the practice draft and source dialog. */
export function LearningScreenshot({
  topic,
  parameterKey,
}: {
  topic: LearningTopic;
  parameterKey?: string;
}) {
  const initialReference = Math.max(
    0,
    topic.screenshots.findIndex((r) =>
      r.markers.some((m) => m.parameterKeys.includes(parameterKey ?? "")),
    ),
  );
  const [referenceIndex, setReferenceIndex] = useState(initialReference);
  const [markerIndex, setMarkerIndex] = useState(
    Math.max(
      0,
      topic.screenshots[initialReference]?.markers.findIndex((m) =>
        m.parameterKeys.includes(parameterKey ?? ""),
      ) ?? 0,
    ),
  );
  const [showMarkers, setShowMarkers] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const [zoom, setZoom] = useState("100");
  const [failed, setFailed] = useState<string[]>([]);
  const id = useId();
  const reference = topic.screenshots[referenceIndex];
  const asset = reference && screenshotAssetById(reference.assetId);
  if (!reference || !asset) return null;
  const active = reference.markers[markerIndex];
  const imageFailed = failed.includes(asset.id);
  const imageError = () =>
    setFailed((old) => (old.includes(asset.id) ? old : [...old, asset.id]));
  return (
    <section
      className="learn-section learn-screenshot"
      aria-labelledby={id + "-heading"}
      data-testid="learning-screenshot"
    >
      <div className="learn-shot-heading">
        <h3 id={id + "-heading"}>Kenali di ACC</h3>
        <span className="badge">
          Screenshot asli {asset.archive && "· arsip"}
        </span>
      </div>
      <p className="learn-note">
        Temukan field-nya dulu. Pilih nomor untuk membaca potongan detail, lalu
        lanjutkan ke diagram dan latihan.
      </p>
      {topic.screenshots.length > 1 && (
        <div className="learn-shot-tabs" aria-label="Pilihan screenshot">
          {topic.screenshots.map((r, i) => (
            <button
              key={r.assetId}
              type="button"
              aria-pressed={i === referenceIndex}
              onClick={() => {
                setReferenceIndex(i);
                setMarkerIndex(0);
                setZoom("100");
              }}
            >
              {screenshotAssetById(r.assetId)!.title}
            </button>
          ))}
        </div>
      )}
      <div className="learn-shot-toolbar">
        <label className="learn-shot-toggle">
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={(e) => setShowMarkers(e.target.checked)}
          />
          Tampilkan penanda
        </label>
        <button
          type="button"
          className="secondary"
          aria-expanded={showOriginal}
          aria-controls={id + "-original"}
          onClick={() => setShowOriginal((value) => !value)}
        >
          {showOriginal ? "Tutup gambar asli" : "Lihat gambar asli"}
        </button>
      </div>
      <figure className="learn-shot-figure">
        {imageFailed ? (
          <p role="status" className="learn-shot-error">
            Screenshot gagal ditampilkan. {asset.title} — penjelasan parameter,
            diagram, dan eksperimen tetap tersedia.
          </p>
        ) : (
          <div
            className="learn-shot-image"
            style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
          >
            <img
              key={asset.id}
              src={asset.src}
              width={asset.width}
              height={asset.height}
              alt={asset.alt}
              loading="lazy"
              decoding="async"
              onError={imageError}
            />
            {showMarkers &&
              reference.markers.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  className="learn-shot-marker"
                  aria-label={`Penanda ${i + 1}: ${m.label}`}
                  aria-pressed={i === markerIndex}
                  aria-controls={id + "-detail"}
                  onClick={() => setMarkerIndex(i)}
                  style={{
                    left: `${(m.box.x / asset.width) * 100}%`,
                    top: `${(m.box.y / asset.height) * 100}%`,
                    width: `${(m.box.width / asset.width) * 100}%`,
                    height: `${(m.box.height / asset.height) * 100}%`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      ...(m.badgeSide
                        ? {
                            left: m.badgeSide === "left" ? -28 : "auto",
                            right: m.badgeSide === "right" ? -28 : "auto",
                            top: -16,
                          }
                        : {
                            ...(i % 2 ? { left: "auto", right: -2 } : {}),
                            ...(i >= 2 ? { top: "auto", bottom: -22 } : {}),
                          }),
                    }}
                  >
                    {i + 1}
                  </span>
                </button>
              ))}
          </div>
        )}
        <figcaption>{reference.caption}</figcaption>
      </figure>
      <div className="learn-shot-inspector">
        <ol className="learn-shot-list" aria-label="Penjelasan penanda">
          {reference.markers.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                aria-pressed={i === markerIndex}
                aria-controls={id + "-detail"}
                onClick={() => setMarkerIndex(i)}
              >
                <span className="learn-shot-number" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{m.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <div
          id={id + "-detail"}
          className="learn-shot-detail"
          data-testid="screenshot-detail"
          aria-live="polite"
          aria-atomic="true"
        >
          <h4>
            {markerIndex + 1}. {active.label}
          </h4>
          {!imageFailed && (
            <svg
              className="learn-shot-crop"
              role="img"
              aria-labelledby={id + "-crop-title"}
              viewBox={viewBox(active.detail)}
              preserveAspectRatio="xMidYMid meet"
            >
              <title id={id + "-crop-title"}>
                Potongan detail: {active.label}
              </title>
              <image
                href={asset.src}
                width={asset.width}
                height={asset.height}
              />
              <rect
                x={active.box.x}
                y={active.box.y}
                width={active.box.width}
                height={active.box.height}
                fill="none"
                stroke="#ffd278"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
          <p>{active.explanation}</p>
        </div>
      </div>
      {showOriginal && (
        <div id={id + "-original"} className="learn-shot-original">
          <div className="learn-shot-toolbar">
            <h4>Gambar asli · tanpa penanda app</h4>
            <label>
              Zoom gambar asli
              <select value={zoom} onChange={(e) => setZoom(e.target.value)}>
                <option value="100">100%</option>
                <option value="150">150%</option>
                <option value="200">200%</option>
                <option value="300">300%</option>
              </select>
            </label>
          </div>
          <p className="learn-note">
            Geser area gambar untuk melihat bagian lain. Kotak / penekanan yang
            sudah dibuat sumber tetap ada pada file asli.
          </p>
          {!imageFailed && (
            <div
              className="learn-shot-scroll"
              tabIndex={0}
              role="region"
              aria-label="Area gulir gambar asli"
              style={{ maxHeight: "440px" }}
            >
              <img
                src={asset.src}
                width={asset.width}
                height={asset.height}
                alt={asset.alt + " — gambar asli tanpa penanda app"}
                loading="lazy"
                decoding="async"
                onError={imageError}
                style={{ width: `${zoom}%` }}
              />
            </div>
          )}
          {imageFailed && (
            <p className="learn-note">
              Gambar asli tidak tersedia; baca keterangan sumber di bawah.
            </p>
          )}
        </div>
      )}
      <details className="learn-shot-attribution">
        <summary>
          Sumber & konteks capture · {asset.creator} ·{" "}
          {asset.version ? `v${asset.version}` : "versi tidak diketahui"}
        </summary>
        <dl>
          <div>
            <dt>Pembuat / penerbit</dt>
            <dd>{asset.creator}</dd>
          </div>
          <div>
            <dt>Mobil</dt>
            <dd>{asset.car ?? "Tidak diketahui dari sumber capture"}</dd>
          </div>
          <div>
            <dt>Platform</dt>
            <dd>{asset.platform ?? "Tidak diketahui dari sumber capture"}</dd>
          </div>
          <div>
            <dt>Versi capture</dt>
            <dd>
              {asset.version
                ? `${asset.version} · ${asset.versionEvidence === "visible" ? "terlihat pada gambar" : "menurut artikel, tidak terlihat pada gambar"}`
                : "Tidak diketahui; tanggal artikel tidak dianggap sebagai versi"}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              {asset.archive
                ? "Arsip · lokasi / tampilan dapat berubah pada patch atau mobil lain"
                : "Konteks sumber, perlu diperiksa pada game kamu"}
            </dd>
          </div>
        </dl>
        <p>{asset.note}</p>
        <p>
          <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
            Buka artikel sumber ↗ (perlu internet)
          </a>{" "}
          ·{" "}
          <a href={asset.originalUrl} target="_blank" rel="noreferrer">
            File asli sumber ↗ (perlu internet)
          </a>
        </p>
        <p className="learn-note">
          Aset dibundel lokal; gambar tidak dimuat dari situs sumber. Tekanan
          target tetap mengikuti profil aplikasi dan status bukti, bukan angka
          dalam screenshot arsip.
        </p>
      </details>
    </section>
  );
}
