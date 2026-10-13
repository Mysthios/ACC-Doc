import type {
  LearningImageRect,
  LearningScreenshotAsset,
  LearningScreenshotMarker,
  LearningScreenshotReference,
} from "../types";

const srsGuide =
  "https://simracingsetup.com/assetto-corsa/acc-beginners-setup-guide/";
const srsPhotos = "https://simracingsetup.com/assetto-corsa/acc-screenshots/";
const srsUploads = "https://simracingsetup.com/wp-content/uploads/";
function menu(
  id: string,
  title: string,
  file: string,
): LearningScreenshotAsset {
  return {
    id,
    title,
    src: `/media/acc/${id}.webp`,
    width: 1024,
    height: 576,
    alt: `Screenshot asli ACC, menu ${title}, Free Practice`,
    creator: "Rich / SimRacingSetup",
    sourceUrl: srsGuide,
    originalUrl: srsUploads + "2020/06/" + file,
    car: null,
    platform: null,
    version: null,
    versionEvidence: "unknown",
    archive: true,
    note: "Capture menu lama. Model mobil dan platform tidak disebut pada capture; versi tidak terlihat. Kotak putih dari pembuat sudah ada pada sebagian gambar. Tanggal artikel bukan versi capture.",
  };
}
function driving(
  id: string,
  title: string,
  file: string,
): LearningScreenshotAsset {
  return {
    id,
    title,
    src: `/media/acc/${id}.webp`,
    width: 1080,
    height: 608,
    alt: `Screenshot replay ACC: ${title}, Ferrari 296 GT3 di lintasan`,
    creator: "Rich / SimRacingSetup",
    sourceUrl: srsPhotos,
    originalUrl: srsUploads + "2024/08/" + file,
    car: "Ferrari 296 GT3",
    platform: "PC (menurut artikel)",
    version: "1.10.2",
    versionEvidence: "article",
    archive: true,
    note: "Artikel menyebut ACC PC 1.10.2; angka versi tidak tercetak di gambar. Frame replay memberi konteks, bukan pengukuran slip, transfer beban, atau fase tikungan.",
  };
}
export const learningScreenshotAssets: LearningScreenshotAsset[] = [
  menu("tyres", "Tyres", "ACC-Tyres-Setup-1024x576.webp"),
  menu("fuel", "Fuel & Strategy", "ACC-Fuel-setup-1024x576.webp"),
  menu("mechanical", "Mechanical Grip", "ACC-Mechanical-Setup-1024x576.webp"),
  menu("dampers", "Dampers", "ACC-Suspension-Setup-1024x576.webp"),
  menu("aero", "Aero", "ACC-Aero-setup-1024x576.webp"),
  {
    id: "electronics",
    title: "Electronics",
    src: "/media/acc/electronics.jpg",
    width: 1024,
    height: 576,
    alt: "Screenshot asli ACC, menu Electronics, versi 1.7.7 terlihat di kanan atas",
    creator: "Coach Dave Academy",
    sourceUrl:
      "https://coachdaveacademy.com/tutorials/the-ultimate-acc-car-setup-guide/",
    originalUrl:
      "https://coachdaveacademy.com/wp-content/uploads/2021/04/blog-image-electronicsguide-1024x576.jpg",
    car: null,
    platform: null,
    version: "1.7.7",
    versionEvidence: "visible",
    archive: true,
    note: "Versi 1.7.7 terlihat di kanan atas. Model mobil dan platform tidak disebut pada capture. Kotak putih merupakan penanda bawaan sumber; tabel panduan lama bukan rekomendasi klik app.",
  },
  {
    id: "tyre-hud",
    title: "Pembacaan ban di HUD",
    src: "/media/acc/tyre-hud.webp",
    width: 1080,
    height: 608,
    alt: "Screenshot kokpit ACC dengan widget empat ban, tekanan psi dan status DRY 1",
    creator: "Rich / SimRacingSetup",
    sourceUrl:
      "https://simracingsetup.com/assetto-corsa/acc-tyre-pressure-guide/",
    originalUrl: srsUploads + "2021/02/ACC-Tyre-Temperature-HUD-Widget.webp",
    car: null,
    platform: null,
    version: null,
    versionEvidence: "unknown",
    archive: true,
    note: "Screenshot HUD lama sudah dipotong dan diberi penekanan oleh sumber. Versi, model mobil dan platform capture tidak dinyatakan. Warna dan angka merupakan pembacaan sesaat, bukan bukti ban sudah stabil.",
  },
  driving(
    "driving-body",
    "Bodi dan roda dilihat dari samping",
    "ACC-Take-screenshot-with-motion-blur-Ferrari-296-GT3-2.webp",
  ),
  driving(
    "driving-track",
    "Mobil, tikungan dan kerb",
    "ACC-How-to-take-perfect-sreenshots.webp",
  ),
];
export const screenshotAssetById = (id: string) =>
  learningScreenshotAssets.find((a) => a.id === id);
const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
): LearningImageRect => ({ x, y, width, height });
function marker(
  id: string,
  label: string,
  explanation: string,
  box: LearningImageRect,
  parameterKeys: string[] = [],
  detail?: LearningImageRect,
): LearningScreenshotMarker {
  return {
    id,
    label,
    explanation,
    parameterKeys,
    box,
    detail:
      detail ??
      rect(
        Math.max(0, box.x - 8),
        Math.max(0, box.y - 12),
        box.width + 16,
        box.height + 24,
      ),
  };
}
function ref(
  assetId: string,
  caption: string,
  markers: LearningScreenshotMarker[],
): LearningScreenshotReference {
  const asset = screenshotAssetById(assetId)!;
  return {
    assetId,
    caption,
    markers: markers.map((m) => ({
      ...m,
      detail: {
        ...m.detail,
        width: Math.min(m.detail.width, asset.width - m.detail.x),
        height: Math.min(m.detail.height, asset.height - m.detail.y),
      },
    })),
  };
}
const example =
  "Angka pada gambar adalah contoh sumber, bukan setting yang disarankan untuk run kamu.";
const wheelNames = [
  "FL · depan kiri",
  "FR · depan kanan",
  "RL · belakang kiri",
  "RR · belakang kanan",
];
const wheels = ["FL", "FR", "RL", "RR"];
function tyreRows(
  prefix: string,
  label: string,
  frontY: number,
  rearY: number,
  explanation: string,
) {
  return wheels.map((wheel, i) =>
    marker(
      wheel,
      `${label} ${wheelNames[i]}`,
      explanation,
      rect(i % 2 ? 483 : 169, i < 2 ? frontY : rearY, 122, 17),
      [prefix + wheel],
    ),
  );
}
function mechanicalRows(
  prefix: string,
  label: string,
  frontY: number,
  rearY: number,
  explanation: string,
) {
  return wheels.map((wheel, i) =>
    marker(
      wheel,
      `${label} ${wheelNames[i]}`,
      explanation,
      rect(i % 2 ? 527 : 76, i < 2 ? frontY : rearY, 170, 18),
      [prefix + wheel],
    ),
  );
}
function damperRows(
  prefix: string,
  label: string,
  frontY: number,
  rearY: number,
  explanation: string,
) {
  return wheels.map((wheel, i) =>
    marker(
      wheel,
      `${label} ${wheelNames[i]}`,
      explanation,
      rect(i % 2 ? 509 : 77, i < 2 ? frontY : rearY, 185, 18),
      [prefix + wheel],
    ),
  );
}
const hudMarkers: LearningScreenshotMarker[] = [
  marker(
    "front",
    "Tekanan ban depan FL / FR",
    "Di widget: kiri = FL, kanan = FR. Angka psi adalah tekanan saat capture (26,2 / 26,0), bukan tekanan awal atau target universal.",
    rect(680, 396, 140, 22),
  ),
  marker(
    "rear",
    "Tekanan ban belakang RL / RR",
    "Baris bawah mewakili RL / RR (26,3 / 25,9 psi pada contoh). Ukur saat run stabil dan catat lap serta kondisi.",
    rect(680, 566, 140, 23),
  ),
  marker(
    "colour",
    "Warna pembacaan ban",
    "Widget menampilkan warna pembacaan thermal. Gambar statis tidak memberikan suhu °C pasti atau membuktikan kestabilan; periksa pembacaan di game dan LAST READINGS setelah run.",
    rect(685, 420, 135, 60),
  ),
].map((m) => ({ ...m, badgeSide: m.id === "colour" ? "right" : "left" }));
const readings = ref(
  "tyres",
  "LAST READINGS adalah informasi hasil pembacaan, bukan slider. Pada capture ini semuanya masih nol; tidak ada pengukuran run yang bisa dievaluasi.",
  [
    marker(
      "omi",
      "O / M / I · temperatur",
      "Outer / middle / inner: sisi luar, tengah, dalam tapak. Urutan label kanan/kiri mengikuti screenshot. Nilai nol di sini berarti belum ada data pembacaan yang bisa digunakan.",
      rect(48, 182, 107, 17),
    ),
    marker(
      "hot",
      "Psi hot · hasil pembacaan",
      "Letak field tekanan hasil pembacaan. Jangan menyalin 0,0 atau menganggapnya hasil hot yang stabil. Untuk koreksi app, catat psi saat stabil beserta lap dan kondisi.",
      rect(48, 213, 107, 16),
    ),
  ],
);
export const learningTopicScreenshots: Record<
  string,
  LearningScreenshotReference[]
> = {
  grip: [
    ref(
      "driving-track",
      "Grip dipakai untuk mengarahkan, memperlambat, dan mempercepat mobil. Foto ini membantu mengenali konteks roda, aspal dan kerb; tidak mengukur besarnya grip.",
      [
        marker(
          "tyre",
          "Roda dan kontak dengan lintasan",
          "Perhatikan area ban yang menyentuh lintasan. Understeer / oversteer perlu dinilai dari respons arah mobil saat kamu berkendara, bukan dari satu foto.",
          rect(465, 326, 80, 109),
        ),
        marker(
          "surface",
          "Aspal dan kerb",
          "Bandingkan grip di racing line, bagian basah/kotor dan kerb melalui run yang konsisten. Permukaan pada gambar hanya konteks pengujian.",
          rect(766, 371, 200, 62),
        ),
      ],
    ),
  ],
  "fase-tikungan": [
    ref(
      "driving-track",
      "Satu frame replay menampilkan konteks tikungan. Entry, mid-corner dan exit ditentukan oleh perubahan rem, kemudi dan gas sepanjang run; seluruh fase tidak dapat dibuktikan dari frame ini.",
      [
        marker(
          "corner",
          "Arah tikungan dan jalur",
          "Ikuti jalur menuju tikungan, titik paling dekat dengan bagian dalam, lalu lintasan keluar. Saat menguji, tulis fase ketika gejala muncul.",
          rect(60, 283, 265, 90),
        ),
        marker(
          "kerb",
          "Batas dalam / kerb",
          "Kerb memberi referensi posisi mobil. Jangan menganggap posisi capture sebagai racing line atau titik pengereman yang wajib ditiru.",
          rect(273, 321, 83, 50),
        ),
      ],
    ),
  ],
  "gerak-bodi": [
    ref(
      "driving-body",
      "Tampilan samping membantu mengenali roda depan, belakang dan bodi. Pitch/roll memerlukan perbandingan beberapa frame atau pengamatan saat berkendara; kemiringan foto tidak menjadi ukuran transfer beban.",
      [
        marker(
          "front",
          "Bagian depan",
          "Saat pengereman, amati perubahan tinggi bodi depan terhadap roda dan lintasan. Kompresi aktual tidak bisa dihitung dari foto ini.",
          rect(333, 269, 105, 96),
        ),
        marker(
          "rear",
          "Bagian belakang",
          "Saat akselerasi, amati gerak bodi belakang. Untuk roll, gunakan juga pandangan depan/belakang dan respons di tikungan; diagram pelajaran memperjelas arah geraknya.",
          rect(702, 293, 112, 103),
        ),
        marker(
          "body",
          "Bodi di antara roda",
          "Pitch adalah rotasi depan–belakang; roll adalah rotasi kiri–kanan. Sudut kamera replay dapat menipu, jadi gunakan baseline dan beberapa lap.",
          rect(450, 263, 235, 114),
        ),
      ],
    ),
  ],
  "membaca-setup": [
    ref(
      "tyres",
      "Mobil dilihat dari atas; bagian depan berada di atas gambar. Kiri / kanan berarti sisi mobil, bukan sisi pengemudi dari kamera yang berbeda.",
      [
        marker(
          "FL",
          wheelNames[0],
          "Panel LEFT FRONT: tekanan, toe, camber dan caster roda depan kiri.",
          rect(164, 167, 131, 102),
        ),
        marker(
          "FR",
          wheelNames[1],
          "Panel RIGHT FRONT: roda depan kanan.",
          rect(479, 167, 131, 102),
        ),
        marker(
          "RL",
          wheelNames[2],
          "Panel LEFT REAR: roda belakang kiri; caster tidak tersedia di panel belakang ini.",
          rect(164, 375, 131, 84),
        ),
        marker(
          "RR",
          wheelNames[3],
          "Panel RIGHT REAR: roda belakang kanan.",
          rect(479, 375, 131, 84),
        ),
      ],
    ),
  ],
  "uji-perubahan": [
    ref(
      "tyres",
      "Simpan baseline dari akses LOAD / SAVE dan catat kondisi. Capture menunjukkan tombol masuk, bukan isi dialog penyimpanan.",
      [
        marker(
          "save",
          "LOAD / SAVE",
          "Buka tombol ini di game untuk menyimpan atau memuat setup baseline. Beri nama mobil–lintasan–kondisi–perubahan agar bisa kembali ke acuan.",
          rect(843, 549, 139, 22),
        ),
        marker(
          "conditions",
          "Kondisi sesi di kanan atas",
          "Capture menampilkan grip FAST serta suhu udara 30°C / lintasan 37°C. Catat kondisi run aktual; kesamaan preset tidak membuktikan kondisi sebanding.",
          rect(791, 43, 125, 22),
        ),
        marker(
          "preset",
          "Nama preset / acuan",
          "SETUP Aggressive preset adalah nama acuan yang ditampilkan. Simpan perubahan terpisah dan ubah satu hal untuk perbandingan yang jelas.",
          rect(304, 24, 248, 32),
        ),
      ],
    ),
  ],
  compound: [
    ref(
      "fuel",
      "Pilihan compound ada pada baris tyre di FUEL AND TYRE. Menu Tyres mengatur tekanan/alignment; compound juga ada pada strategi pit.",
      [
        marker(
          "compound",
          "Tyre · compound awal",
          "DRY berarti slick pada contoh. Pilih berdasarkan permukaan aktual; untuk damp/drying, periksa racing line dan uji kedua opsi bila belum jelas.",
          rect(283, 182, 206, 19),
          ["compound"],
        ),
        marker(
          "pit-tyre",
          "Tyre · compound pit",
          "Pilihan ban pengganti dalam rencana pit. Pilihan awal dan ban saat pit perlu diperiksa secara terpisah.",
          rect(283, 348, 206, 19),
        ),
      ],
    ),
  ],
  tekanan: [
    ref(
      "tyres",
      "Tekanan yang bisa diubah ditampilkan per roda pada menu Tyres. " +
        example +
        " Target hot tetap mengikuti profil app dan status buktinya.",
      tyreRows(
        "pressure",
        "Cold / tekanan awal",
        192,
        400,
        "Baris psi adalah tekanan awal yang kamu atur untuk roda ini. Sesudah run stabil, gunakan hot aktual untuk koreksi; angka screenshot tidak dikonversi otomatis ke suhu sesi kamu.",
      ),
    ),
    ref(
      "tyre-hud",
      "Di lintasan, baca tekanan aktual empat ban dari HUD; screenshot sesaat tidak memenuhi syarat koreksi sendiri.",
      hudMarkers,
    ),
  ],
  "temperatur-ban": [
    ref(
      "tyre-hud",
      "HUD memberi pembacaan saat berkendara; angka psi dan warna thermal merupakan informasi berbeda. Capture ini tidak menampilkan temperatur numerik O/M/I.",
      [hudMarkers[2], hudMarkers[0], hudMarkers[1]],
    ),
    readings,
  ],
  camber: [
    ref(
      "tyres",
      "Baris camber ada pada keempat panel roda, dalam derajat. " + example,
      tyreRows(
        "camber",
        "Camber",
        230,
        438,
        "Pada gambar, nilai negatif berarti bagian atas roda miring ke dalam. Uji perubahan dengan temperatur O/M/I dan respons mobil; sudut gambar mobil bukan pengukuran camber.",
      ),
    ),
  ],
  toe: [
    ref(
      "tyres",
      "Baris toe tersedia untuk roda depan dan belakang. " + example,
      tyreRows(
        "toe",
        "Toe",
        211,
        419,
        "Nilai toe adalah sudut arah roda dilihat dari atas. Baca tanda dan unit di game; diagram di bawah menjelaskan toe-in / toe-out tanpa memprediksi grip dari angka ini.",
      ),
    ),
  ],
  caster: [
    ref(
      "tyres",
      "Caster terlihat hanya pada panel roda depan capture ini. " + example,
      [
        marker(
          "FL",
          "Caster FL · depan kiri",
          "Baris caster, dalam derajat; ini sudut sumbu kemudi dilihat dari samping, bukan kemiringan tapak seperti camber.",
          rect(169, 250, 122, 18),
          ["casterLF"],
        ),
        marker(
          "FR",
          "Caster FR · depan kanan",
          "Roda depan kanan memiliki field sendiri. Ketersediaan dan rentang penyesuaian bergantung mobil.",
          rect(483, 250, 122, 18),
          ["casterRF"],
        ),
      ],
    ),
  ],
  tc: [
    ref(
      "electronics",
      "TC adalah baris pertama ELECTRONIC ELEMENTS. Capture arsip 1.7.7; arti level dan implementasinya tetap bergantung mobil.",
      [
        marker(
          "tc",
          "TC · ambang intervensi",
          "Pada contoh sumber TC = 3. Ini nomor setting game, bukan persentase slip universal atau rekomendasi untuk mobil kamu.",
          rect(154, 192, 205, 17),
          ["tC1"],
        ),
      ],
    ),
  ],
  tc2: [
    ref(
      "electronics",
      "TC2 terlihat di baris terakhir panel. Tidak semua mobil menyediakan TC2 terpisah.",
      [
        marker(
          "tc2",
          "TC2 · karakter intervensi",
          "Contoh sumber TC2 = 3. Interpretasi level dan hubungan dengan TC harus mengikuti mobil, bukan diasumsikan identik untuk semua model.",
          rect(154, 269, 205, 18),
          ["tC2"],
        ),
      ],
    ),
  ],
  abs: [
    ref(
      "electronics",
      "ABS berada di bawah TC. Tabel bantuan di kanan adalah panduan sumber lama dan tidak dipakai untuk merekomendasikan klik.",
      [
        marker(
          "abs",
          "ABS",
          "Contoh ABS = 4. Nomor setting mengatur sistem anti-lock pada mobil ini; bukan koefisien gaya rem dan tidak bisa dibandingkan langsung antar mobil.",
          rect(154, 211, 205, 18),
          ["abs"],
        ),
      ],
    ),
  ],
  "ecu-map": [
    ref(
      "electronics",
      "ECUMap berada di bawah ABS. Map tidak mengikuti urutan performa / hemat yang universal.",
      [
        marker(
          "map",
          "ECUMap",
          "Contoh map = 3. Periksa implementasi mobil dan versi sebelum memilih; pelajaran menjelaskan fungsi map tanpa menganggap angka lebih besar selalu lebih hemat.",
          rect(154, 231, 205, 18),
          ["eCUMap"],
        ),
      ],
    ),
  ],
  telemetry: [
    ref(
      "electronics",
      "Telemetry laps adalah pengaturan jumlah lap perekaman di game, bukan sambungan telemetry ke aplikasi ini.",
      [
        marker(
          "laps",
          "Telemetry laps",
          "Contoh menunjukkan 0. Ini field perekaman game; app tetap memakai input manual. Ketersediaan ekspor / perekaman perlu diperiksa untuk platform kamu.",
          rect(154, 250, 205, 18),
          ["telemetryLaps"],
        ),
      ],
    ),
  ],
  fuel: [
    ref(
      "fuel",
      "Fuel awal dan fuel tambahan pit mempunyai field berbeda. " + example,
      [
        marker(
          "fuel",
          "Fuel · bahan bakar awal",
          "Baris fuel di FUEL AND TYRE menunjukkan 62 L pada capture. Gunakan hasil kalkulator dan kapasitas mobil aktual untuk kebutuhan sesi kamu.",
          rect(283, 163, 206, 19),
          ["fuel"],
        ),
        marker(
          "add",
          "Fuel to add · tambahan saat pit",
          "Nilai 0 L pada contoh adalah tambahan rencana pit, bukan isi tangki setelah pit. Perhitungkan sisa bahan bakar dan aturan event.",
          rect(283, 329, 206, 19),
        ),
      ],
    ),
  ],
  konsumsi: [
    ref(
      "fuel",
      "Fuel per lap adalah informasi estimasi pada capture, bukan slider universal atau jaminan konsumsi run berikutnya.",
      [
        marker(
          "consumption",
          "Fuel per lap · L/lap ESTIMATED",
          "Terlihat 3,45 L/lap ESTIMATED tanpa panah penyetelan. Data arsip katalog bersifat acuan; ukur konsumsi beberapa lap bersih dengan kondisi yang sesuai.",
          rect(282, 257, 207, 19),
          ["fuelPerLap"],
        ),
      ],
    ),
  ],
  "tyre-set": [
    ref(
      "fuel",
      "Tyre set memilih set fisik, sedangkan tyre memilih compound. Nomor set bukan tingkat grip.",
      [
        marker(
          "set",
          "Tyre set",
          "Capture memilih set 1. Perhatikan set yang dipakai dan keausannya; ketersediaan set bergantung sesi dan aturan event.",
          rect(283, 201, 206, 19),
          ["tyreSet"],
        ),
        marker(
          "wear",
          "Wear / grain / blister",
          "Panel ini menampilkan informasi kondisi ban. Angka wear dan status di gambar bukan slider yang dapat diatur.",
          rect(79, 159, 168, 86),
        ),
      ],
    ),
  ],
  pads: [
    ref(
      "fuel",
      "Front brakes / rear brakes memilih compound kampas rem, terpisah untuk depan dan belakang. " +
        example,
      [
        marker(
          "front",
          "Front brakes · pad depan",
          "Contoh compound pad = 2. Pilih sesuai kebutuhan sesi dan perilaku keausan mobil; jangan menganggap angka sebagai persentase kekuatan rem.",
          rect(283, 220, 206, 19),
          ["frontBrakePadCompound"],
        ),
        marker(
          "rear",
          "Rear brakes · pad belakang",
          "Contoh compound pad belakang = 2. Periksa juga rencana pergantian pad saat pit dan pembacaan pad wear.",
          rect(283, 239, 206, 19),
          ["rearBrakePadCompound"],
        ),
      ],
    ),
  ],
  "pit-strategy": [
    ref(
      "fuel",
      "PITSTOP STRATEGY menyimpan rencana servis. N° pitstop memilih entri rencana di UI; field arsip nPitStops / pitStrategy bukan jaminan jumlah pit wajib event.",
      [
        marker(
          "strategy",
          "N° pitstop · entri strategi",
          "Terlihat entri 1. Periksa arti data sumber dan aturan sesi; menyimpan strategi tidak membuat pit stop otomatis atau menjamin aturan terpenuhi.",
          rect(283, 311, 206, 19),
          ["nPitStops", "pitStrategy"],
        ),
        marker(
          "add",
          "Fuel to add",
          "Tambahan fuel saat servis, dalam liter. Bukan target total tangki.",
          rect(283, 330, 206, 18),
        ),
        marker(
          "service",
          "Ban / tekanan / pads untuk pit",
          "Bagian ini menyiapkan compound, tekanan empat roda, serta pad depan / belakang. USE CURRENT PRESSURES menggunakan tekanan setup saat ini sebagai acuan rencana; bukan pembacaan hot baru.",
          rect(282, 349, 207, 149),
        ),
      ],
    ),
  ],
  arb: [
    ref(
      "mechanical",
      "Antiroll bar depan dan belakang ada pada panel bersama tiap axle. " +
        example,
      [
        marker(
          "front",
          "Antiroll bar · depan",
          "Baris FRONT: setelan ARB depan. ARB menghubungkan gerak roda kiri / kanan; nilai klik bukan N/mm universal.",
          rect(267, 141, 240, 18),
          ["aRBFront"],
        ),
        marker(
          "rear",
          "Antiroll bar · belakang",
          "Baris REAR: setelan ARB belakang. Uji keseimbangan roll dan respons tikungan; jangan menganggap kedua axle punya skala kekakuan identik.",
          rect(267, 477, 240, 18),
          ["aRBRear"],
        ),
      ],
    ),
  ],
  "wheel-rate": [
    ref(
      "mechanical",
      "Wheel rate ditampilkan pada keempat roda. Capture memakai N/m: 135.000 N/m setara 135 N/mm; periksa unit sebelum menghitung.",
      mechanicalRows(
        "wheelRate",
        "Wheel rate",
        247,
        380,
        "Ini kekakuan efektif di roda, bukan nomor klik damper. Angka sumber bukan acuan universal; eksperimen N/mm di bawah memakai koefisien ilustratif.",
      ),
    ),
  ],
  "bumpstop-rate": [
    ref(
      "mechanical",
      "Bumpstop rate berada di bawah wheel rate. UI capture menampilkan N; angka ini tidak boleh langsung dipakai sebagai koefisien N/mm eksperimen linear.",
      mechanicalRows(
        "bumpStopRateUp",
        "Bumpstop rate",
        266,
        399,
        "Mengatur dukungan bumpstop setelah engagement. Skala game dan kurva non-linear tidak disimpulkan dari label N ini; eksperimen hanya menunjukkan prinsip.",
      ),
    ),
  ],
  "bumpstop-range": [
    ref(
      "mechanical",
      "Bumpstop range ada di setiap roda. Tampilan 4 depan / 25 belakang adalah contoh sumber, bukan hitungan travel tersisa saat mobil melaju.",
      mechanicalRows(
        "bumpStopWindow",
        "Bumpstop range",
        285,
        418,
        "Field jarak engagement bumpstop. Uji bersama ride height, wheel rate dan travel; jangan menganggap perubahan range sebagai perubahan kekakuan per utama.",
      ),
    ),
  ],
  "brake-power": [
    ref(
      "mechanical",
      "Brake power ada pada panel FRONT bersama parameter rem dan kemudi.",
      [
        marker(
          "power",
          "Brake power · %",
          "Capture menunjukkan 100%. Ini pengali kemampuan rem keseluruhan pada game, bukan pembagian depan / belakang; uji ABS dan modulasi pedal.",
          rect(267, 160, 240, 18),
          ["brakeTorque"],
        ),
      ],
    ),
  ],
  "brake-bias": [
    ref("mechanical", "Brake bias tepat di bawah brake power.", [
      marker(
        "bias",
        "Brake bias · % depan",
        "59,0% pada contoh berarti porsi depan; sisa 41,0% belakang dalam pembagian nominal. Ini tidak menjamin distribusi gaya ban aktual saat ABS dan transfer beban terjadi.",
        rect(267, 179, 240, 18),
        ["brakeBias"],
      ),
    ]),
  ],
  "steering-ratio": [
    ref(
      "mechanical",
      "Steer ratio berada pada panel FRONT; field ini berbeda dari pengaturan rotasi fisik steering wheel.",
      [
        marker(
          "ratio",
          "Steer ratio",
          "Contoh rasio 15:1. Rasio 14:1 dan input setir 140° memberi sekitar 10° roda pada model sederhana; geometri nyata bisa berbeda.",
          rect(267, 198, 240, 18),
          ["steerRatio"],
        ),
      ],
    ),
  ],
  preload: [
    ref(
      "mechanical",
      "Preload differential ada pada panel REAR bersama ARB belakang.",
      [
        marker(
          "preload",
          "Preload differential · Nm",
          "Contoh menunjukkan 60 Nm. Ini preload diferensial, bukan rasio final drive atau gaya pegas; dampaknya perlu diuji pada entry dan exit dengan input konsisten.",
          rect(267, 497, 240, 18),
          ["preload"],
        ),
      ],
    ),
  ],
  "slow-bump": [
    ref(
      "dampers",
      "Slow bump ditulis bump pada UI capture, di setiap panel roda. Slow merujuk kecepatan gerak suspensi.",
      damperRows(
        "bumpSlow",
        "Bump / slow bump",
        192,
        396,
        "Baris bump mengatur redaman kompresi lambat pada roda ini. Nomor klik bukan koefisien N·s/m; nilai ilustrasi eksperimen tidak dikonversi ke klik game.",
      ),
    ),
  ],
  "fast-bump": [
    ref(
      "dampers",
      "Fast bump berada di bawah bump pada keempat roda; fast berarti gerak suspensi cepat, bukan kecepatan mobil.",
      damperRows(
        "bumpFast",
        "Fast bump",
        211,
        415,
        "Baris fast bump relevan untuk kompresi cepat seperti benturan kerb. Uji bersama travel dan bumpstop; tidak otomatis makin tinggi makin baik.",
      ),
    ),
  ],
  "slow-rebound": [
    ref(
      "dampers",
      "Slow rebound ditulis rebound pada UI capture, setelah fast bump.",
      damperRows(
        "reboundSlow",
        "Rebound / slow rebound",
        230,
        434,
        "Mengatur redaman pemanjangan lambat suspensi. Pisahkan observasi dari kompresi dan uji pemulihan bodi serta kontak ban.",
      ),
    ),
  ],
  "fast-rebound": [
    ref(
      "dampers",
      "Fast rebound adalah baris terakhir pada keempat panel roda.",
      damperRows(
        "reboundFast",
        "Fast rebound",
        249,
        453,
        "Mengatur pemanjangan cepat setelah gangguan seperti kerb. Nomor klik di screenshot bukan koefisien linear; amati osilasi dan apakah roda dapat mengikuti permukaan.",
      ),
    ),
  ],
  "ride-height": [
    ref(
      "aero",
      "Ride height berada pada panel FRONT dan REAR. Bodi di gambar ini menghadap kanan, berbeda dari tampilan atas Tyres.",
      [
        marker(
          "front",
          "Ride height · depan",
          "Contoh tinggi depan = 53 mm. Ini field tinggi setup, bukan clearance dinamis saat rem / kerb.",
          rect(509, 192, 186, 18),
          ["heightFront"],
        ),
        marker(
          "rear",
          "Ride height · belakang",
          "Contoh belakang = 62 mm; selisih statis 9 mm pada sumber. Contoh belajar 70 − 55 = 15 mm terpisah dari setting screenshot dan bukan sudut rake.",
          rect(77, 192, 186, 18),
          ["heightRear"],
        ),
      ],
    ),
  ],
  wing: [
    ref(
      "aero",
      "Rear wing berada pada panel REAR. Garis warna pada mobil merupakan visual bantuan game, bukan hasil pengukuran gaya.",
      [
        marker(
          "wing",
          "Rear wing",
          "Contoh setting 5. Angka setting bukan derajat universal atau nilai downforce; gunakan pengujian drag / stabilitas dengan ride height yang sesuai.",
          rect(77, 211, 186, 18),
          ["rearWing"],
        ),
        marker(
          "air",
          "Visual aliran udara",
          "Bantuan visual memberi konteks aero. Hubungan kuadrat di eksperimen berlaku ketika koefisien tetap, bukan grip ban empat kali lipat.",
          rect(86, 284, 600, 155),
        ),
      ],
    ),
  ],
  splitter: [
    ref(
      "aero",
      "Splitter terlihat pada panel FRONT, tetapi pada capture ini bernilai 0 tanpa kontrol merah aktif. Jangan menganggap semua mobil menyediakan slider splitter.",
      [
        marker(
          "splitter",
          "Splitter · field tampak tetap",
          "Gambar menunjukkan lokasi / informasi splitter pada mobil sumber. Ketersediaan penyesuaian bergantung mobil dan versi; uji hanya parameter yang memang dapat diubah di game kamu.",
          rect(509, 211, 186, 18),
          ["splitter"],
        ),
      ],
    ),
  ],
  ducts: [
    ref(
      "aero",
      "Brake ducts tersedia pada panel FRONT / REAR dan berkaitan dengan pendinginan rem serta panas menuju ban.",
      [
        marker(
          "front",
          "Brake ducts · depan",
          "Contoh level 4. Nomor bukaan game bukan persentase luas universal; uji temperatur dan tekanan hot tanpa menebak koreksi suhu dari angka ini.",
          rect(509, 230, 186, 18),
          ["ductfront"],
        ),
        marker(
          "rear",
          "Brake ducts · belakang",
          "Panel belakang juga menunjukkan 4. Periksa temperatur rem, ban dan keausan pada kondisi sesi aktual.",
          rect(77, 230, 186, 18),
          ["ductrear"],
        ),
      ],
    ),
  ],
  "aero-balance": [
    ref(
      "aero",
      "FRONT AERO VARIATION adalah indikator relatif terhadap base ride height, bukan slider atau persentase absolut downforce depan.",
      [
        marker(
          "variation",
          "Front aero variation · informasi",
          "Capture menunjukkan 2,9% dan base ride height 65 rear − 60 front. Artinya variasi terhadap acuan mobil sumber; jangan membaca 2,9% sebagai seluruh porsi downforce depan.",
          rect(291, 462, 190, 40),
          ["aeroBalance"],
        ),
      ],
    ),
  ],
};
