# ACC Setup — Garasi pribadi

Web lokal berbahasa Indonesia dengan alur kondisi sesi → acuan setup → panduan latihan → koreksi ban/fuel → evaluasi run berikutnya. Bisa dipakai dengan setup bawaan/milik sendiri ketika katalog kosong. **Belajar Setup** menyediakan fondasi dan enam menu ACC dalam 38 topik dengan screenshot asli game, diagram, tujuh eksperimen, dan checklist. Seluruh 68 parameter sumber terhubung ke pelajaran. React + TypeScript + Vite; tanpa backend, akun, atau API wajib.

## Jalankan dari Visual Studio Code

1. Buka folder `acc-setup-web` melalui **File → Open Folder** di VS Code.
2. Buka **Terminal → New Terminal**, lalu jalankan:

```sh
npm ci
npm run dev
```

3. Buka **http://127.0.0.1:5173** di browser. Dependency sudah dipasang pada workspace ini; `npm ci` berguna saat memindahkan project atau memasang ulang dari lockfile.

Gunakan Node **24 atau lebih baru**. Implementasi diuji dengan Node 24.14.0 dan npm 11.9.0. VS Code juga menyediakan task **ACC: jalankan web** dari **Terminal → Run Task**. Hentikan server dengan **Ctrl+C**. Mengedit `src/` memperbarui tampilan lewat Vite.

Development dan preview memakai host serta port tetap. Jika 5173 sudah terpakai, hentikan server sebelumnya; Vite akan gagal jelas dan tidak pindah port. Gunakan alamat yang sama setiap kali agar localStorage konsisten. `localhost:5173`, browser/profil lain, atau port lain mempunyai penyimpanan berbeda. Membuka `index.html` langsung lewat `file://` tidak didukung.

## Build dan pemeriksaan

```sh
npm run prepare:data  # bangun katalog + file per mobil dari snapshot lokal
npm run typecheck     # pemeriksaan TypeScript
npm test              # Vitest: rekomendasi, kalkulator, backup, data, materi belajar
npm run build         # persiapan data, typecheck, build statis ke dist/
npm run preview       # tampilkan build pada http://127.0.0.1:5173
```

Tes browser memakai Chromium dari Playwright:

```sh
npx playwright install chromium   # hanya diperlukan sekali
npm run test:e2e                   # otomatis membuka preview pada port 4173
npm run check                     # typecheck + unit + build + browser
```

Playwright menjalankan viewport desktop dan mobile dengan Chromium. Ini menguji layout mobile, bukan Safari iOS atau perangkat fisik. Screenshot QA ada di `tests/screenshots/`; trace kegagalan ada di `test-results/`. Tidak ada pengujian berkendara dalam ACC.

## Pemakaian

- **Belajar Setup:** mulai dari fondasi atau pilih Tyres & alignment, Electronics, Fuel & strategy, Mechanical grip, Dampers, atau Aero. Cari istilah Indonesia maupun label ACC, misalnya “sudut roda”, “camber FL”, atau “brake bias”. Desktop menampilkan daftar topik di samping; mobile memakai pemilih kategori dan daftar yang dapat dibuka. Tiap pelajaran berisi definisi, dampak/kompromi, diagram dan skenario, contoh, checklist uji, serta detail teknis/sumber. Tombol sebelumnya/berikutnya dan alamat `#belajar/camber` mendukung navigasi langsung/reload; ID tidak dikenal membuka indeks.
- **Eksperimen belajar:** tekanan empat roda memakai profil dan aturan kelayakan yang sama dengan latihan; alignment memperlihatkan geometri; elektronik mengilustrasikan slip/intervensi; fuel memakai kalkulator app; per/bumpstop, damper, dan aero menggunakan model fisika sederhana dengan satuan. Semua memiliki reset dan state terpisah dari draft latihan. Checklist bersifat sementara; tidak menyimpan progres atau membuat practice log.
- **Bantuan Pelajari:** tersedia pada tiap parameter detail sumber, kamus, serta fuel/tekanan di latihan. Dialog mempertahankan pilihan, sumber aktif dan draft. Jika dibuka dari detail sumber, pelajaran menggantikan isi dialog dengan tombol kembali ke detail; hanya satu modal aktif. Escape menutup bantuan dan mengembalikan fokus.
- **Cari Setup:** pilih kelas → mobil/varian → sirkuit → kondisi/sesi/karakter. Isi versi game (default acuan katalog 1.10.4), BoP standar/custom/tidak diketahui, suhu udara/lintasan, grip dan observasi racing line. Dry mengunci slick; light/heavy wet mengunci wet. Damp/drying menampilkan dua opsi sampai racing line diketahui.
- **Hasil:** mobil/varian, sirkuit, dan compound menjadi batas pencocokan. Kandidat diurutkan menurut kompatibilitas yang diketahui, metadata sesi, kedekatan suhu, kelengkapan lalu ID. **Metadata cocok** terpisah dari keyakinan hitungan rekomendasi. Sumber belum terverifikasi selalu dipilih secara eksplisit lewat **Pakai sebagai acuan**; metadata kosong tetap kekurangan bukti.
- **Setup bawaan/milik sendiri:** selalu tersedia, termasuk tanpa hasil katalog atau saat file mobil gagal dimuat. Isi cold empat roda dan fuel yang benar-benar dipakai. Kartu rekomendasi berisi acuan, compound, target, fuel, kekurangan bukti dan langkah uji. Detail setting sumber bisa dibuka terpisah.
- **Hasil Latihan:** catat lap pengukuran, tekanan stabil, insiden yang memengaruhi ban, kondisi pengukuran dan kondisi berikutnya. Angka koreksi tersedia setelah lap valid, tekanan stabil, bebas insiden dan kondisi sebanding dikonfirmasi. Perubahan versi/permukaan/BoP meminta pengukuran ulang. Perbedaan suhu/grip ditampilkan untuk ditinjau pengguna.
- **Target tekanan:** rentang mempertahankan cold ketika hot sudah di dalamnya; di luar rentang, koreksi menuju batas terdekat memakai `cold + target − hot`, dibulatkan 0,1 psi. Titik manual tetap tersedia dengan sumber/alasan, dibatasi rentang profil aktif jika ada. Cold katalog hanya acuan dengan konteks suhu sumber; tidak ada koefisien suhu universal.
- **Fuel:** konsumsi aktual × (lap estimasi + cadangan) + formation fuel; mode durasi membulatkan lap ke atas. Endurance dihitung per stint. Fuel aktual dan fuel yang direkomendasikan disimpan terpisah.
- **Favorit:** menyimpan ID sumber dan kombinasi pencarian. Membuka favorit menampilkan detail sumber; **Cari kombinasi ini** mengisi form dan tetap meminta pencarian.
- **Riwayat Latihan:** menyimpan input aktual, sumber dan rekomendasi sebagai snapshot, konteks, hasil, catatan dan waktu. **Mulai run berikutnya** membawa cold hasil/aktual dan fuel, lalu mengosongkan hot dan konfirmasi kualitas. Perbandingan memerlukan mobil, lintasan, compound, versi dan target yang sama; perubahan kondisi tetap terlihat. Keberhasilan dinilai dari berkurangnya deviasi tekanan, tanpa klaim waktu lap.
- **Backup:** ekspor schema v2; impor v1/v2 memvalidasi dan menggabungkan ID tanpa menimpa catatan lama. Batas 8 MB/file dan 2.000 latihan. Snapshot v2 dipertahankan dan angka divalidasi terhadap input serta kualitas; tidak dibuat ulang dari katalog yang berubah.
- **Data & Panduan:** penelusuran sumber termasuk Baseline dan Arsip LFM, cakupan semua 25 sirkuit per mobil, katalog lengkap dan kamus parameter.

Perubahan pilihan menghapus hasil lama; perubahan sumber aktif mengosongkan draft latihan. Riwayat yang sudah disimpan tetap ada. Draft belum disimpan tidak bertahan setelah reload.

Penyimpanan memakai key `acc-setup-personal-v2` dengan envelope schema v2. Data `acc-setup-personal-v1` otomatis dimigrasikan tanpa menghapus key lama, favorit atau catatan. Konteks baru menjadi tidak diketahui, target lama tetap manual, dan hasil historis ditandai data v1. Jika browser menolak penyimpanan, perubahan tersedia selama sesi dengan pemberitahuan dan bisa diekspor. Data rusak tidak ditimpa. Backup pribadi tidak memuat database sumber.

Rentang awal slick DHF **26–27 psi** berasal dari panduan era v1.9; wet **30–31 psi** dari panduan publik. Ini acuan uji dengan bukti terbatas, bukan verifikasi semua mobil/patch. Profil awal tersedia pada versi 1.9/1.10 untuk GT3/GT4 dan single make modern yang dipilih (Porsche 992 Cup, Huracán ST Evo2, Ferrari Challenge Evo). GT2/TCX, single make lama, dan versi lain meminta target manual dengan sumber. Batas aplikasi: target manual **20–40 psi**, cold/hot/hasil **10–50 psi**; bukan batas slider resmi masing-masing mobil. Input 60 psi ditolak. Pengukuran belum layak dapat disimpan sebagai catatan tanpa koreksi; input tekanan invalid perlu diperbaiki.

## Data dan batas kepercayaan

Materi belajar serta SVG dibundel lokal dan tetap dapat dibuka ketika katalog gagal dimuat. Referensi membedakan prinsip fisika, arsip perilaku ACC menurut versi, dan laporan pengujian; arah tuning dinyatakan sebagai hipotesis. Tidak ada prediksi grip dari sudut roda atau konversi klik damper ke koefisien universal. Playlist TL;DW Aris.Drives menjadi video tambahan di tab baru dan diberi penanda materi arsip/perlu internet. Materi utama tetap lengkap tanpa video. Gerakan visual hanya mengikuti kontrol pengguna dan menghormati reduced motion.

Snapshot `data/source-snapshot.json` disalin utuh dari pekerjaan spreadsheet. Seluruh project berdiri sendiri; script tidak membutuhkan folder `work/` atau internet. Katalog: **54 mobil, 25 sirkuit, 1.602 record**; **1.241 spesifik**, **206 baseline**, **155 arsip LFM**, **326 dari 1.350 pasangan** memiliki setup spesifik. Kondisi/sesi/karakter tertentu banyak yang belum tersedia atau tidak disebut.

Acuan snapshot: **ACC PC 1.10.4**, pemeriksaan **1 Oktober 2026**. Ini adalah versi acuan saat pengumpulan, bukan klaim versi game terkini setiap kali web dibuka. Tidak satu pun record dalam snapshot diberi kompatibilitas patch terverifikasi. BoP sumber tidak disebut; ketiadaan penanda custom bukan pembuktian BoP. Baseline dan LFM dikecualikan dari rekomendasi. “Terbaik” berarti paling cocok dengan sumber dan lengkap datanya, bukan jaminan lap tercepat atau setup sudah diuji mengemudi.

Sumber utama:

- [Katalog resmi ACC](https://assettocorsa.gg/assetto-corsa-competizione/), [GT2 Pack](https://assettocorsa.gg/the-gt2-pack-dlc/), [changelog 1.10.4](https://support.505games.com/support/solutions/articles/150000217831-assetto-corsa-competizione-changelog-v1-10-4-2025-dec-22-pc-).
- [Repositori ACC_Setups](https://github.com/Lon3035/ACC_Setups/tree/11f41f9bba08e4ed39566e2be6ac893651e2f09b). Atribusi berdasarkan nama file/README; tautan pembuat/panduan ada per record. Tidak mengklaim konfirmasi pembuat untuk setiap file. [ACCSetups](https://www.accsetups.com/) merupakan titik pencarian publik.
- [OhneSpeed](https://steamcommunity.com/sharedfiles/filedetails/?id=3098338863), [Fri3d0lf](https://www.youtube.com/watch?v=doUgUCmkXK0).
- [Race Element](https://github.com/RiddleTime/Race-Element/tree/55121bbaf163768813ffc1dc7d622c2b4056be8e) untuk pemetaan yang sudah dipakai saat pengumpulan; pemeriksaan sampel memakai [GO Setups viewer](https://gosetups.gg/acc-setup-viewer-comparator/). Ketidaksesuaian tetap ditandai belum terverifikasi.
- [Acuan tekanan slick DHF v1.9](https://coachdaveacademy.com/announcements/1-9-acc-faq-coach-dave/), [acuan wet](https://coachdaveacademy.com/documentation/coach-dave-delta-help-centre-the-complete-faq-guide/). Tidak diterapkan otomatis lintas kelas/compound/patch.

Nilai berasal dari konversi snapshot yang sudah dikumpulkan. Web tidak memetakan ulang indeks JSON. Nilai **0**, **Tidak berlaku**, **Data sumber kosong**, dan **Konversi belum terverifikasi** dibedakan. FL/FR/RL/RR selalu depan kiri/depan kanan/belakang kiri/belakang kanan. Pit strategy berupa template slot; jumlah stop aktif tercatat terpisah. Patch lama dan metadata umum tidak digandakan menjadi setup hasil pengujian baru. Semua komponen dalam satu output tetap dari satu sumber.

Identitas commit dan SHA-256 snapshot tersedia di Data & Panduan. ID setup dipertahankan; tidak bergantung pada posisi tabel. Label Mercedes-AMG GT3 Evo 2020 disempurnakan pada katalog hasil persiapan.

## Screenshot Belajar Setup

Panel **Kenali di ACC** tersedia setelah definisi pada seluruh 38 topik dan dalam bantuan parameter. Pilih kotak bernomor atau tombol daftar untuk membaca detail parameter. **Tampilkan penanda** menyembunyikan lapisan app; **Lihat gambar asli** membuka gambar tanpa penanda app secara inline, dengan zoom 100–300% dan area gulir terpisah. Tombol daftar tetap mudah digunakan pada 360 px dan melalui keyboard. Membuka bantuan dari parameter roda langsung memilih roda asal. Seluruh state media hanya sementara, terpisah dari draft dan backup v2.

Sembilan file asli dibundel di `public/media/acc/`, sekitar 468 KiB total: enam menu, HUD ban, serta dua konteks replay. File dideduplikasi, dimuat lazy, dan dipakai tanpa hotlink. Penanda/detail memakai koordinat piksel asli dan SVG/React; isi bitmap sumber tidak diubah. Kotak putih atau penekanan yang sudah ada dari penerbit tetap terlihat saat membuka file asli. Jika gambar gagal, penjelasan dan eksperimen tetap dapat dipakai.

Kurasi visual diperiksa 6 Oktober 2026. Atribusi, tautan artikel/file, model/platform jika diketahui, status arsip dan bukti versi tersedia per gambar. Sumber publik:

- [Rich / SimRacingSetup — enam menu setup](https://simracingsetup.com/assetto-corsa/acc-beginners-setup-guide/): versi/model/platform capture tidak dinyatakan, tidak disimpulkan dari tanggal artikel.
- [Coach Dave Academy — Electronics](https://coachdaveacademy.com/tutorials/the-ultimate-acc-car-setup-guide/): versi **1.7.7** terlihat pada [file screenshot](https://coachdaveacademy.com/wp-content/uploads/2021/04/blog-image-electronicsguide-1024x576.jpg).
- [Rich / SimRacingSetup — widget ban](https://simracingsetup.com/assetto-corsa/acc-tyre-pressure-guide/): capture HUD arsip; warna/psi sesaat bukan bukti pengukuran stabil.
- [Rich / SimRacingSetup — replay Ferrari 296 GT3](https://simracingsetup.com/assetto-corsa/acc-screenshots/): artikel menyebut PC **1.10.2**; versi tidak terlihat pada gambar.

Angka di screenshot merupakan contoh sumber. Tekanan target tetap memakai profil app dan status buktinya. LAST READINGS nol tidak menjadi hasil hot, fuel per lap ESTIMATED dan front aero variation dijelaskan sebagai informasi, splitter yang tampak tetap tidak dipromosikan sebagai slider universal. Frame replay memberi konteks fondasi tanpa mengklaim pengukuran grip/pitch/roll. Hasil QA per topik/rujukan tersimpan pada `tests/screenshots/acc-media/{desktop,mobile}/`.

## Struktur project

```text
data/source-snapshot.json  snapshot asli termasuk JSON mentah (bukan asset runtime)
scripts/prepare-data.mjs   validasi dan pemisahan data
public/data/catalog.json  katalog, ringkasan ID, dan cakupan
public/data/cars/*.json    54 file per mobil, tanpa JSON mentah
public/media/acc/*         sembilan screenshot asli, dibundel lokal
src/lib/                  konteks, pemeringkatan, rekomendasi, kalkulator, storage v2
src/lib/learning.ts        modul, topik, alias, pemetaan 68 parameter, referensi
src/lib/learningMedia.ts   registry, atribusi, konteks, penanda/detail per topik
src/lib/learningMath.ts    model fisika sederhana dengan validasi dan satuan
src/components/Learning*  halaman, bantuan, diagram SVG dan tujuh eksperimen
src/components/           konteks sesi, rekomendasi, latihan, perbandingan, panduan
src/App.tsx               navigasi dan alur pencarian
src/styles.css            layout responsif dan warna
tests/                    unit, integritas data, alur browser
```

File per mobil dimuat saat diperlukan dan di-cache selama sesi. Seluruh pencarian, hitungan, dan penyimpanan berjalan di browser. Setelah dependency terpasang, server dan aplikasi dapat dipakai tanpa internet; tautan sumber/video memerlukan internet bila dibuka. Tidak ada font/CDN/API eksternal, macro, unduhan JSON untuk game, pemasangan setup otomatis, atau tuning handling otomatis. Fitur belajar tidak mengubah schema personal/backup v2.

Dokumentasi stack: [React](https://react.dev/learn/build-a-react-app-from-scratch), [Vite](https://vite.dev/guide/), [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [Vitest](https://vitest.dev/guide/), [Playwright](https://playwright.dev/docs/intro).
