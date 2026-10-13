import { useId, type ReactNode } from "react";
import type { LearningVisual } from "../types";

export function Figure({
  label,
  children,
  caption,
}: {
  label: string;
  children: ReactNode;
  caption?: string;
}) {
  const id = useId();
  return (
    <figure className="learn-figure">
      <svg
        viewBox="0 0 320 180"
        role="img"
        aria-labelledby={id}
        className="learn-diagram"
      >
        <title id={id}>{label}</title>
        {children}
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
function Wheel({
  x,
  y,
  rotate = 0,
}: {
  x: number;
  y: number;
  rotate?: number;
}) {
  return (
    <rect
      x={x - 10}
      y={y - 23}
      width="20"
      height="46"
      rx="5"
      className="diagram-wheel"
      transform={"rotate(" + rotate + " " + x + " " + y + ")"}
    />
  );
}
function CarTop() {
  return (
    <>
      <rect
        x="118"
        y="40"
        width="84"
        height="105"
        rx="24"
        className="diagram-body"
      />
      <Wheel x={106} y={61} />
      <Wheel x={214} y={61} />
      <Wheel x={106} y={124} />
      <Wheel x={214} y={124} />
      <text x="74" y="62">
        FL
      </text>
      <text x="231" y="62">
        FR
      </text>
      <text x="74" y="129">
        RL
      </text>
      <text x="231" y="129">
        RR
      </text>
      <path d="M160 32V9m-8 8 8-8 8 8" className="diagram-line" />
      <text x="177" y="22">
        Maju
      </text>
    </>
  );
}
export function AlignmentDiagram({
  mode = "camber",
  angle = -3,
}: {
  mode?: "camber" | "toe" | "caster";
  angle?: number;
}) {
  if (mode === "toe")
    return (
      <Figure
        label={
          "Toe dilihat dari atas, " +
          angle +
          " derajat. Negatif: toe-out; positif: toe-in."
        }
        caption="Dilihat dari atas. Sudut diperbesar agar arah perubahan terbaca; bukan prediksi grip."
      >
        <rect
          x="125"
          y="55"
          width="70"
          height="92"
          rx="18"
          className="diagram-body"
        />
        <Wheel x={107} y={73} rotate={angle * 24} />
        <Wheel x={213} y={73} rotate={-angle * 24} />
        <Wheel x={107} y={135} />
        <Wheel x={213} y={135} />
        <path d="M160 42V14m-8 8 8-8 8 8" className="diagram-line" />
        <text x="20" y="22">
          Maju ↑
        </text>
        <text x="213" y="23">
          {angle < 0 ? "Toe-out" : angle > 0 ? "Toe-in" : "Sejajar"}
        </text>
      </Figure>
    );
  if (mode === "caster")
    return (
      <Figure
        label={
          "Caster dilihat dari samping, positive caster " + angle + " derajat"
        }
        caption="Dilihat dari samping. Sumbu kemudi miring; roda tetap digambar tegak pada pandangan ini."
      >
        <path d="M25 143H298" className="diagram-ground" />
        <circle cx="176" cy="104" r="38" className="diagram-wheel" />
        <line
          x1={176 - angle * 3}
          y1="34"
          x2={176 + angle * 3}
          y2="143"
          className="diagram-highlight"
        />
        <line x1="176" y1="28" x2="176" y2="147" className="diagram-guide" />
        <text x="20" y="23">
          Sumbu kemudi
        </text>
        <text x="220" y="164">
          Maju →
        </text>
        <text x="33" y="167">
          Kontak roda
        </text>
      </Figure>
    );
  return (
    <Figure
      label={
        "Camber dilihat dari depan, " +
        angle +
        " derajat; negatif berarti bagian atas roda ke dalam"
      }
      caption="Dilihat dari depan. Camber negatif: bagian atas roda menuju pusat mobil."
    >
      <path d="M24 143H296" className="diagram-ground" />
      <rect
        x="105"
        y="68"
        width="110"
        height="43"
        rx="10"
        className="diagram-body"
      />
      <rect
        x="76"
        y="78"
        width="23"
        height="65"
        rx="6"
        className="diagram-wheel"
        transform={"rotate(" + -angle * 3 + " 88 143)"}
      />
      <rect
        x="222"
        y="78"
        width="23"
        height="65"
        rx="6"
        className="diagram-wheel"
        transform={"rotate(" + angle * 3 + " 234 143)"}
      />
      <line x1="88" y1="54" x2="88" y2="144" className="diagram-guide" />
      <line x1="234" y1="54" x2="234" y2="144" className="diagram-guide" />
      <text x="76" y="37">
        Kiri
      </text>
      <text x="216" y="37">
        Kanan
      </text>
      <text x="117" y="166">
        Pusat mobil
      </text>
    </Figure>
  );
}
export function SpringDiagram({
  compression = 10,
  engagement = 15,
}: {
  compression?: number;
  engagement?: number;
}) {
  const end = 138 - compression * 1.8;
  const plateY = 65 + Math.max(0, engagement - compression) * 2;
  const points = Array.from(
    { length: 9 },
    (_, i) => (i % 2 ? 105 : 75) + "," + (42 + (i * (end - 42)) / 8),
  ).join(" ");
  return (
    <Figure
      label={
        "Per terkompresi " +
        compression +
        " mm; bumpstop mulai pada " +
        engagement +
        " mm"
      }
      caption="Model per linear + titik engagement. Kekakuan bumpstop ilustratif, bukan konversi angka ACC."
    >
      <path d="M55 30H126M55 145H126" className="diagram-line" />
      <polyline points={points} className="diagram-highlight" />
      <line x1="90" y1={end} x2="90" y2="145" className="diagram-line" />
      <rect
        x="213"
        y="35"
        width="30"
        height="30"
        rx="5"
        className={compression >= engagement ? "diagram-hot" : "diagram-body"}
      />
      <line x1="228" y1="65" x2="228" y2={plateY} className="diagram-guide" />
      <rect
        x="205"
        y={plateY}
        width="46"
        height="12"
        rx="2"
        className="diagram-wheel"
      />
      <text x="59" y="168">
        Per utama
      </text>
      <text x="172" y="168">
        {compression >= engagement ? "Bumpstop aktif" : "Celah bumpstop"}
      </text>
    </Figure>
  );
}
export function DamperDiagram({
  direction = "bump",
  fast = false,
}: {
  direction?: "bump" | "rebound";
  fast?: boolean;
}) {
  const piston = direction === "bump" ? 88 : 57;
  return (
    <Figure
      label={
        (direction === "bump" ? "Kompresi" : "Pemanjangan") +
        " damper, gerakan " +
        (fast ? "cepat" : "lambat")
      }
      caption="Bump memendek; rebound memanjang. Slow/fast mengacu pada gerakan damper."
    >
      <rect
        x="125"
        y="53"
        width="55"
        height="92"
        rx="7"
        className="diagram-body"
      />
      <line x1="152" y1="20" x2="152" y2={piston} className="diagram-heavy" />
      <line
        x1="128"
        y1={piston}
        x2="177"
        y2={piston}
        className="diagram-highlight"
      />
      <path
        d={
          direction === "bump"
            ? "M207 28V97m-9-9 9 9 9-9"
            : "M207 97V28m-9 9 9-9 9 9"
        }
        className="diagram-line"
      />
      <text x="30" y="23">
        {direction === "bump" ? "Bump ↓" : "Rebound ↑"}
      </text>
      <text x="205" y="131">
        {fast ? "Cepat" : "Lambat"}
      </text>
    </Figure>
  );
}
export function AeroPlatform({
  front = 55,
  rear = 70,
}: {
  front?: number;
  rear?: number;
}) {
  const frontY = 138 - Math.min(front, 120) * 0.65,
    rearY = 138 - Math.min(rear, 120) * 0.65;
  return (
    <Figure
      label={
        "Ilustrasi tinggi belakang " +
        rear +
        " mm dan depan " +
        front +
        " mm; arah maju ke kanan"
      }
      caption="Tinggi di gambar diperbesar untuk belajar; bukan peta aero atau geometri mobil tertentu."
    >
      <path d="M20 151H300" className="diagram-ground" />
      <path
        d={
          "M48 " +
          rearY +
          "L109 " +
          (rearY - 23) +
          "L207 " +
          (frontY - 19) +
          "L275 " +
          frontY +
          "L275 " +
          (frontY + 15) +
          "L48 " +
          (rearY + 15) +
          "Z"
        }
        className="diagram-body"
      />
      <circle cx="87" cy="133" r="18" className="diagram-wheel" />
      <circle cx="237" cy="133" r="18" className="diagram-wheel" />
      <path
        d={"M45 " + (rearY - 12) + "H79M60 " + (rearY - 12) + "V" + rearY}
        className="diagram-line"
      />
      <line x1="42" y1={rearY} x2="42" y2="151" className="diagram-highlight" />
      <line
        x1="285"
        y1={frontY}
        x2="285"
        y2="151"
        className="diagram-highlight"
      />
      <text x="20" y="172">
        Belakang {rear} mm
      </text>
      <text x="198" y="172">
        Depan {front} mm
      </text>
      <text x="225" y="23">
        Maju →
      </text>
      <path d="M137 25V57m-7-7 7 7 7-7" className="diagram-highlight" />
      <text x="32" y="23">
        Downforce ↓
      </text>
    </Figure>
  );
}
export function ForceBars({
  baseline,
  current,
  unit = "N",
}: {
  baseline: number;
  current: number;
  unit?: string;
}) {
  const max = Math.max(baseline, current, 1) * 1.1;
  const f = (n: number) =>
    new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(n);
  return (
    <div
      className="learn-force-bars"
      role="img"
      aria-label={
        "Gaya acuan " +
        f(baseline) +
        " " +
        unit +
        ", gaya saat ini " +
        f(current) +
        " " +
        unit
      }
    >
      <div>
        <span>
          Acuan: {f(baseline)} {unit}
        </span>
        <div className="learn-bar-track">
          <div
            className="learn-bar reference"
            style={{ width: (baseline / max) * 100 + "%" }}
          />
        </div>
      </div>
      <div>
        <span>
          Saat ini: {f(current)} {unit}
        </span>
        <div className="learn-bar-track">
          <div
            className="learn-bar"
            style={{ width: (current / max) * 100 + "%" }}
          />
        </div>
      </div>
    </div>
  );
}
export function LearningDiagram({
  kind,
  topicId,
}: {
  kind: LearningVisual;
  topicId?: string;
}) {
  if (kind === "alignment") {
    const mode = topicId === "toe" || topicId === "caster" ? topicId : "camber";
    return (
      <AlignmentDiagram
        mode={mode}
        angle={mode === "toe" ? -0.2 : mode === "caster" ? 8 : -3}
      />
    );
  }
  if (kind === "mechanical") return <SpringDiagram />;
  if (kind === "damper")
    return (
      <DamperDiagram
        direction={topicId?.includes("rebound") ? "rebound" : "bump"}
        fast={topicId?.startsWith("fast")}
      />
    );
  if (kind === "aero") return <AeroPlatform />;
  if (kind === "grip")
    return (
      <Figure
        label="Ilustrasi gabungan gaya ban: pengereman dan membelok berbagi kemampuan grip"
        caption="Lingkaran adalah penyederhanaan untuk belajar; batas ban nyata tidak selalu berupa lingkaran."
      >
        <circle cx="158" cy="86" r="61" className="diagram-body" />
        <path
          d="M158 150V22m-7 7 7-7 7 7M92 86H231m-7-7 7 7-7 7"
          className="diagram-guide"
        />
        <path
          d="M158 86V40m-7 7 7-7 7 7M158 86H190m-7-7 7 7-7 7"
          className="diagram-line"
        />
        <path d="M158 86L190 40m-9 2 9-2 1 9" className="diagram-highlight" />
        <text x="9" y="30">
          Mengerem ↑
        </text>
        <text x="217" y="107">
          Belok →
        </text>
        <text x="102" y="170">
          Gabungan gaya
        </text>
      </Figure>
    );
  if (kind === "corner")
    return (
      <Figure
        label="Tiga fase tikungan: entry dengan pengereman, mid-corner membelok, exit membuka setir dan gas"
        caption="Fase dapat bertumpang tindih. Garis ini memperjelas urutan pengamatan, bukan racing line optimal."
      >
        <path
          d="M30 141H112Q162 141 162 90T235 39H294"
          className="diagram-heavy"
        />
        <circle cx="77" cy="141" r="7" className="diagram-hot" />
        <circle cx="163" cy="90" r="7" className="diagram-hot" />
        <circle cx="261" cy="39" r="7" className="diagram-hot" />
        <text x="20" y="112">
          Entry · rem
        </text>
        <text x="21" y="56">
          Mid-corner
        </text>
        <path d="M113 60L154 83" className="diagram-guide" />
        <text x="212" y="78">
          Exit · gas
        </text>
        <path d="M225 87L259 50" className="diagram-guide" />
        <text x="19" y="171">
          Arah perjalanan →
        </text>
      </Figure>
    );
  if (kind === "body-motion")
    return (
      <Figure
        label="Pitch dilihat dari samping saat braking: hidung turun; roll dilihat dari depan: bodi miring saat menikung"
        caption="Gerak bodi dan perpindahan beban saling terkait, tetapi bukan besaran yang sama. Sudut diperbesar."
      >
        <text x="17" y="24">
          Pitch · samping
        </text>
        <path d="M10 132H151M176 132H308" className="diagram-ground" />
        <rect
          x="22"
          y="75"
          width="115"
          height="35"
          rx="8"
          transform="rotate(8 79 99)"
          className="diagram-body"
        />
        <circle cx="44" cy="118" r="14" className="diagram-wheel" />
        <circle cx="118" cy="118" r="14" className="diagram-wheel" />
        <path d="M132 39V63m-6-6 6 6 6-6" className="diagram-highlight" />
        <text x="22" y="163">
          Braking · maju →
        </text>
        <text x="181" y="24">
          Roll · depan
        </text>
        <rect
          x="196"
          y="74"
          width="90"
          height="36"
          rx="8"
          transform="rotate(-9 241 91)"
          className="diagram-body"
        />
        <rect
          x="183"
          y="100"
          width="17"
          height="32"
          rx="4"
          className="diagram-wheel"
        />
        <rect
          x="283"
          y="100"
          width="17"
          height="32"
          rx="4"
          className="diagram-wheel"
        />
        <path d="M225 43H268m-7-6 7 6-7 6" className="diagram-highlight" />
        <text x="202" y="163">
          Menikung
        </text>
      </Figure>
    );
  if (kind === "foundation" || kind === "pressure")
    return (
      <Figure
        label="Posisi empat roda dilihat dari atas dari posisi pengemudi"
        caption="Kiri/kanan mengikuti posisi pengemudi, bukan posisi orang yang melihat dari depan."
      >
        <CarTop />
      </Figure>
    );
  if (kind === "compound" || kind === "tyre-set")
    return (
      <Figure
        label={
          kind === "compound"
            ? "Slick tanpa alur dan wet dengan alur"
            : "Nomor set ban bukan jenis compound"
        }
        caption={
          kind === "compound"
            ? "Alur wet membantu menghadapi air. Pilihan tetap mengikuti kondisi racing line."
            : "Identitas set dan kondisi pemakaian perlu dicatat terpisah dari compound."
        }
      >
        <rect
          x="58"
          y="33"
          width="64"
          height="101"
          rx="20"
          className="diagram-wheel"
        />
        <rect
          x="201"
          y="33"
          width="64"
          height="101"
          rx="20"
          className="diagram-wheel"
        />
        {kind === "compound" &&
          [48, 70, 92, 114].map((y) => (
            <path
              key={y}
              d={"M202 " + y + "L232 " + (y - 8) + "L265 " + y}
              className="diagram-tread"
            />
          ))}
        <text x="70" y="162">
          {kind === "compound" ? "Slick" : "Set 1"}
        </text>
        <text x="212" y="162">
          {kind === "compound" ? "Wet" : "Set 2"}
        </text>
      </Figure>
    );
  if (kind === "arb")
    return (
      <Figure
        label="ARB menghubungkan respons suspensi kiri dan kanan"
        caption="Perubahan pembagian kekakuan roll adalah hipotesis keseimbangan; tidak menghitung persen grip."
      >
        <Wheel x={56} y={123} />
        <Wheel x={264} y={123} />
        <path d="M56 82V65H264V101M56 95H264" className="diagram-highlight" />
        <path d="M85 62L236 94" className="diagram-heavy" />
        <text x="30" y="169">
          Kiri
        </text>
        <text x="244" y="169">
          Kanan
        </text>
        <text x="61" y="26">
          Bodi roll · dukungan kiri/kanan
        </text>
      </Figure>
    );
  if (kind === "brake")
    return (
      <Figure
        label="Ilustrasi pembagian rem: depan 60 persen, belakang 40 persen"
        caption="Pembagian konseptual; ABS dan beban menentukan gaya aktual pada ban."
      >
        <rect x="35" y="57" width="150" height="42" className="diagram-body" />
        <rect x="185" y="57" width="100" height="42" className="diagram-hot" />
        <text x="56" y="128">
          Depan 60%
        </text>
        <text x="190" y="128">
          Belakang 40%
        </text>
        <text x="62" y="28">
          Bias mengatur pembagian
        </text>
      </Figure>
    );
  if (kind === "steering")
    return (
      <Figure
        label="Rasio kemudi ideal 14 banding 1: setir 140 derajat menjadi sudut roda sekitar 10 derajat"
        caption="Rasio ideal; hubungan aktual roda kiri/kanan mengikuti geometri."
      >
        <circle cx="75" cy="83" r="39" className="diagram-body" />
        <path
          d="M75 44V83L105 107M75 83L42 105M130 83H200m-9-8 9 8-9 8"
          className="diagram-line"
        />
        <Wheel x={245} y={83} rotate={10} />
        <text x="33" y="153">
          Setir 140°
        </text>
        <text x="210" y="153">
          Roda ≈10°
        </text>
        <text x="136" y="61">
          14:1
        </text>
      </Figure>
    );
  if (kind === "differential")
    return (
      <Figure
        label="Diferensial menghubungkan roda penggerak dengan lintasan dalam dan luar yang berbeda"
        caption="Preload menahan perbedaan putaran; Nm bukan persen lock."
      >
        <Wheel x={53} y={97} />
        <Wheel x={267} y={97} />
        <circle cx="160" cy="97" r="26" className="diagram-body" />
        <path d="M65 97H134M186 97H255M160 20V70" className="diagram-line" />
        <text x="136" y="103">
          Diff
        </text>
        <text x="20" y="155">
          Roda dalam
        </text>
        <text x="226" y="155">
          Roda luar
        </text>
        <text x="193" y="31">
          Torsi masuk
        </text>
      </Figure>
    );
  if (kind === "ducts" || kind === "pads")
    return (
      <Figure
        label={
          kind === "ducts"
            ? "Aliran udara menuju disc dan kampas rem"
            : "Kampas bekerja pada disc, temperatur dan keausan saling berkaitan"
        }
        caption="Aliran dan komponen ilustratif; tidak memprediksi temperatur atau umur kampas."
      >
        <circle cx="218" cy="92" r="43" className="diagram-body" />
        <circle cx="218" cy="92" r="12" className="diagram-wheel" />
        <rect
          x="253"
          y="64"
          width="18"
          height="56"
          rx="3"
          className="diagram-hot"
        />
        <path d="M25 88H165m-10-8 10 8-10 8" className="diagram-highlight" />
        <text x="23" y="64">
          Udara
        </text>
        <text x="194" y="158">
          Disc
        </text>
        <text x="264" y="43">
          Pad
        </text>
      </Figure>
    );
  const stages =
    kind === "electronics"
      ? ["Input", "Kontrol", "Roda"]
      : kind === "fuel"
        ? ["Lap", "Konsumsi", "Liter"]
        : kind === "pit"
          ? ["Pit lane", "Servis", "Keluar"]
          : ["Pemanasan", "Lap ukur", "Evaluasi"];
  return (
    <Figure
      label={stages.join(" lalu ")}
      caption={
        kind === "electronics"
          ? "Intervensi memakai logika model tertentu; bukan pemetaan angka slider."
          : "Contoh alur untuk belajar, bukan pembacaan data dari game."
      }
    >
      {stages.map((text, i) => (
        <g key={text}>
          <rect
            x={9 + i * 106}
            y="55"
            width="88"
            height="67"
            rx="8"
            className={i === 1 ? "diagram-hot" : "diagram-body"}
          />
          <text x={53 + i * 106} y="95" textAnchor="middle">
            {text}
          </text>
        </g>
      ))}
      <path d="M97 88H114M203 88H220" className="diagram-line" />
    </Figure>
  );
}
