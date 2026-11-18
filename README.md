# Masjid Salsabila — Aplikasi Informasi Digital

Aplikasi web modern untuk menampilkan informasi Masjid Salsabila: jadwal sholat, pengingat waktu sholat (countdown), kalender Hijriyah otomatis, papan pengumuman, dan kumpulan hadis beranimasi.

## Fitur

- **Jadwal Sholat** — menampilkan waktu Subuh, Terbit, Dzuhur, Ashar, Maghrib, dan Isya (metode Kemenag RI). Mengambil data langsung dari Aladhan API bila tersedia; jika tidak, memakai jadwal contoh dengan tanggal otomatis.
- **Penghitung Waktu Sholat** — countdown ke sholat berikutnya, progress bar, dan penanda waktu berjalan di hero.
- **Tanggal Hijriyah Otomatis** — menggunakan kalender Umm al-Qura (`Intl` Islamic calendar), diperbarui setiap hari, lengkap dengan grid kalender bulanan.
- **Papan Pengumuman** — ticker berjalan + kartu pengumuman dengan filter (Kegiatan, Penting, Peringatan, Informasi).
- **Kumpulan Hadis** — carousel animasi (Arab + terjemahan Indonesia), filter tema (Iman, Ihsan, Akhlak, dll), berganti otomatis tiap 7 detik.
- **4 Tema Warna** — Emerald Classic, Midnight Azur, Rose Garden, Golden Amber. Preferensi tersimpan di `localStorage`.
- **Mode TV / Signage** — tampilan layar penuh untuk papan info masjid di Android TV: huruf besar, auto-rotate antar panel, navigasi remote (← →), countdown sholat selalu terlihat di footer.
- **UI/UX Modern** — layout responsif (desktop & mobile), animasi framer-motion, font display elegan, glassmorphism, dan reveal-on-scroll.

## Teknologi

- React 18 + TypeScript (strict)
- Vite 5
- Tailwind CSS 3
- Framer Motion 11
- Lucide React (ikon)
- Aladhan API (jadwal sholat)

## Cara Menjalankan

Pastikan Node.js 18+ sudah terpasang, lalu:

```bash
npm install
npm run dev
```

Buka browser di **http://localhost:5173**.

Untuk build produksi:

```bash
npm run build
npm run preview
```

### Mode TV / Signage (Android TV & papan info)

Ada tiga cara mengaktifkan Mode TV:

1. Klik tombol **Mode TV** (kiri bawah) atau di navbar (desktop).
2. Buka URL dengan parameter: **http://localhost:5173/?tv=1**
3. Di perangkat Android TV, UA browser biasanya otomatis terdeteksi sebagai Mode TV.

Dari jaringan lokal (agar TV bisa mengakses komputer):

```bash
npm run dev -- --host
```

Lalu di browser TV buka `http://IP-KOMPUTER:5173/?tv=1` (contoh: `http://192.168.1.5:5173/?tv=1`).

**Kontrol di Mode TV:**

| Aksi | Remote / Keyboard |
|---|---|
| Panel sebelumnya / berikutnya | ← → (atau tombol di layar) |
| Pilih panel 1–5 | Tombol angka 1–5 |
| Layar penuh | F (atau Enter / OK saat tidak ada tombol yang difokus) |
| Ganti tema | T |
| Keluar Mode TV | Esc |

Langsung ke panel tertentu lewat hash — contoh:

- `/?tv=1#hadis` — panel Hadis
- `/?tv=1#jadwal` — panel Jadwal Lengkap
- `/?tv=1#pengumuman` — Papan Pengumuman

Latar Mode TV jernih (luminous) dengan animasi aurora, orb mengambang, dan sapuan cahaya yang bergerak terus-menerus. Setelah Anda menekan panah / angka, timer auto-rotate panel di-reset (tidak langsung pindah). Di perangkat yang mendukung, layar dicoba di-lock tetap menyala untuk signage.

## Struktur Proyek

```
src/
  components/     # UI utama (hero, jadwal, kalender, pengumuman, hadis, agenda, navbar, footer)
  data/           # Data statis (fallback jadwal, hadis, pengumuman, agenda)
  hooks/          # useHijri, usePrayerSchedule, useNow, useReveal
  theme.ts        # Definisi 4 tema warna
  App.tsx         # Root aplikasi + wiring tema
```

## Catatan

- Jika API Aladhan tidak terjangkau, aplikasi menampilkan badge **"Contoh"** dan sumber **"Jadwal contoh — API tidak terjangkau"**. Jadwal tetap berfungsi untuk penghitungan countdown.
- Kota default: **Bekasi, Indonesia** (method 20 = Kemenag RI). Ubah di `src/hooks/usePrayerSchedule.ts` bila perlu.

---

© Masjid Salsabila Bekasi
