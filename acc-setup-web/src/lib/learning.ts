import type {
  LearningModule,
  LearningSource,
  LearningTopic,
  LearningVisual,
  LearningExperiment,
} from "../types";
import { learningTopicScreenshots } from "./learningMedia";

export const learningModules: LearningModule[] = [
  {
    id: "dasar",
    title: "Fondasi & cara menguji",
    description:
      "Kenali grip, fase tikungan, gerakan mobil, dan cara membaca perubahan.",
  },
  {
    id: "tyres",
    title: "Tyres & alignment",
    description: "Pilih ban, ukur tekanan, dan pahami sudut roda.",
  },
  {
    id: "electronics",
    title: "Electronics",
    description: "Pahami intervensi TC, ABS, serta karakter ECU map.",
  },
  {
    id: "fuel",
    title: "Fuel & strategy",
    description: "Rencanakan fuel, set ban, kampas rem, dan pit.",
  },
  {
    id: "mechanical",
    title: "Mechanical grip",
    description: "Atur dukungan suspensi, rem, kemudi, dan diferensial.",
  },
  {
    id: "dampers",
    title: "Dampers",
    description: "Bedakan kecepatan gerak suspensi dan arah redamannya.",
  },
  {
    id: "aero",
    title: "Aero",
    description: "Hubungkan gaya udara, tinggi mobil, dan pendinginan.",
  },
];
export const learningSources: LearningSource[] = [
  {
    id: "kunos19",
    title: "ACC v1.9 — Physics notes",
    publisher: "Kunos / Aristotelis Vasilakos",
    url: "https://assettocorsa.gg/wp-content/uploads/ACCv19-physics_notes.pdf",
    kind: "acc-version",
    note: "Arsip v1.9. Acuan model fisika pada versi tersebut; bukan validasi seluruh patch berikutnya.",
  },
  {
    id: "aris-suspension",
    title: "Suspension and setups — tulisan pengembang",
    publisher: "Aristotelis Vasilakos, direproduksi OverTake",
    url: "https://www.overtake.gg/threads/assetto-corsa-competizione-blog-suspension-and-setups.159375/",
    kind: "acc-version",
    note: "Tulisan primer pengembang yang direproduksi; arsip awal ACC, digunakan untuk konsep dan perbedaan kurva damper.",
  },
  {
    id: "aris-ecu",
    title: "ECU maps implementation — tulisan pengembang",
    publisher: "Aristotelis Vasilakos, direproduksi OverTake",
    url: "https://www.overtake.gg/threads/assetto-corsa-competizione-ecu-maps-implementation-blog.163740/",
    kind: "acc-version",
    note: "Arsip 2019. Contoh map per mobil lama, bukan daftar map terkini untuk semua mobil.",
  },
  {
    id: "kunos-pads",
    title: "Changelog resmi ACC v1.2 — brake pads & wear",
    publisher: "Kunos, pengumuman resmi Steam",
    url: "https://store.steampowered.com/news/posts/?appids=805550&enddate=1589566511&feed=steam_community_announcements",
    kind: "acc-version",
    note: "Arsip 17 Desember 2019. Menjelaskan tujuan pad 1–4 dan faktor keausan; angka umur lama tidak dipakai sebagai jaminan untuk patch berikutnya.",
  },
  {
    id: "cda19",
    title: "Hasil pengujian ACC v1.9",
    publisher: "Coach Dave Academy",
    url: "https://coachdaveacademy.com/announcements/1-9-acc-faq-coach-dave/",
    kind: "direct-testing",
    note: "Laporan pengujian langsung penyedia setup, era v1.9. Umur pad dan perilaku ban tetap bergantung penggunaan.",
  },
  {
    id: "cda-wet",
    title: "FAQ — acuan tekanan wet",
    publisher: "Coach Dave Academy",
    url: "https://coachdaveacademy.com/documentation/coach-dave-delta-help-centre-the-complete-faq-guide/",
    kind: "direct-testing",
    note: "Panduan publik. Profil wet 30–31 psi pada app belum diverifikasi untuk seluruh model dan patch.",
  },
  {
    id: "penske",
    title: "Adjustable shock technical manual",
    publisher: "Penske Racing Shocks",
    url: "https://www.penskeshocks.com/hubfs/Resources/Manuals/Adjustable-Manual1.pdf?hsLang=en",
    kind: "principle",
    note: "Dokumentasi produsen damper. Kurva dan angka perangkat nyata bukan pemetaan klik ACC.",
  },
  {
    id: "penske-speed",
    title: "Low-speed dan high-speed damping",
    publisher: "Penske Racing Shocks",
    url: "https://www.penskeshocks.com/blog/what-is-the-difference-between-low-speed-damping-and-high-speed-damping",
    kind: "principle",
    note: "Kecepatan yang dimaksud adalah gerak damper; batas antar zona bergantung desain damper.",
  },
  {
    id: "eibach",
    title: "Anti-roll kit",
    publisher: "Eibach",
    url: "https://www.eibach.com/products/anti-roll-kit",
    kind: "principle",
    note: "Fungsi dasar anti-roll bar. Arah tuning pada pelajaran adalah hipotesis dengan pengaturan lain tetap.",
  },
  {
    id: "bosch-abs",
    title: "Prinsip dan sejarah ABS",
    publisher: "Bosch",
    url: "https://www.bosch.com/stories/beginnings-of-abs/",
    kind: "principle",
    note: "Prinsip anti-lock; tidak menentukan setting ABS ACC.",
  },
  {
    id: "bosch-tc",
    title: "ECU MS 4 Sport — traction control",
    publisher: "Bosch Motorsport",
    url: "https://www.bosch-motorsport.com/media/downloads/ecu_ms_4_sport_turbo.pdf",
    kind: "principle",
    note: "Contoh implementasi ECU motorsport; ambang dan strategi tidak universal antar mobil.",
  },
  {
    id: "nasa-lift",
    title: "Lift equation",
    publisher: "NASA Glenn Research Center",
    url: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/",
    kind: "principle",
    note: "Untuk downforce digunakan besar koefisien lift negatif. Koefisien berubah dengan kondisi aero.",
  },
  {
    id: "nasa-drag",
    title: "Drag equation",
    publisher: "NASA Glenn Research Center",
    url: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    kind: "principle",
    note: "Persamaan gaya hambat; luas referensi harus konsisten dengan definisi koefisien.",
  },
  {
    id: "openstax",
    title: "Simple harmonic motion — spring",
    publisher: "OpenStax / Rice University",
    url: "https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion",
    kind: "principle",
    note: "Hukum per linear untuk ilustrasi, bukan seluruh model suspensi dan ban.",
  },
  {
    id: "geometry",
    title: "Suspension geometry calculator",
    publisher: "Racing Aspirations",
    url: "https://www.racingaspirations.com/apps/suspension-geometry-calculator/",
    kind: "principle",
    note: "Alat geometri pembuatnya. Diagram lokal memperjelas sudut tanpa memprediksi grip atau FFB.",
  },
];
export const visualIds: LearningVisual[] = [
  "pressure",
  "alignment",
  "electronics",
  "fuel",
  "mechanical",
  "damper",
  "aero",
  "foundation",
  "grip",
  "corner",
  "body-motion",
  "compound",
  "telemetry",
  "tyre-set",
  "pads",
  "pit",
  "arb",
  "brake",
  "steering",
  "differential",
  "ducts",
];
export const experimentIds: LearningExperiment[] = [
  "pressure",
  "alignment",
  "electronics",
  "fuel",
  "mechanical",
  "damper",
  "aero",
];
const wheelKeys = (prefix: string) =>
  ["FL", "FR", "RL", "RR"].map((w) => prefix + w);
type LessonInput = Omit<
  LearningTopic,
  "checklist" | "relatedIds" | "screenshots"
> & {
  checklist: string[];
  relatedIds?: string[];
};
function lesson(t: LessonInput): LearningTopic {
  return {
    ...t,
    screenshots: learningTopicScreenshots[t.id] ?? [],
    relatedIds: t.relatedIds ?? [],
    checklist: [
      "Tetapkan baseline: mobil, lintasan, compound, versi, kondisi, dan fuel yang sama.",
      ...t.checklist,
      "Bandingkan beberapa lap bersih; catat kompromi dan ulangi baseline bila hasilnya belum jelas.",
    ],
  };
}

export const learningTopics: LearningTopic[] = [
  lesson({
    id: "grip",
    moduleId: "dasar",
    title: "Grip, understeer & oversteer",
    aliases: ["susah belok", "melebar", "spin", "traksi", "slip", "licin"],
    parameterKeys: [],
    unit: "Gejala berkendara",
    definition:
      "Grip adalah kemampuan ban menghasilkan gaya pada aspal. Ban berbagi pekerjaan antara mengerem, membelok, dan berakselerasi. Understeer berarti depan tidak mengikuti arah yang diminta; oversteer berarti belakang bergeser sehingga mobil berputar terlalu banyak.",
    increase:
      "Menambah setir ketika depan sudah melewati kemampuan grip dapat memperbesar slip tanpa membuat radius tikungan lebih kecil.",
    decrease:
      "Mengurangi kecepatan masuk atau tuntutan rem/gas dapat mengembalikan ruang bagi ban untuk membelok. Lepaskan input secara bertahap agar transisinya dapat dikendalikan.",
    condition:
      "Hipotesis uji: periksa input mengemudi dan kondisi ban sebelum menyimpulkan bahwa suatu parameter setup menjadi penyebab.",
    scenario:
      "Mobil melebar saat masih mengerem keras. Lo menambah setir, tetapi mobil tetap melebar. Pada percobaan berikutnya, perlambat sedikit lebih awal dan lepaskan rem lebih halus.",
    example:
      "Catatan kurang jelas: “mobil understeer”.\nCatatan berguna: “depan melebar pada entry tikungan lambat saat rem masih besar; mid-corner sudah normal”.",
    checklist: [
      "Pilih satu tikungan dan tandai titik pengereman serta pelepasan rem.",
      "Bandingkan input yang lebih halus sebelum mengubah setup.",
    ],
    technical:
      "Gambaran friction budget menjelaskan gabungan gaya longitudinal dan lateral. Ban nyata memiliki load sensitivity, slip angle, temperatur, dan karakter permukaan; tidak ada satu angka koefisien grip untuk semua keadaan.",
    limitation:
      "Diagram anggaran gaya bersifat konseptual. Tidak menghitung radius, waktu lap, atau batas grip mobil ACC.",
    sourceIds: ["kunos19", "bosch-abs"],
    relatedIds: ["fase-tikungan", "tekanan", "uji-perubahan"],
    visual: "grip",
  }),
  lesson({
    id: "fase-tikungan",
    moduleId: "dasar",
    title: "Entry, mid-corner & exit",
    aliases: ["masuk", "tengah", "keluar", "apex", "trail braking", "coasting"],
    parameterKeys: [],
    unit: "Fase tikungan",
    definition:
      "Entry adalah transisi masuk tikungan, mid-corner fase membelok di tengah, dan exit fase menambah gas serta membuka setir. Nama fase membantu membedakan masalah yang tampak mirip tetapi terjadi dengan beban dan input berbeda.",
    increase:
      "Lebih banyak pengereman sambil membelok menambah tuntutan pada ban depan. Penambahan gas saat setir masih besar menambah tuntutan traksi roda penggerak.",
    decrease:
      "Pelepasan rem yang bertahap dan pembukaan setir saat menambah gas mengubah pembagian pekerjaan ban. Efeknya tetap bergantung kecepatan dan kondisi.",
    condition:
      "Hipotesis uji: pisahkan fase, kecepatan, dan permukaan sebelum memilih arah tuning.",
    scenario:
      "Belakang stabil di tengah tikungan tetapi lepas saat gas dibuka. Periksa teknik gas, ban belakang dan TC; jangan langsung menganggap wing kurang hanya karena terjadi oversteer.",
    example:
      "Entry: rem → mulai membelok → lepas rem.\nMid-corner: mempertahankan arah.\nExit: buka setir → tambah gas.\nFase dapat bertumpang tindih; ini bukan aturan waktu yang kaku.",
    checklist: [
      "Catat fase dan kecepatan ketika masalah muncul.",
      "Ulangi satu perubahan input pada tikungan yang sama.",
    ],
    technical:
      "Pada transisi, gerakan bodi, diferensial, elektronik dan keseimbangan aero ikut bekerja. Setup yang membantu entry dapat menimbulkan kompromi pada exit.",
    limitation:
      "Urutan input adalah contoh belajar, bukan instruksi universal untuk semua tikungan.",
    sourceIds: ["penske-speed", "bosch-tc"],
    relatedIds: ["grip", "preload", "tc"],
    visual: "corner",
  }),
  lesson({
    id: "gerak-bodi",
    moduleId: "dasar",
    title: "Pitch, roll & perpindahan beban",
    aliases: ["weight transfer", "beban", "hidung turun", "bodi miring", "yaw"],
    parameterKeys: [],
    unit: "N, m, m/s²",
    definition:
      "Pitch adalah gerakan hidung naik/turun, roll kemiringan ke samping, dan yaw putaran arah mobil. Saat akselerasi atau pengereman, distribusi beban vertikal berubah. Per dan damper mengatur gerak serta respons transisi, bukan menghapus kebutuhan perpindahan beban.",
    increase:
      "Perlambatan lebih besar atau pusat massa lebih tinggi meningkatkan perkiraan transfer longitudinal. Roll lebih besar juga dapat mengubah sudut roda dan platform aero.",
    decrease:
      "Mengurangi percepatan/perlambatan mengurangi transfer pada model sederhana. Mengurangi gerak bodi melalui setup tetap memiliki kompromi compliance dan grip.",
    condition:
      "Prinsip fisika: bedakan gerak bodi yang terlihat dengan jumlah beban yang ditanggung tiap ban.",
    scenario:
      "Mobil terlihat lebih datar setelah damping ditambah. Itu tidak membuktikan seluruh ban menerima beban yang sama atau bahwa grip pasti meningkat.",
    example:
      "ΔF ≈ m × a × h ÷ L\nm: massa (kg); a: perlambatan (m/s²)\nh: tinggi pusat massa (m); L: wheelbase (m)\nΔF: perubahan beban longitudinal (N).",
    checklist: [
      "Amati pitch saat pengereman dan roll di tikungan yang sama.",
      "Periksa apakah perubahan membantu ban mengikuti permukaan atau justru membuat mobil meloncat.",
    ],
    technical:
      "Rumus transfer tersebut memakai model sederhana tanpa kontribusi aero dan geometri suspensi yang lengkap. Kekakuan roll depan/belakang mengubah pembagian transfer lateral antar axle.",
    limitation:
      "Data pusat massa dan geometri kendaraan tidak tersedia di app; rumus tidak menentukan klik setup.",
    sourceIds: ["penske", "eibach"],
    relatedIds: ["wheel-rate", "arb", "ride-height"],
    visual: "body-motion",
  }),
  lesson({
    id: "membaca-setup",
    moduleId: "dasar",
    title: "Baca angka, satuan & posisi roda",
    aliases: [
      "FL",
      "FR",
      "RL",
      "RR",
      "depan kiri",
      "nol",
      "data kosong",
      "klik",
    ],
    parameterKeys: [],
    unit: "Satuan parameter",
    definition:
      "FL/FR adalah depan kiri/kanan; RL/RR belakang kiri/kanan dari posisi pengemudi. Angka 0 adalah nilai sah. Tidak berlaku berarti setting tidak tersedia pada model; data kosong berarti sumber tidak mencatatnya; belum terverifikasi berarti konversinya belum dapat dipercaya.",
    increase:
      "Pada angka bertanda, bedakan nilai dan besarnya: −4° lebih negatif daripada −3°. Nomor map, pad, set ban dan klik juga tidak selalu menunjukkan besaran gaya yang makin tinggi.",
    decrease:
      "Mengurangi nomor set ban memilih set lain, bukan mengurangi jumlah ban. Mengurangi rasio kemudi membuat respons lebih cepat, bukan menambah grip.",
    condition:
      "Perilaku ACC dan ketersediaan slider bergantung mobil. Satuan katalog tidak boleh diganti berdasarkan tebakan.",
    scenario:
      "Sumber menunjukkan bumpstop rate dalam N dan damper sebagai setting. Jangan memasukkan keduanya ke rumus linear sebagai N/mm tanpa bukti konversi.",
    example:
      "Tekanan: psi.\nCamber/toe/caster: derajat.\nWheel rate: N/m; 100.000 N/m = 100 N/mm.\nPreload: Nm, bukan persen lock.",
    checklist: [
      "Cocokkan label game, posisi roda, satuan, dan status nilai.",
      "Pertahankan label belum terverifikasi ketika sumber belum menyediakan konversi.",
    ],
    technical:
      "Wheel rate sudah merupakan kekakuan efektif di roda. Jika memakai spring rate, faktor motion ratio perlu didefinisikan; jangan menerapkannya dua kali pada wheel rate.",
    limitation:
      "Pelajaran memberi konteks membaca data; tidak mengimpor atau memetakan ulang file setup game.",
    sourceIds: ["aris-suspension", "geometry"],
    relatedIds: ["wheel-rate", "steering-ratio"],
    visual: "foundation",
  }),
  lesson({
    id: "uji-perubahan",
    moduleId: "dasar",
    title: "Uji satu perubahan dengan adil",
    aliases: [
      "baseline",
      "A/B",
      "latihan",
      "konsistensi",
      "metode",
      "setup terbaik",
    ],
    parameterKeys: [],
    unit: "Catatan run",
    definition:
      "Baseline adalah acuan yang diulang. Tuning dimulai dari gejala yang konsisten, lalu perubahan kecil, pengamatan, dan pembandingan. Satu lap terbaik saja dapat dipengaruhi traffic, fuel, kondisi, atau variasi mengemudi.",
    increase:
      "Menambah banyak perubahan sekaligus membuat penyebab hasil sulit diketahui. Tambah kualitas catatan sebelum menambah jumlah parameter yang diubah.",
    decrease:
      "Kurangi variabel: gunakan ban, fuel, cuaca dan teknik yang sebanding. Jika hasil meragukan, kembali ke baseline untuk memastikan perubahan benar-benar terasa.",
    condition:
      "Hipotesis uji harus menyebut fase dan kompromi. Jangan menyebut suatu perubahan berhasil hanya karena lap tunggal lebih cepat.",
    scenario:
      "Depan melebar konsisten di mid-corner lambat. Setelah input dan tekanan diperiksa, coba front ARB sedikit lebih lunak. Catat apakah rotasi membaik dan apakah kerb atau tikungan lain memburuk.",
    example:
      "A: baseline → beberapa lap bersih.\nB: satu perubahan → beberapa lap bersih.\nA lagi: ulangi baseline bila perlu.\nCatat gejala, kondisi, dan kompromi.",
    checklist: [
      "Pastikan tekanan stabil dan run bebas insiden yang mengganggu pengukuran.",
      "Tuliskan satu hipotesis, satu perubahan, dan satu hal yang akan diamati.",
    ],
    technical:
      "App latihan mengevaluasi deviasi tekanan, bukan membuktikan peningkatan waktu lap. Perubahan handling membutuhkan pengamatan mengemudi yang terpisah.",
    limitation:
      "Checklist tidak menyimpan progres belajar atau menulis otomatis ke practice log.",
    sourceIds: ["penske"],
    relatedIds: ["tekanan", "arb", "fase-tikungan"],
    visual: "telemetry",
  }),
  lesson({
    id: "compound",
    moduleId: "tyres",
    title: "Compound & permukaan lintasan",
    aliases: ["slick", "wet", "dry", "damp", "drying", "hujan", "ban basah"],
    parameterKeys: ["compound"],
    unit: "Jenis ban",
    definition:
      "Compound di sini membedakan slick dan wet. Slick ditujukan untuk permukaan kering; wet memiliki alur untuk menghadapi air. Jenis ban berbeda dari nomor tyre set yang mencatat set fisik yang dipakai.",
    increase:
      "Air yang makin banyak pada racing line memperkuat alasan menguji wet. Pantau perubahan selama stint, bukan hanya cuaca saat keluar pit.",
    decrease:
      "Ketika racing line mengering, wet dapat terlalu panas dan aus. Slick dapat menjadi opsi, tetapi bagian basah di luar garis balap tetap memerlukan kehati-hatian.",
    condition:
      "Dry → slick; light/heavy wet → wet. Damp/drying tanpa observasi line → kedua opsi perlu diuji, bukan keputusan otomatis dari suhu saja.",
    scenario:
      "Lintasan drying, tetapi garis pengereman masih basah. Jangan memilih slick hanya karena langit cerah; amati garis yang benar-benar akan lo lewati.",
    example:
      "Permukaan dry: acuan slick.\nPermukaan wet: acuan wet.\nDamp/drying: catat line dry/wet/tidak diketahui.",
    checklist: [
      "Amati racing line, standing water, dan arah perubahan cuaca.",
      "Catat compound aktual dan ukur ulang ketika jenis ban berubah.",
    ],
    technical:
      "Ban, permukaan, temperatur dan beban saling berinteraksi. Tidak ada ambang suhu tunggal untuk mengganti slick/wet di semua mobil.",
    limitation:
      "Pilihan compound adalah acuan uji, bukan jaminan keselamatan atau waktu lap tercepat.",
    sourceIds: ["kunos19", "cda-wet"],
    relatedIds: ["tekanan", "tyre-set"],
    visual: "compound",
  }),
  lesson({
    id: "tekanan",
    moduleId: "tyres",
    title: "Cold, hot & koreksi tekanan",
    aliases: ["pressure", "psi", "tekanan ban", "dingin", "panas"],
    parameterKeys: wheelKeys("pressure"),
    unit: "psi",
    definition:
      "Cold adalah tekanan awal yang dipakai; hot adalah hasil saat ban bekerja. Gunakan tekanan yang benar-benar digunakan, bukan angka katalog yang belum diuji pada kondisi lo. Setiap roda menerima beban berbeda.",
    increase:
      "Tekanan lebih tinggi mengubah dukungan dan kelenturan ban. Bila hot melewati rentang, contoh koreksi menurunkan cold menuju batas terdekat.",
    decrease:
      "Tekanan lebih rendah mengubah deformasi dan panas. Bila hot di bawah rentang, contoh menaikkan cold; lebih rendah tidak selalu memberi grip lebih besar.",
    condition:
      "Acuan historis slick DHF v1.9: 26–27 psi; wet publik: 30–31 psi. Cakupan profil dan status bukti app tetap berlaku, bukan verifikasi seluruh patch.",
    scenario:
      "Cold FL 23,8 menghasilkan hot 27,5. Dengan target 27 dan pengukuran layak, cold uji berikutnya 23,3. Hot 26,6 dalam rentang 26–27 mempertahankan cold 23,8.",
    example:
      "Cold berikutnya = cold aktual + target − hot\n23,8 + 27,0 − 27,5 = 23,3 psi\nDalam rentang: pertahankan cold aktual.",
    checklist: [
      "Catat lap ukur; tunggu tekanan relatif stabil.",
      "Pastikan bebas insiden yang memengaruhi ban dan kondisi berikutnya sebanding.",
    ],
    technical:
      "Koreksi empiris dibulatkan 0,1 psi. Tidak memprediksi cold dengan koefisien suhu universal. Target manual mengikuti batas profil aktif bila ada.",
    limitation:
      "Batas target 20–40 psi dan cold/hot/hasil 10–50 psi adalah kewajaran aplikasi, bukan batas slider resmi mobil. Contoh tidak mengubah draft latihan.",
    sourceIds: ["kunos19", "cda-wet"],
    relatedIds: ["temperatur-ban", "compound", "uji-perubahan"],
    visual: "pressure",
    experiment: "pressure",
  }),
  lesson({
    id: "temperatur-ban",
    moduleId: "tyres",
    title: "Temperatur & pengukuran ban",
    aliases: [
      "temperature",
      "suhu",
      "OMI",
      "IMO",
      "inner",
      "middle",
      "outer",
      "aus",
    ],
    parameterKeys: [],
    unit: "°C",
    definition:
      "Temperatur permukaan dan core bukan pengukuran yang sama. Bagian dalam, tengah, dan luar ban membantu memahami pola kerja, tetapi bacaan juga dipengaruhi tikungan terakhir dan waktu pengukuran.",
    increase:
      "Panas yang terus bertambah dapat berasal dari slip, beban, tekanan atau panas rem. Jangan langsung menyalahkan camber tanpa melihat pola dan kondisi.",
    decrease:
      "Pendinginan di straight atau cuaca lebih dingin mengubah bacaan. Ban yang lebih dingin belum tentu membutuhkan duct tertutup atau tekanan lebih rendah.",
    condition:
      "Perilaku ACC berubah menurut versi; panduan temperatur lama tidak boleh dicampur dengan pembacaan dari patch lain tanpa konteks.",
    scenario:
      "Bagian dalam jauh lebih panas setelah tikungan panjang. Ulangi pengukuran pada titik yang sama sebelum mengubah alignment; jangan membandingkannya dengan bacaan setelah straight.",
    example:
      "ΔT = temperatur bagian dalam − bagian luar.\nContoh 95 − 88 = 7°C.\nSelisih adalah pengamatan, bukan rumus konversi ke klik camber.",
    checklist: [
      "Catat lokasi dan waktu pengukuran serta jenis temperatur yang dibaca.",
      "Bandingkan pola beberapa lap dengan tekanan, slip, dan rem.",
    ],
    technical:
      "Satu angka temperatur tidak menjelaskan seluruh distribusi panas. Tujuan bukan membuat seluruh zona selalu sama, melainkan membaca pola pada kondisi yang dapat dibandingkan.",
    limitation:
      "App tidak membaca telemetry langsung atau menghitung camber optimal dari selisih temperatur.",
    sourceIds: ["kunos19", "cda19"],
    relatedIds: ["camber", "toe", "ducts"],
    visual: "pressure",
  }),
  lesson({
    id: "camber",
    moduleId: "tyres",
    title: "Camber: kemiringan roda",
    aliases: ["sudut roda", "negative camber", "kemiringan", "alignment"],
    parameterKeys: wheelKeys("camber"),
    unit: "°",
    definition:
      "Camber dilihat dari depan/belakang mobil. Negatif berarti bagian atas roda miring ke dalam. Ini membantu orientasi bidang kontak ketika suspensi, bodi dan ban berubah bentuk saat menikung.",
    increase:
      "Lebih negatif berarti besar kemiringan bertambah: −4° lebih negatif daripada −3°. Dapat membantu dukungan saat menikung, tetapi berlebihan mengganggu kontak lurus dan pola panas.",
    decrease:
      "Mendekati nol mengurangi kemiringan. Bisa membantu kerja longitudinal pada kondisi tertentu, tetapi ban luar mungkin kurang didukung saat menikung.",
    condition:
      "Hipotesis uji: kebutuhan camber mengikuti geometri, beban, temperatur dan jenis tikungan. Jangan otomatis memakai batas maksimum.",
    scenario:
      "Grip lateral membaik setelah camber lebih negatif, tetapi pengereman atau exit memburuk. Itu kompromi yang perlu dicatat, bukan tanda bahwa satu angka selalu benar.",
    example:
      "−3° → −4°: lebih negatif.\n−4° → −3°: kurang negatif.\nDiagram depan memperbesar sudut agar mudah dilihat; tidak menggambar contact patch nyata.",
    checklist: [
      "Ubah kecil pada axle yang sedang dievaluasi.",
      "Bandingkan tikungan, pengereman, traction, dan pola temperatur pada titik ukur yang sama.",
    ],
    technical:
      "Camber statis berbeda dari camber saat roda terbebani. Roll, gerakan suspensi dan caster dapat mengubahnya; data geometri diperlukan untuk perhitungan lengkap.",
    limitation: "Tidak ada konversi universal dari ΔT ban ke derajat camber.",
    sourceIds: ["geometry", "kunos19"],
    relatedIds: ["temperatur-ban", "caster", "arb"],
    visual: "alignment",
    experiment: "alignment",
  }),
  lesson({
    id: "toe",
    moduleId: "tyres",
    title: "Toe-in & toe-out",
    aliases: ["konvergensi", "divergensi", "sudut roda", "toe in", "toe out"],
    parameterKeys: wheelKeys("toe"),
    unit: "°",
    definition:
      "Toe dilihat dari atas. Toe-in membuat ujung depan pasangan roda mengarah ke dalam; toe-out ke luar. Pada ACC, positif umumnya toe-in dan negatif toe-out.",
    increase:
      "Lebih toe-in dapat menambah kestabilan, khususnya belakang, dengan kompromi agility dan gesekan. Nilai terlalu besar juga membuat roda saling menyeret.",
    decrease:
      "Lebih toe-out dapat mengubah respons atau rotasi. Penggunaan berlebihan dapat membuat kemudi gelisah dan belakang kurang stabil saat pengereman.",
    condition:
      "Hipotesis uji: toe depan dan belakang tidak memiliki fungsi yang identik. Nilai serta efek harus diperiksa pada mobil dan versi yang sama.",
    scenario:
      "Mobil lebih mudah berputar dengan toe-out belakang tetapi mulai goyah saat hard braking. Uji pengurangan toe-out sebelum menambah perubahan lain.",
    example:
      "Toe-in (+): ujung depan roda menuju pusat mobil.\nToe-out (−): ujung depan roda menjauhi pusat mobil.\nDiagram atas: panah menandai arah maju.",
    checklist: [
      "Pisahkan perubahan depan dan belakang.",
      "Amati kestabilan straight, entry, temperatur dan keausan.",
    ],
    technical:
      "Toe statis dapat berubah ketika suspensi bergerak. Geometri, compliance dan steering linkage memengaruhi toe dinamis.",
    limitation:
      "Diagram bukan perhitungan Ackermann atau prediksi drag ban; efek tidak diterjemahkan menjadi persen grip.",
    sourceIds: ["geometry", "kunos19"],
    relatedIds: ["camber", "preload"],
    visual: "alignment",
    experiment: "alignment",
  }),
  lesson({
    id: "caster",
    moduleId: "tyres",
    title: "Caster & rasa kemudi",
    aliases: ["self centering", "FFB", "sumbu kemudi", "setir kembali"],
    parameterKeys: ["casterLF", "casterRF"],
    unit: "°",
    definition:
      "Caster adalah kemiringan sumbu putar kemudi dilihat dari samping. Positive caster berhubungan dengan trail, kecenderungan kemudi kembali ke tengah, dan perubahan camber ketika roda dibelokkan.",
    increase:
      "Dapat memperkuat self-centering dan mengubah usaha/rasa kemudi serta camber saat steering. Besarnya efek mengikuti geometri; maksimum belum tentu nyaman atau efektif.",
    decrease:
      "Dapat mengurangi usaha self-centering dan mengubah feedback. Perubahan FFB yang terasa tidak otomatis berarti grip bertambah atau berkurang.",
    condition:
      "Prinsip geometri: bedakan caster, trail, camber, steering ratio, dan pengaturan FFB perangkat.",
    scenario:
      "Setir terasa berat setelah caster ditambah. Periksa kemampuan mengontrol koreksi kecil; jangan menilai setting hanya dari berat setir.",
    example:
      "Camber: lihat dari depan.\nToe: lihat dari atas.\nCaster: lihat dari samping, pada sumbu kemudi.",
    checklist: [
      "Gunakan sudut setir dan tikungan yang sama saat membandingkan.",
      "Amati self-centering, feedback, dan kontrol koreksi tanpa mengubah FFB bersamaan.",
    ],
    technical:
      "Trail geometris dipengaruhi titik perpotongan sumbu kemudi dengan tanah dan letak bidang kontak. Caster saja belum cukup untuk menghitung seluruh torsi setir.",
    limitation:
      "Gambar sumbu adalah ilustrasi, bukan rekonstruksi geometri setiap mobil ACC.",
    sourceIds: ["geometry"],
    relatedIds: ["camber", "steering-ratio"],
    visual: "alignment",
    experiment: "alignment",
  }),
  lesson({
    id: "tc",
    moduleId: "electronics",
    title: "TC: kapan intervensi dimulai",
    aliases: ["traction control", "wheelspin", "traksi", "gas terputus"],
    parameterKeys: ["tC1"],
    unit: "Setting per mobil",
    definition:
      "Traction control mengendalikan slip roda penggerak melalui pengurangan torsi. Pada mobil dengan TC1/TC2 terpisah, TC1 umumnya berhubungan dengan kondisi atau ambang intervensi.",
    increase:
      "Setting yang lebih membatasi dapat membantu mengendalikan wheelspin, tetapi pemotongan terlalu sering dapat mengganggu akselerasi. Arti angka perlu diperiksa per model.",
    decrease:
      "Intervensi lebih longgar dapat membiarkan lebih banyak slip. Ini menuntut input gas lebih baik dan dapat meningkatkan panas atau ketidakstabilan belakang.",
    condition:
      "Perilaku ACC berbeda antar mobil. Angka yang sama bukan ambang slip yang sama; beberapa mobil juga memiliki pilihan off.",
    scenario:
      "Lampu TC berkedip dan mobil tersendat pada exit. Bandingkan input gas lebih halus, lalu uji setting kecil; jangan langsung menonaktifkan TC.",
    example:
      "Ilustrasi: roda setara 110 km/jam, kendaraan 100 km/jam.\nSlip sederhana = (110 − 100) ÷ 100 = 10%.\nIni bukan target slip ideal atau pemetaan TC ACC.",
    checklist: [
      "Gunakan gear dan exit yang sama.",
      "Catat intervensi, kestabilan dan akselerasi beberapa lap, bukan hanya jumlah kedipan.",
    ],
    technical:
      "Sistem nyata dapat memakai referensi roda, estimasi kecepatan, lateral acceleration, gear dan peta torsi. Definisi slip serta logika kontrol bergantung implementasi.",
    limitation:
      "Eksperimen menggunakan ambang ilustratif dalam persen, bukan nomor slider game.",
    sourceIds: ["bosch-tc", "kunos19"],
    relatedIds: ["tc2", "preload", "fase-tikungan"],
    visual: "electronics",
    experiment: "electronics",
  }),
  lesson({
    id: "tc2",
    moduleId: "electronics",
    title: "TC2: karakter pemotongan torsi",
    aliases: ["traction control 2", "torque cut", "kekuatan intervensi"],
    parameterKeys: ["tC2"],
    unit: "Setting per mobil",
    definition:
      "Pada mobil yang memisahkannya, TC2 mengatur karakter/kekuatan pengurangan torsi setelah intervensi. TC1 dan TC2 bukan dua persentase grip dan tidak selalu tersedia bersama.",
    increase:
      "Pemotongan lebih kuat dapat lebih tegas mengurangi wheelspin, tetapi membuat respons gas terputus atau agresif jika tidak sesuai kondisi.",
    decrease:
      "Pemotongan lebih ringan dapat terasa lebih halus, tetapi mungkin belum cukup mengendalikan slip. Tetap periksa karakter nomor setting pada mobil tersebut.",
    condition:
      "Hipotesis uji: ubah TC2 setelah memahami kapan TC1 berintervensi; jangan menganggap keduanya harus selalu sama.",
    scenario:
      "Intervensi dimulai pada waktu yang masuk akal, tetapi pemotongannya terasa kasar. Pertahankan TC1 dan bandingkan perubahan TC2 kecil.",
    example:
      "Ambang menentukan kapan tindakan dimulai.\nKekuatan cut menentukan seberapa banyak torsi dikurangi.\nEksperimen menunjukkan dua konsep ini secara terpisah.",
    checklist: [
      "Pertahankan TC1 saat mengevaluasi TC2.",
      "Amati wheelspin sisa, respons gas, dan kestabilan exit.",
    ],
    technical:
      "ECU dapat menggunakan ignition retard atau injection cut dan strategi lain. Kurva, filter dan ramp berbeda antar mobil.",
    limitation:
      "Tidak mengasumsikan angka tinggi berarti cut besar pada seluruh model atau menjamin setting optimal.",
    sourceIds: ["bosch-tc", "aris-ecu"],
    relatedIds: ["tc", "ecu-map"],
    visual: "electronics",
    experiment: "electronics",
  }),
  lesson({
    id: "abs",
    moduleId: "electronics",
    title: "ABS & roda terkunci",
    aliases: ["anti lock", "lockup", "rem", "pengereman"],
    parameterKeys: ["abs"],
    unit: "Setting per mobil",
    definition:
      "ABS memodulasi pengereman untuk membatasi lockup dan menjaga kemampuan roda memberi arah. Sistem membantu menggunakan grip yang tersedia; tidak menambah grip ketika rem dan steering melebihi kemampuan ban.",
    increase:
      "Intervensi lebih membatasi dapat memberi kontrol pada permukaan sulit, tetapi dapat mengganggu pengereman jika terlalu dini atau terlalu kuat.",
    decrease:
      "Intervensi lebih sedikit menuntut kontrol rem lebih baik dan dapat membiarkan roda terkunci. Arti nomor serta pilihan off bergantung mobil.",
    condition:
      "Hipotesis uji: setting dinilai melalui jarak dan konsistensi pengereman serta kontrol arah, bukan anggapan bahwa ABS rendah selalu lebih cepat.",
    scenario:
      "Saat hujan, mobil sulit diarahkan ketika mengerem. Periksa ban dan input terlebih dahulu, lalu bandingkan ABS dengan brake bias tetap.",
    example:
      "Roda menggelinding → masih dapat memberi gaya arah.\nLockup → slip pengereman berlebihan.\nABS → mengurangi/memulihkan perintah rem sesuai logikanya.",
    checklist: [
      "Gunakan titik dan kecepatan pengereman yang sebanding.",
      "Amati lockup, kemampuan membelok, dan pelepasan rem.",
    ],
    technical:
      "Efektivitas ABS dipengaruhi grip, beban, bias, pad dan temperatur. Setting tidak sama dengan persentase brake power.",
    limitation:
      "Diagram intervensi tidak memprediksi stopping distance atau frekuensi ABS ACC.",
    sourceIds: ["bosch-abs"],
    relatedIds: ["brake-bias", "brake-power", "pads"],
    visual: "electronics",
    experiment: "electronics",
  }),
  lesson({
    id: "ecu-map",
    moduleId: "electronics",
    title: "ECU / engine map",
    aliases: ["mesin", "engine", "throttle", "hemat", "map"],
    parameterKeys: ["eCUMap"],
    unit: "Pilihan map",
    definition:
      "ECU map memilih karakter operasi mesin. Bergantung mobil, yang berubah bisa respons throttle, tenaga, konsumsi atau gabungannya. Nomor map adalah pilihan pada model tertentu, bukan urutan performa universal.",
    increase:
      "Nomor lebih besar bisa memilih fungsi berbeda, bukan selalu tenaga lebih besar atau fuel lebih hemat. Baca dokumentasi model dan versi.",
    decrease:
      "Nomor lebih kecil juga bukan jaminan mode tercepat. Respons pedal yang berbeda dapat mengubah cara lo mengendalikan traction.",
    condition:
      "Tulisan pengembang menunjukkan variasi antar mobil. Daftar map mobil lama tidak boleh diterapkan otomatis pada mobil baru.",
    scenario:
      "Map baru terasa lebih lembut pada exit. Ukur konsumsi kembali dengan pace dan kondisi sebanding sebelum mengurangi fuel race.",
    example:
      "Bandingkan map A dan B pada stint pendek yang sama.\nCatat fuel terpakai ÷ lap dan respons throttle.\nJangan menyimpulkan fungsi dari nomor saja.",
    checklist: [
      "Pastikan arti map dari dokumentasi mobil.",
      "Ukur konsumsi aktual setelah perubahan; pisahkan dari perubahan TC.",
    ],
    technical:
      "Throttle mapping dan power/consumption mapping adalah konsep berbeda. Persentase pedal tidak harus menghasilkan persentase torsi yang sama.",
    limitation:
      "App tidak menyediakan daftar map terkini terverifikasi untuk seluruh mobil.",
    sourceIds: ["aris-ecu", "bosch-tc"],
    relatedIds: ["konsumsi", "tc2"],
    visual: "electronics",
  }),
  lesson({
    id: "telemetry",
    moduleId: "electronics",
    title: "Telemetry laps",
    aliases: ["telemetri", "rekaman", "MoTeC", "analisis"],
    parameterKeys: ["telemetryLaps"],
    unit: "Lap rekaman",
    definition:
      "Telemetry laps menentukan cakupan lap yang direkam untuk analisis di game. Rekaman dapat membantu melihat input dan gerak mobil, tetapi pengaturan ini sendiri tidak mengubah tenaga atau grip.",
    increase:
      "Lebih banyak lap memberi lebih banyak contoh untuk dibandingkan, termasuk transisi dan konsistensi. Rekaman yang buruk tetap perlu disaring.",
    decrease:
      "Cakupan lebih kecil membatasi contoh. Pilihan nol/off mengikuti mekanisme game; periksa apakah rekaman yang dibutuhkan tersedia.",
    condition:
      "Bedakan rekaman telemetry ACC dengan practice log manual pada web ini. App tidak mengambil file telemetry.",
    scenario:
      "Satu lap berisi spin. Pilih lap bersih lain pada kondisi sebanding daripada memakai seluruh rekaman sebagai bukti setup.",
    example:
      "Lap 1: pemanasan.\nLap 2–5: pengamatan.\nLap 6: insiden, tandai dan pisahkan.\nBandingkan bagian lintasan yang sama.",
    checklist: [
      "Tentukan apa yang ingin diukur sebelum merekam.",
      "Pilih lap bersih dan cocokkan kondisi serta fuel.",
    ],
    technical:
      "Analisis gerak suspensi memerlukan kanal dan satuan yang benar. Grafik tanpa konteks kecepatan dan lokasi dapat menyesatkan.",
    limitation:
      "Tidak ada telemetry langsung, impor file, atau analisis kanal otomatis pada fitur belajar.",
    sourceIds: ["aris-suspension", "penske"],
    relatedIds: ["uji-perubahan", "slow-bump"],
    visual: "telemetry",
  }),
  lesson({
    id: "fuel",
    moduleId: "fuel",
    title: "Fuel untuk lap, race & stint",
    aliases: [
      "bahan bakar",
      "bensin",
      "durasi",
      "cadangan",
      "formation",
      "tangki",
      "endurance",
    ],
    parameterKeys: ["fuel"],
    unit: "L",
    definition:
      "Fuel menentukan durasi berjalan dan massa yang dibawa. Fuel lebih banyak memengaruhi akselerasi, pengereman, ban dan posisi suspensi. Race dan qualifying perlu diuji dengan kebutuhan fuel masing-masing.",
    increase:
      "Cadangan mengurangi risiko kehabisan fuel, tetapi menambah massa. Pada endurance, hitung kebutuhan tiap stint dan batas tangki.",
    decrease:
      "Fuel lebih sedikit mengurangi massa tetapi mempersempit margin. Jangan menghilangkan kebutuhan outlap, formation atau kemungkinan lap tambahan.",
    condition:
      "Perhitungan memakai konsumsi aktual. Timed race dapat memiliki kebutuhan lap akhir menurut aturan sesi; hasil adalah rencana dengan cadangan, bukan jaminan finis.",
    scenario:
      "Race 30 menit, rata-rata 1:45, konsumsi 2,8 L/lap. Dengan satu lap cadangan dan formation 1 L, siapkan 55 L.",
    example:
      "Lap = ceil(1.800 ÷ 105) = 18.\nFuel = (18 + 1) × 2,8 + 1 = 54,2 L.\nDisiapkan = ceil(54,2) = 55 L.",
    checklist: [
      "Ukur konsumsi dengan map dan pace yang akan dipakai.",
      "Periksa kapasitas, formation/outlap dan aturan lap akhir.",
    ],
    technical:
      "Perhitungan app membulatkan lap durasi ke atas lalu menambahkan cadangan dan formation. Fuel aktual run disimpan terpisah dari rekomendasi.",
    limitation:
      "Tidak ada perhitungan konsumsi dari horsepower atau cuaca saja; kapasitas tidak diasumsikan sama untuk semua mobil.",
    sourceIds: ["aris-ecu"],
    relatedIds: ["konsumsi", "pit-strategy", "ride-height"],
    visual: "fuel",
    experiment: "fuel",
  }),
  lesson({
    id: "konsumsi",
    moduleId: "fuel",
    title: "Konsumsi aktual & fuel per lap tersimpan",
    aliases: ["L/lap", "liter per lap", "fuel per lap stored", "fuel economy"],
    parameterKeys: ["fuelPerLap"],
    unit: "L/lap",
    definition:
      "Konsumsi aktual adalah fuel yang terpakai dibagi lap yang dihitung. Field fuel per lap tersimpan pada sumber adalah catatan/estimasi arsip, bukan bukti bahwa konsumsi run lo identik.",
    increase:
      "Pace, map dan cara mengemudi dapat meningkatkan konsumsi. Uji beberapa lap representatif dan siapkan margin yang jelas.",
    decrease:
      "Lift/coast atau map berbeda dapat menurunkan konsumsi, dengan kompromi pace atau respons. Ukur kembali, jangan hanya mengurangi angka kalkulator.",
    condition:
      "Perilaku ACC per model: hitungan race harus memakai konsumsi pada map, kondisi dan cara mengemudi yang relevan.",
    scenario:
      "Fuel turun dari 40 ke 26 L dalam lima lap terukur. Konsumsi 2,8 L/lap, asalkan formation, idle, dan outlap sudah dipisahkan atau diperhitungkan.",
    example:
      "Konsumsi = (fuel awal − fuel akhir) ÷ lap.\n(40 − 26) ÷ 5 = 2,8 L/lap.\nCatat apa saja yang termasuk periode pengukuran.",
    checklist: [
      "Catat fuel awal/akhir dan jumlah lap yang benar.",
      "Ulangi saat map, pace atau kebutuhan stint berubah.",
    ],
    technical:
      "Ketelitian angka fuel dan periode sampling membatasi ketelitian hasil. Sampel beberapa lap membantu mengurangi pengaruh pembulatan display.",
    limitation:
      "Nilai arsip tidak diubah menjadi konsumsi aktual secara otomatis dan bukan slider universal setiap mobil.",
    sourceIds: ["aris-ecu"],
    relatedIds: ["fuel", "ecu-map"],
    visual: "fuel",
    experiment: "fuel",
  }),
  lesson({
    id: "tyre-set",
    moduleId: "fuel",
    title: "Tyre set & kondisi ban",
    aliases: ["set ban", "ban baru", "ban bekas", "wear", "keausan"],
    parameterKeys: ["tyreSet"],
    unit: "Nomor set",
    definition:
      "Tyre set memilih set ban yang digunakan. Compound menyatakan jenis; nomor set mengidentifikasi set. Dua set slick bisa berbeda kondisinya karena salah satunya sudah dipakai.",
    increase:
      "Nomor lebih besar memilih identitas set lain, bukan compound lebih keras atau grip lebih besar. Ketersediaan set mengikuti aturan sesi.",
    decrease:
      "Memilih kembali nomor lama dapat memakai set yang sudah digunakan sesuai pengelolaan game. Catat jumlah lap serta riwayatnya.",
    condition:
      "Hipotesis uji: bandingkan setup dengan kondisi ban yang sebanding; jangan mencampur efek setup dan usia ban.",
    scenario:
      "Run B lebih lambat, tetapi menggunakan set yang sudah menjalani stint. Belum ada bukti bahwa perubahan setup menyebabkan seluruh penurunan.",
    example:
      "Set 1: slick, sudah 12 lap.\nSet 2: slick, belum dipakai.\nCompound sama; kondisi berbeda.",
    checklist: [
      "Catat set baru/bekas dan lap pemakaian.",
      "Periksa aturan alokasi set pada sesi sebelum menyusun pit strategy.",
    ],
    technical:
      "Wear dan siklus penggunaan memengaruhi ban. Angka set tidak dapat dimasukkan ke rumus tekanan atau grip sebagai besaran fisik.",
    limitation: "Web tidak melacak inventaris tyre set game secara langsung.",
    sourceIds: ["kunos19"],
    relatedIds: ["compound", "pit-strategy", "uji-perubahan"],
    visual: "tyre-set",
  }),
  lesson({
    id: "pads",
    moduleId: "fuel",
    title: "Brake pads depan & belakang",
    aliases: [
      "kampas rem",
      "pad 1",
      "pad 2",
      "pad 3",
      "pad 4",
      "fade",
      "umur rem",
    ],
    parameterKeys: ["frontBrakePadCompound", "rearBrakePadCompound"],
    unit: "Pilihan pad",
    definition:
      "Compound kampas memengaruhi respons, modulasi, temperatur kerja dan umur. Depan dan belakang dicatat terpisah. Nomor pad adalah jenis, bukan persen brake power.",
    increase:
      "Memilih nomor lebih tinggi bukan otomatis memperkuat rem. Pad 3 ditujukan pada kebutuhan umur lebih panjang; pad 4 pada implementasi ACC lama adalah opsi keausan sangat cepat untuk demonstrasi.",
    decrease:
      "Pad 1 biasanya dikaitkan penggunaan lebih singkat, pad 2 penggunaan race lebih luas. Jangan menganggap pad 1 pasti memberi keuntungan besar pada semua patch.",
    condition:
      "Laporan pengujian v1.9 menemukan perbedaan performa pad 1/2 kecil. Umur aktual mengikuti temperatur, bias dan penggunaan; tidak diberikan jaminan jam pemakaian.",
    scenario:
      "Untuk stint panjang, evaluasi umur dan respons pad yang dipilih. Perubahan pad juga membutuhkan pemeriksaan temperatur dan cara mengerem.",
    example:
      "Bandingkan: respons → temperatur → wear → kebutuhan ganti.\nNomor 1–4 bukan skala linear gaya rem.",
    checklist: [
      "Periksa ketersediaan dan deskripsi pad pada mobil/versi game.",
      "Uji temperatur serta wear pada stint representatif, depan dan belakang.",
    ],
    technical:
      "Pad, disc, duct, bias dan ABS bekerja bersama. Perubahan karakter rem dapat memengaruhi kemampuan melakukan trail braking.",
    limitation:
      "Arsip pilihan pad bukan validasi umur untuk semua mobil; angka umur tidak dijadikan prediksi otomatis.",
    sourceIds: ["cda19", "kunos-pads"],
    relatedIds: ["ducts", "brake-bias", "abs"],
    visual: "pads",
  }),
  lesson({
    id: "pit-strategy",
    moduleId: "fuel",
    title: "Pit strategy & template tersimpan",
    aliases: [
      "pit stop",
      "fuel to add",
      "refuel",
      "pit window",
      "mandatory",
      "nPitStops",
      "template",
    ],
    parameterKeys: ["nPitStops", "pitStrategy"],
    unit: "Stop / template",
    definition:
      "Pit strategy merencanakan servis: fuel tambahan, set/compound dan cold ban pengganti, pad, serta perbaikan sesuai opsi game. Template tersimpan bukan bukti bahwa pit wajib atau jumlah stop race sudah benar.",
    increase:
      "Lebih banyak servis atau stop dapat menambah waktu, tetapi dibutuhkan oleh fuel, keausan atau aturan. Sebagian pekerjaan dapat berlangsung bersamaan.",
    decrease:
      "Mengurangi servis hanya masuk akal bila komponen dan fuel mencukupi serta aturan tetap terpenuhi. Periksa pit window dan kewajiban sesi.",
    condition:
      "Perilaku sesi: field jumlah stop aktif tersimpan dibedakan dari daftar slot template. Keduanya bukan rekomendasi strategi otomatis.",
    scenario:
      "Tersisa 8 L dan fuel to add 40 L. Hasil mendekati 48 L setelah penambahan, dengan konsumsi selama proses; bukan target akhir 40 L.",
    example:
      "Fuel akhir ≈ fuel tersisa + fuel ditambah − konsumsi selama proses.\nSlot template tersimpan ≠ stop wajib.\nWaktu pit meliputi perjalanan pit lane dan servis.",
    checklist: [
      "Periksa aturan sesi, pit window, batas tangki dan servis wajib.",
      "Cocokkan template yang aktif dengan rencana stint berikutnya.",
    ],
    technical:
      "Tidak selalu benar menjumlahkan durasi semua servis karena ada pekerjaan paralel. Race strategy memerlukan aturan sesi dan durasi servis aktual.",
    limitation:
      "App memperlihatkan template sumber; tidak menjalankan pit, membaca server, atau mengoptimalkan strategi race.",
    sourceIds: ["aris-ecu"],
    relatedIds: ["fuel", "tyre-set", "pads"],
    visual: "pit",
  }),
  lesson({
    id: "arb",
    moduleId: "mechanical",
    title: "Anti-roll bar depan & belakang",
    aliases: ["ARB", "sway bar", "stabilizer", "body roll", "rotasi"],
    parameterKeys: ["aRBFront", "aRBRear"],
    unit: "Setting",
    definition:
      "ARB menghubungkan respons suspensi kiri dan kanan serta memberi tahanan terhadap perbedaan geraknya. Pembagian kekakuan roll depan/belakang memengaruhi keseimbangan mobil.",
    increase:
      "Dengan yang lain tetap, front lebih keras cenderung menambah understeer; rear lebih keras cenderung membantu rotasi dengan risiko belakang lebih mudah lepas.",
    decrease:
      "Front lebih lunak dapat membantu grip/rotasi depan; rear lebih lunak dapat membantu kestabilan belakang. Ini arah awal pengujian, bukan hasil pasti.",
    condition:
      "Hipotesis uji: pertimbangkan geometri, aero, ban dan kerb. ARB tidak menghilangkan seluruh perpindahan beban.",
    scenario:
      "Understeer konsisten pada mid-corner lambat yang mulus. Setelah input dan tekanan diperiksa, bandingkan front ARB sedikit lebih lunak lalu amati kompromi di kerb.",
    example:
      "Front relatif lebih keras → kecenderungan understeer.\nRear relatif lebih keras → kecenderungan rotasi.\nUji satu axle dahulu agar penyebabnya terbaca.",
    checklist: [
      "Bandingkan tikungan mulus dan kerb satu sisi.",
      "Catat perubahan keseimbangan serta dukungan bodi.",
    ],
    technical:
      "Kekakuan roll relatif mengubah pembagian transfer lateral. Ban memiliki load sensitivity; mobil lebih datar tidak otomatis mempunyai total grip lebih besar.",
    limitation:
      "Nomor ARB bukan N/mm universal. Diagram tidak menghitung persen grip.",
    sourceIds: ["eibach"],
    relatedIds: ["wheel-rate", "gerak-bodi", "fase-tikungan"],
    visual: "arb",
  }),
  lesson({
    id: "wheel-rate",
    moduleId: "mechanical",
    title: "Wheel rate: kekakuan di roda",
    aliases: [
      "spring",
      "per",
      "molla",
      "suspensi lunak",
      "suspensi keras",
      "N/m",
    ],
    parameterKeys: wheelKeys("wheelRate"),
    unit: "N/m",
    definition:
      "Wheel rate adalah kekakuan efektif di roda. Per menyimpan energi ketika berubah panjang; kekakuan menentukan perubahan gaya terhadap kompresi. Bedakan wheel rate dari spring rate pada per itu sendiri.",
    increase:
      "Dukungan lebih keras dapat membatasi gerakan dan menjaga platform, tetapi mengurangi kemampuan mengikuti permukaan jika berlebihan.",
    decrease:
      "Lebih lunak memberi gerak lebih besar, dengan risiko travel habis, bumpstop terlalu terbebani, atau aero berubah selama braking dan cornering.",
    condition:
      "Hipotesis uji: pilih kompromi berdasarkan travel, lintasan dan kebutuhan aero, bukan prinsip bahwa lunak selalu lebih banyak grip.",
    scenario:
      "Mobil nyaman di bump kecil tetapi menyentuh dasar saat braking cepat. Periksa kombinasi ride height, wheel rate, bumpstop dan travel.",
    example:
      "100.000 N/m = 100 N/mm.\nF = k × x.\n100 N/mm × 10 mm = 1.000 N (model linear).",
    checklist: [
      "Periksa bottoming dan respons kerb dengan fuel yang relevan.",
      "Ubah kekakuan sedikit lalu cocokkan kembali damping bila dibutuhkan.",
    ],
    technical:
      "Jika r = gerakan per ÷ gerakan roda, model sederhana memberi k_roda = k_per × r². Wheel rate yang sudah tersedia tidak perlu dikalikan r² lagi.",
    limitation:
      "Contoh linear tidak memasukkan motion ratio berubah, ARB, bumpstop dan aero. Bukan konversi ke klik.",
    sourceIds: ["openstax", "aris-suspension"],
    relatedIds: ["bumpstop-range", "bumpstop-rate", "ride-height"],
    visual: "mechanical",
    experiment: "mechanical",
  }),
  lesson({
    id: "bumpstop-rate",
    moduleId: "mechanical",
    title: "Bumpstop rate: dukungan tambahan",
    aliases: ["bump rubber", "tampan", "kekakuan bumpstop", "bottoming"],
    parameterKeys: wheelKeys("bumpStopRateUp"),
    unit: "N pada data sumber",
    definition:
      "Bumpstop memberi dukungan tambahan ketika travel kompresi mencapai area kerjanya. Rate menggambarkan karakter kekakuannya, sedangkan range menentukan kapan mulai terlibat.",
    increase:
      "Dukungan lebih keras dapat membatasi penurunan platform, tetapi perubahan beban dapat lebih mendadak dan mengganggu compliance.",
    decrease:
      "Dukungan lebih lunak memberi lebih banyak kompresi setelah engagement, tetapi travel tetap terbatas dan chassis dapat menerima benturan bila habis.",
    condition:
      "Perilaku ACC: bumpstop bukan per linear dengan travel tak terbatas. Evaluasi bersama wheel rate, range, dan ride height.",
    scenario:
      "Mobil berubah mendadak saat kerb. Periksa apakah bumpstop sedang bekerja dan apakah dukungan/transisinya terlalu kuat, bukan hanya fast bump.",
    example:
      "Sebelum engagement: dukungan per utama.\nSesudah engagement: per + bumpstop.\nSetelah travel habis: model sederhana tidak lagi berlaku.",
    checklist: [
      "Amati kejadian bottoming dan transisi pada kerb yang sama.",
      "Pisahkan perubahan rate dari range saat pengujian.",
    ],
    technical:
      "Kurva bumpstop dapat progresif. Satuan N pada katalog tidak boleh diperlakukan sebagai N/mm. Eksperimen memakai kekakuan tambahan ilustratif, bukan angka slider.",
    limitation:
      "Tidak menghitung gaya bumpstop ACC dari satu angka katalog tanpa kurva sumber.",
    sourceIds: ["aris-suspension", "kunos19"],
    relatedIds: ["bumpstop-range", "wheel-rate"],
    visual: "mechanical",
    experiment: "mechanical",
  }),
  lesson({
    id: "bumpstop-range",
    moduleId: "mechanical",
    title: "Bumpstop range: kapan mulai bekerja",
    aliases: ["window", "travel", "jarak bumpstop", "suspension travel"],
    parameterKeys: wheelKeys("bumpStopWindow"),
    unit: "mm",
    definition:
      "Range memberi konteks ruang kompresi sebelum bumpstop bekerja. Range kecil umumnya membuatnya terlibat lebih awal; range besar memberikan lebih banyak gerak awal. Ini berbeda dari ride height.",
    increase:
      "Engagement lebih lambat dapat membantu roda bergerak, tetapi membiarkan platform turun lebih jauh sebelum mendapat dukungan tambahan.",
    decrease:
      "Engagement lebih awal dapat menjaga platform, tetapi terlalu dini membuat mobil lebih banyak bertumpu pada bumpstop dan respons terasa keras.",
    condition:
      "Hipotesis uji: perubahan range harus dinilai dengan travel aktual, rate dan wheel rate, bukan sebagai pengganti menaikkan ride height.",
    scenario:
      "Range ditambah untuk kerb tetapi mobil sekarang terlalu rendah di straight cepat. Periksa platform dinamis dan dukungan keseluruhan.",
    example:
      "Ilustrasi: kompresi 10 mm, engagement 15 mm → belum bekerja.\nEngagement diubah ke 8 mm → dukungan tambahan mulai terlibat.",
    checklist: [
      "Bandingkan kerb, pengereman dan tikungan cepat.",
      "Pastikan suspensi tidak kehabisan travel pada fuel race.",
    ],
    technical:
      "Jarak engagement dan kompresi maksimum bumpstop adalah dua hal berbeda. Model v1.9 mempunyai batas kompresi; jangan mengasumsikan travel tak terbatas.",
    limitation:
      "Visual menggunakan titik awal sederhana; geometri dan kondisi statis setiap mobil dapat berbeda.",
    sourceIds: ["kunos19", "aris-suspension"],
    relatedIds: ["bumpstop-rate", "ride-height"],
    visual: "mechanical",
    experiment: "mechanical",
  }),
  lesson({
    id: "brake-power",
    moduleId: "mechanical",
    title: "Brake power: batas perintah rem",
    aliases: ["brake torque", "daya rem", "kekuatan rem"],
    parameterKeys: ["brakeTorque"],
    unit: "%",
    definition:
      "Brake power mengatur batas perintah pengereman yang tersedia. Brake bias mengatur pembagiannya, sementara grip ban, ABS, pad dan temperatur menentukan respons yang benar-benar terjadi.",
    increase:
      "Memberi perintah maksimum lebih besar, tetapi dapat meningkatkan tuntutan terhadap ban dan ABS. Tidak otomatis memperpendek jarak bila grip sudah terlampaui.",
    decrease:
      "Dapat membuat input penuh lebih mudah dikendalikan, dengan pengurangan kemampuan pengereman maksimum. Periksa kalibrasi pedal sebelum menurunkannya untuk menutupi input buruk.",
    condition:
      "Hipotesis uji: evaluasi kontrol pedal dan grip pada kondisi sebanding. Persen power bukan persen jarak pengereman.",
    scenario:
      "Lo sering full brake dan mobil gelisah. Periksa bias, ABS dan ban serta pelepasan rem; penurunan power hanya salah satu hipotesis.",
    example:
      "Pedal → batas power → pembagian bias → ABS/rem → ban.\nMengubah batas power tidak langsung mengubah grip.",
    checklist: [
      "Pastikan pedal membaca rentang input dengan benar.",
      "Bandingkan pengereman keras dan modulasi menuju apex.",
    ],
    technical:
      "Gaya pengereman kontak tidak hanya berasal dari satu slider; radius ban, torque, load dan intervensi ikut menentukan.",
    limitation:
      "Tidak menyediakan konversi persen brake power menjadi Newton atau stopping distance.",
    sourceIds: ["bosch-abs"],
    relatedIds: ["brake-bias", "abs", "pads"],
    visual: "brake",
  }),
  lesson({
    id: "brake-bias",
    moduleId: "mechanical",
    title: "Brake bias: depan vs belakang",
    aliases: ["BB", "brake balance", "bias rem", "trail braking"],
    parameterKeys: ["brakeBias"],
    unit: "% depan",
    definition:
      "Bias menyatakan pengaturan pembagian pengereman depan/belakang. Lebih ke depan dapat memberi kestabilan tetapi membebani depan; lebih ke belakang dapat membantu rotasi dengan risiko belakang tidak stabil.",
    increase:
      "Persentase depan lebih besar mengutamakan depan. Bisa membantu kestabilan, tetapi terlalu besar dapat menghabiskan kemampuan ban depan saat entry.",
    decrease:
      "Persentase depan lebih kecil mengutamakan belakang relatif lebih banyak. Dapat membantu rotasi, tetapi berlebihan memicu lockup atau ketidakstabilan belakang.",
    condition:
      "Hipotesis uji: kebutuhan mengikuti load transfer, grip, engine braking, aero dan ABS. Jangan menerapkan satu persen pada semua mobil.",
    scenario:
      "Belakang goyah saat braking setelah bias dimundurkan. Kembali sedikit ke depan lalu bandingkan dengan input dan ABS tetap.",
    example:
      "Pembagian konseptual: depan 60%, belakang 40%.\n60 → 58%: lebih ke belakang.\nIni bukan jaminan pembagian gaya kontak yang persis sama.",
    checklist: [
      "Uji perubahan kecil pada pengereman yang sama.",
      "Periksa kestabilan lurus dan rotasi saat melepas rem.",
    ],
    technical:
      "Tambahan beban depan saat pengereman memengaruhi kemampuan tiap axle. Engine braking dan ABS membuat gaya aktual lebih kompleks daripada pembagian ideal.",
    limitation: "Tidak menyarankan bias optimal otomatis dari satu gejala.",
    sourceIds: ["bosch-abs", "cda19"],
    relatedIds: ["abs", "gerak-bodi"],
    visual: "brake",
  }),
  lesson({
    id: "steering-ratio",
    moduleId: "mechanical",
    title: "Steering ratio: cepatnya kemudi",
    aliases: ["rasio setir", "steer ratio", "steering lock"],
    parameterKeys: ["steerRatio"],
    unit: "Rasio",
    definition:
      "Steering ratio menghubungkan sudut setir dengan sudut roda. Rasio lebih kecil membutuhkan lebih sedikit putaran setir untuk sudut roda yang sama; lebih besar memberi respons lebih lambat.",
    increase:
      "Memerlukan putaran setir lebih banyak dan dapat mempermudah koreksi halus. Bisa terasa terlalu lambat untuk arah bergantian.",
    decrease:
      "Membuat kemudi lebih cepat, dengan risiko input berlebihan jika kontrol belum halus. Tidak menambah grip ban.",
    condition:
      "Prinsip geometri: bedakan steering ratio dari rentang rotasi wheel perangkat dan dari steering lock maksimum mobil.",
    scenario:
      "Lo sering memberi sudut terlalu besar pada entry. Rasio yang sesuai dapat membantu kontrol, tetapi tetap periksa kecepatan masuk dan teknik steering.",
    example:
      "Rasio = sudut setir ÷ sudut roda.\n140° ÷ 14 = sekitar 10° sudut roda.",
    checklist: [
      "Pertahankan konfigurasi wheel saat membandingkan.",
      "Amati koreksi kecil, hairpin dan pergantian arah.",
    ],
    technical:
      "Contoh memakai rasio ideal konstan. Steering linkage dan Ackermann membuat hubungan aktual roda kiri/kanan lebih kompleks.",
    limitation:
      "Rumus bukan prediksi radius tikungan atau rekomendasi rotasi perangkat.",
    sourceIds: ["geometry"],
    relatedIds: ["caster", "grip"],
    visual: "steering",
  }),
  lesson({
    id: "preload",
    moduleId: "mechanical",
    title: "Differential preload",
    aliases: ["diff", "LSD", "lock", "diferensial", "Nm"],
    parameterKeys: ["preload"],
    unit: "Nm",
    definition:
      "Preload memberi tahanan awal terhadap perbedaan putaran roda penggerak. Roda kiri/kanan perlu berputar berbeda ketika lintasannya berbeda di tikungan.",
    increase:
      "Roda cenderung lebih terikat, terutama pada transisi torsi rendah. Dapat memberi kestabilan tetapi mengurangi kebebasan rotasi; respons power mengikuti desain diferensial.",
    decrease:
      "Perbedaan putaran lebih mudah terjadi. Mobil dapat terasa lebih bebas, tetapi kestabilan atau wheelspin roda dalam perlu diperiksa.",
    condition:
      "Hipotesis uji: efek entry, coast dan power berbeda. Jangan menyimpulkan semua diferensial lebih preload berarti lebih banyak traction.",
    scenario:
      "Mobil sulit berputar saat coast di tikungan lambat. Uji preload sedikit lebih rendah, lalu periksa apakah exit dan braking tetap terkendali.",
    example:
      "Preload 70 Nm adalah besaran torsi tahanan awal.\nBukan 70% lock dan bukan 70 N gaya ban.",
    checklist: [
      "Pisahkan pengamatan entry/coast/exit.",
      "Perhatikan roda dalam, TC dan kestabilan setelah perubahan kecil.",
    ],
    technical:
      "Ramp, clutch, torque dan geometri diferensial memengaruhi lock dinamis. Preload sendiri tidak menjelaskan seluruh perilaku.",
    limitation:
      "Tidak memodelkan peta diferensial atau menghitung preload ideal otomatis.",
    sourceIds: ["aris-suspension"],
    relatedIds: ["tc", "fase-tikungan"],
    visual: "differential",
  }),
  ...(
    [
      [
        "slow-bump",
        "Slow bump: kompresi bertahap",
        "bumpSlow",
        "Pitch depan saat braking dan squat belakang saat akselerasi.",
        "Dukungan transisi meningkat, tetapi berlebihan dapat mengurangi compliance.",
        "Gerak kompresi lebih bebas, tetapi platform dapat turun terlalu cepat.",
        "Saat pengereman, depan kompresi sementara belakang memanjang.",
      ],
      [
        "fast-bump",
        "Fast bump: respons terhadap benturan",
        "bumpFast",
        "Kompresi cepat saat roda naik bump atau kerb.",
        "Benturan lebih ditahan, tetapi gaya dapat lebih banyak diteruskan ke bodi.",
        "Roda lebih mudah naik mengikuti permukaan, tetapi periksa travel dan bottoming.",
        "Di kerb tajam, roda bisa bergerak cepat walaupun kecepatan mobil rendah.",
      ],
      [
        "slow-rebound",
        "Slow rebound: pemanjangan bertahap",
        "reboundSlow",
        "Pemulihan pitch/roll dan pemanjangan belakang saat braking.",
        "Pemanjangan lebih ditahan; berlebihan dapat membuat pemulihan terlalu lambat.",
        "Pemanjangan lebih bebas; terlalu sedikit redaman dapat meningkatkan osilasi.",
        "Pada exit, depan cenderung memanjang sementara belakang kompresi.",
      ],
      [
        "fast-rebound",
        "Fast rebound: roda kembali mengikuti jalan",
        "reboundFast",
        "Pemanjangan cepat setelah kerb atau saat roda menuju cekungan.",
        "Roda lebih ditahan saat turun, dengan risiko tidak cepat mengikuti permukaan.",
        "Roda lebih mudah memanjang; terlalu sedikit dapat membuat gerak kurang terkendali.",
        "Pada rangkaian bump, rebound terlalu kuat dapat menyisakan travel makin sedikit.",
      ],
    ] as const
  ).map(([id, title, prefix, role, increase, decrease, scenario]) =>
    lesson({
      id,
      moduleId: "dampers",
      title,
      aliases: [
        prefix,
        "shock",
        "damper",
        "redaman",
        id.includes("bump") ? "kompresi" : "pemanjangan",
      ],
      parameterKeys: wheelKeys(prefix),
      unit: "Setting / klik",
      definition:
        role +
        " Bump berarti suspensi memendek; rebound berarti memanjang. Slow/fast menyatakan kecepatan gerak damper, bukan kecepatan kendaraan.",
      increase,
      decrease,
      condition:
        "Hipotesis uji: evaluasi damping setelah wheel rate, bumpstop dan ride height masuk akal. Klik game mengikuti kurva mobil, bukan koefisien universal.",
      scenario,
      example:
        "Model linear: |F| = c × |v|.\n4.000 N·s/m × 0,1 m/s = 400 N.\nGaya melawan gerak; bump dan rebound dapat punya kurva berbeda.",
      checklist: [
        id.includes("fast")
          ? "Uji kerb/bump yang sama tanpa mengubah garis secara besar."
          : "Bandingkan transisi rem/gas pada tikungan yang sama.",
        "Amati osilasi, pemulihan dan sisa travel; pisahkan perubahan bump dari rebound.",
      ],
      technical:
        "Per menahan berdasarkan jarak; damper berdasarkan kecepatan gerak. Kurva dapat linear, digressive atau bentuk lain. Slow/fast adalah area kurva, bukan mode terpisah berdasarkan km/jam.",
      limitation:
        "Eksperimen menggunakan c ilustratif. Nomor klik tidak dikonversi ke N·s/m dan tidak menentukan waktu lap.",
      sourceIds: ["penske-speed", "penske", "aris-suspension"],
      relatedIds: ["wheel-rate", "bumpstop-range"],
      visual: "damper",
      experiment: "damper",
    }),
  ),
  lesson({
    id: "ride-height",
    moduleId: "aero",
    title: "Ride height, rake & platform dinamis",
    aliases: [
      "tinggi mobil",
      "rake",
      "diffuser",
      "ground clearance",
      "bottoming",
    ],
    parameterKeys: ["heightFront", "heightRear"],
    unit: "mm",
    definition:
      "Ride height mengatur tinggi depan/belakang. Kombinasinya memengaruhi aliran bawah mobil, keseimbangan aero dan ruang gerak. Yang bekerja di lintasan adalah tinggi dinamis setelah fuel, pitch, roll dan beban aero berubah.",
    increase:
      "Tinggi lebih besar memberi ruang dari permukaan, tetapi mengubah aero dan pusat massa. Menambah belakang relatif terhadap depan menambah selisih rake; efek aero mengikuti mobil.",
    decrease:
      "Mobil lebih rendah bisa mengubah efisiensi aero, tetapi terlalu rendah dapat bottoming atau mengganggu aliran. Tidak selalu lebih cepat.",
    condition:
      "Hipotesis uji: evaluasi tinggi bersama per, bumpstop, wing dan fuel. Aero depan/belakang saling memengaruhi.",
    scenario:
      "Mobil baik pada fuel qualifying tetapi menyentuh lintasan saat fuel race. Uji ulang platform pada massa yang benar-benar akan dipakai.",
    example:
      "Selisih rake = tinggi belakang − tinggi depan.\n70 − 55 = 15 mm.\n15 mm adalah selisih tinggi, bukan sudut 15°.",
    checklist: [
      "Uji braking, straight cepat dan kerb dengan fuel sesi.",
      "Amati perubahan keseimbangan saat pitch, bukan hanya angka statis.",
    ],
    technical:
      "Rake geometris sebagai sudut memerlukan jarak dan titik referensi yang tepat. Selisih dua display tinggi saja tidak memberi seluruh peta aero.",
    limitation:
      "Diagram memperbesar perubahan tinggi untuk keterbacaan; tidak menghitung downforce dari mm.",
    sourceIds: ["aris-suspension", "nasa-lift"],
    relatedIds: ["wheel-rate", "wing", "aero-balance"],
    visual: "aero",
    experiment: "aero",
  }),
  lesson({
    id: "wing",
    moduleId: "aero",
    title: "Rear wing: downforce vs drag",
    aliases: ["sayap", "downforce", "drag", "top speed"],
    parameterKeys: ["rearWing"],
    unit: "Setting / sudut menurut mobil",
    definition:
      "Wing mengubah gaya aero dan hambatan. Lebih banyak dukungan belakang dapat membantu kestabilan pada kecepatan tinggi, dengan kompromi drag. Nilai slider bukan koefisien aero langsung.",
    increase:
      "Umumnya menambah downforce belakang sekaligus drag. Keseimbangan dapat bergeser ke belakang dan mobil cenderung lebih stabil atau understeer.",
    decrease:
      "Umumnya mengurangi drag dan dukungan belakang. Straight dapat membaik tetapi tikungan cepat atau braking dapat lebih sulit dikendalikan.",
    condition:
      "Hipotesis uji: bandingkan satu lap dan konsistensi stint, bukan top speed saja; interaksi dengan ride height dan aero depan tetap penting.",
    scenario:
      "Wing dikurangi dan straight lebih cepat, tetapi tikungan cepat kini butuh banyak koreksi. Catat waktu yang hilang dan kestabilan sebelum mempertahankan perubahan.",
    example:
      "F_aero ∝ v² jika koefisien tetap.\n100 → 200 km/jam: gaya acuan ×4.\nTotal grip tidak otomatis ×4.",
    checklist: [
      "Bandingkan straight dan tikungan cepat dalam satu run.",
      "Periksa keseimbangan saat braking dan pada fuel race.",
    ],
    technical:
      "F = ½ρv²A|CL|; drag memakai CD. v dalam m/s. Koefisien mengikuti bentuk, sudut, ride height dan kondisi aliran.",
    limitation:
      "Eksperimen memakai gaya acuan ilustratif; tidak memetakan klik wing ke CL/CD.",
    sourceIds: ["nasa-lift", "nasa-drag", "aris-suspension"],
    relatedIds: ["ride-height", "splitter", "aero-balance"],
    visual: "aero",
    experiment: "aero",
  }),
  lesson({
    id: "splitter",
    moduleId: "aero",
    title: "Splitter & aero depan",
    aliases: ["front wing", "sayap depan", "front downforce"],
    parameterKeys: ["splitter"],
    unit: "Setting bila tersedia",
    definition:
      "Splitter adalah bagian paket aero depan yang memengaruhi aliran dan gaya. Pada sebagian model ACC pengaturannya tetap atau tidak tersedia; status tidak berlaku harus dipertahankan.",
    increase:
      "Jika pengaturan memungkinkan lebih banyak dukungan depan, balance dapat bergeser ke depan. Efek pada aliran belakang tetap perlu diuji.",
    decrease:
      "Dukungan depan yang berkurang dapat mengubah kestabilan/rotasi, tetapi dampak persis mengikuti bentuk dan peta aero mobil.",
    condition:
      "Hipotesis uji: jangan menganggap spoiler depan/belakang bekerja terpisah atau tersedia sebagai slider di seluruh mobil.",
    scenario:
      "Depan lebih responsif di tikungan cepat setelah perubahan paket aero. Periksa apakah belakang tetap stabil, terutama saat pitch.",
    example:
      "Periksa dahulu: tersedia → dapat diuji.\nTidak berlaku → tidak dipaksakan.\nBelum terverifikasi → jangan menebak satuan/konversi.",
    checklist: [
      "Cocokkan ketersediaan parameter dengan model game.",
      "Uji keseimbangan cepat serta ride height dinamis.",
    ],
    technical:
      "Perubahan bagian depan dapat mengubah aliran underbody dan bagian belakang. Dibutuhkan peta aero untuk perhitungan lengkap.",
    limitation:
      "Tidak memberikan rekomendasi sudut splitter ketika data atau slider tidak tersedia.",
    sourceIds: ["nasa-lift", "aris-suspension"],
    relatedIds: ["wing", "aero-balance"],
    visual: "aero",
  }),
  lesson({
    id: "ducts",
    moduleId: "aero",
    title: "Brake ducts: pendinginan & panas ban",
    aliases: [
      "pendinginan rem",
      "brake duct",
      "suhu rem",
      "fade",
      "duct front",
      "duct rear",
    ],
    parameterKeys: ["ductfront", "ductrear"],
    unit: "Setting bukaan",
    definition:
      "Duct mengatur aliran pendinginan rem depan/belakang. Rem memerlukan kondisi kerja yang sesuai; panas dari sistem rem dan roda juga dapat memengaruhi kondisi ban.",
    increase:
      "Bukaan lebih besar umumnya meningkatkan pendinginan. Terlalu besar pada kondisi tertentu dapat membuat temperatur kerja rendah dan mengubah kebutuhan tekanan.",
    decrease:
      "Bukaan lebih kecil mempertahankan panas. Berlebihan dapat menyebabkan overheating, wear dan perubahan respons rem.",
    condition:
      "Hipotesis uji: pilih berdasarkan temperatur dan stint. Jangan menerapkan satu bukaan pada semua mobil/cuaca.",
    scenario:
      "Duct dibuka untuk menurunkan temperatur rem, lalu hot pressure berubah. Ukur kembali ban setelah perubahan; jangan memakai koreksi run lama tanpa evaluasi.",
    example:
      "Duct → pendinginan rem → kondisi panas roda/ban.\nPantau rem dan ban sebagai dua pengamatan terkait.\nNomor duct bukan °C atau debit udara.",
    checklist: [
      "Amati temperatur pada straight, pengereman dan sepanjang stint.",
      "Periksa ulang pad/wear dan tekanan hot setelah mengubah duct.",
    ],
    technical:
      "Pendinginan mengikuti aliran, geometri dan temperatur. Tidak tersedia model perpindahan panas lengkap untuk mengonversi satu klik ke °C.",
    limitation:
      "Diagram aliran bersifat konseptual; tidak memprediksi temperatur ban/rem.",
    sourceIds: ["cda19"],
    relatedIds: ["pads", "temperatur-ban", "tekanan"],
    visual: "ducts",
  }),
  lesson({
    id: "aero-balance",
    moduleId: "aero",
    title: "Front aero variation",
    aliases: [
      "aero balance",
      "aerodynamic balance",
      "persen aero",
      "variasi aero depan",
    ],
    parameterKeys: ["aeroBalance"],
    unit: "%",
    definition:
      "Indikator front aero variation membantu membaca perubahan keseimbangan terhadap acuan game. Angka perubahan tidak boleh dibaca sebagai persentase absolut seluruh downforce yang berada di depan.",
    increase:
      "Perubahan menuju dukungan relatif depan dapat membantu rotasi cepat tetapi mengurangi margin kestabilan belakang. Arti acuan dan respons perlu diperiksa per mobil.",
    decrease:
      "Perubahan menuju dukungan relatif belakang dapat menambah kestabilan tetapi menimbulkan understeer. Tetap nilai keseluruhan paket aero.",
    condition:
      "Hipotesis uji: bandingkan mobil yang sama. Nilai 0 tidak berarti nol downforce dan angka lintas model belum tentu sebanding.",
    scenario:
      "Setelah tinggi belakang diubah, indikator berubah. Gunakan itu sebagai petunjuk untuk menguji keseimbangan cepat, bukan bukti bahwa grip depan meningkat sekian persen.",
    example:
      "“+3% variation” ≠ “3% dari seluruh downforce di depan”.\nCatat perubahan setup dan indikator, lalu uji perilaku.",
    checklist: [
      "Catat indikator sebelum/sesudah pada model yang sama.",
      "Amati tikungan cepat, pitch saat braking, dan perubahan fuel.",
    ],
    technical:
      "Distribusi aero dinamis dipengaruhi ride height, yaw, pitch dan paket aero. Indikator statis tidak memuat seluruh kurva tersebut.",
    limitation:
      "Tidak mengonversi variation menjadi Newton atau peningkatan grip/waktu lap.",
    sourceIds: ["aris-suspension", "nasa-lift"],
    relatedIds: ["ride-height", "wing"],
    visual: "aero",
  }),
];

export function topicById(
  id: string | null | undefined,
): LearningTopic | undefined {
  return learningTopics.find((t) => t.id === id);
}
export function topicForParameter(key: string): LearningTopic | undefined {
  return learningTopics.find((t) => t.parameterKeys.includes(key));
}
const parameterSearchLabels: Record<string, string> = {
  compound: "Tyre compound",
  casterLF: "Caster FL",
  casterRF: "Caster FR",
  tC1: "TC",
  tC2: "TC2",
  abs: "ABS",
  eCUMap: "ECU / engine map",
  telemetryLaps: "Telemetry laps",
  fuel: "Fuel",
  tyreSet: "Tyre set",
  frontBrakePadCompound: "Brake pads front",
  rearBrakePadCompound: "Brake pads rear",
  nPitStops: "Pit stops aktif tersimpan",
  fuelPerLap: "Fuel per lap stored",
  pitStrategy: "Pit strategy templates",
  aRBFront: "Anti-roll bar front",
  aRBRear: "Anti-roll bar rear",
  brakeTorque: "Brake power",
  brakeBias: "Brake bias front",
  steerRatio: "Steering ratio",
  preload: "Differential preload",
  heightFront: "Ride height front",
  heightRear: "Ride height rear",
  rearWing: "Rear wing",
  splitter: "Splitter",
  ductfront: "Brake duct front",
  ductrear: "Brake duct rear",
  aeroBalance: "Front aero variation",
};
for (const [prefix, label] of [
  ["pressure", "Tyre pressure"],
  ["camber", "Camber"],
  ["toe", "Toe"],
  ["wheelRate", "Wheel rate"],
  ["bumpStopRateUp", "Bumpstop rate"],
  ["bumpStopWindow", "Bumpstop range"],
  ["bumpSlow", "Bump"],
  ["bumpFast", "Fast bump"],
  ["reboundSlow", "Rebound"],
  ["reboundFast", "Fast rebound"],
])
  for (const wheel of ["FL", "FR", "RL", "RR"])
    parameterSearchLabels[prefix + wheel] = label + " " + wheel;
export function searchLearning(query: string): LearningTopic[] {
  const words = query
    .trim()
    .toLocaleLowerCase("id-ID")
    .split(/\s+/)
    .filter(Boolean);
  return learningTopics.filter((t) => {
    const haystack = [
      t.title,
      ...t.aliases,
      ...t.parameterKeys,
      ...t.parameterKeys.map((k) => parameterSearchLabels[k] ?? k),
      t.definition,
      t.unit,
    ]
      .join(" ")
      .toLocaleLowerCase("id-ID");
    return words.every((word) => haystack.includes(word));
  });
}
export function readLearningHash(hash: string): {
  active: boolean;
  topicId: string | null;
} {
  const active = hash === "#belajar" || hash.startsWith("#belajar/");
  if (!active) return { active: false, topicId: null };
  try {
    const id = decodeURIComponent(hash.slice("#belajar/".length));
    return { active: true, topicId: topicById(id)?.id ?? null };
  } catch {
    return { active: true, topicId: null };
  }
}
