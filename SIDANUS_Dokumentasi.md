# 📚 Dokumentasi SIDANUS
**Sistem Informasi Pendaftaran Ujian — Jurusan Sistem Informasi**  
UIN Alauddin Makassar · Versi 2.1.0

---

## 1. Gambaran Umum

SIDANUS adalah aplikasi web statis berbasis **MPA (Multi-Page Application)** untuk mengelola proses pendaftaran ujian skripsi (Proposal, Hasil, Munaqasyah). Dibangun dengan:

| Teknologi | Detail |
|-----------|--------|
| HTML5 Semantik | Struktur konten |
| Tailwind CSS CDN | Utility-first styling |
| Vanilla CSS | Komponen interaktif (tanpa JS) |
| JavaScript | **Hanya** `tailwind.config.js` (konfigurasi CDN) |
| Arsitektur | MPA Statis — navigasi via `<a href>` |

> [!IMPORTANT]
> **TANPA JavaScript behavior.** Semua interaktivitas (sidebar, tab, accordion, filter) menggunakan CSS-only technique (Checkbox Hack, Radio Hack, `<details>/<summary>`).

---

## 2. Struktur File & Folder

```
APSI_3/
│
├── index.html                    ← Login utama (pintu masuk semua role)
├── jadwal-publik.html            ← Jadwal ujian (akses tanpa login)
│
├── mahasiswa/
│   ├── dashboard.html            ← Status verifikasi & tracking berkas
│   ├── daftar-ujian.html         ← Form pendaftaran ujian
│   ├── profil.html               ← Profil & ganti password
│   ├── notifikasi.html           ← Inbox notifikasi
│   └── sk-kelulusan.html         ← Surat Keterangan Kelulusan (printable)
│
├── admin/
│   ├── dashboard.html            ← Verifikasi berkas mahasiswa
│   └── penjadwalan.html          ← Input & edit jadwal ujian
│
│
├── kaprodi/
│   └── dashboard.html            ← Persetujuan jadwal & penguji
│
├── penguji/
│   ├── dashboard.html            ← Jadwal menguji
│   └── input-nilai.html          ← Input nilai & catatan revisi
│
└── assets/
    ├── css/
    │   ├── base.css              ← Shared styles semua halaman
    │   ├── login.css             ← Khusus index.html
    │   ├── mahasiswa.css         ← Khusus mahasiswa/
    │   ├── profil.css            ← Khusus profil.html
    │   ├── notifikasi.css        ← Khusus notifikasi.html
    │   ├── sk-kelulusan.css      ← Khusus SK + @media print
    │   ├── admin.css             ← Khusus admin/ (biru)
    │   ├── kaprodi.css           ← Khusus kaprodi/ (amber)
    │   ├── penguji.css           ← Khusus penguji/ (rose)
    │   └── public.css            ← Khusus jadwal-publik.html
    └── js/
        └── tailwind.config.js    ← Konfigurasi Tailwind global
```

---

## 3. Alur Aplikasi per Role

### 🟢 Mahasiswa
```
index.html (Login)
    │
    ▼
mahasiswa/dashboard.html
    ├── Lihat status tracking berkas (Timeline)
    ├── Lihat jadwal ujian terkonfirmasi
    ├── Lihat riwayat ujian sebelumnya
    │
    ├──► mahasiswa/daftar-ujian.html   (isi form pendaftaran + upload berkas)
    ├──► mahasiswa/notifikasi.html     (inbox notifikasi dari sistem/admin)
    ├──► mahasiswa/sk-kelulusan.html   (cetak/print SK kelulusan)
    ├──► mahasiswa/profil.html         (edit profil & ganti password)
    └──► jadwal-publik.html            (lihat jadwal semua mahasiswa)
```

### 🔵 Admin Program Studi
```
index.html (Login)
    │
    ▼
admin/dashboard.html
    ├── Lihat daftar pendaftaran masuk
    ├── Verifikasi berkas per mahasiswa
    ├── Approve / Tolak berkas
    │
    └──► admin/penjadwalan.html  (input tanggal, ruang, penguji)
```

> [!NOTE]
> Role "Dosen Pembimbing" telah dihapus dari sistem. Proses bimbingan dan persetujuan dilakukan secara offline. Mahasiswa cukup mengunggah scan Bukti Persetujuan Pembimbing sebagai salah satu berkas persyaratan.

### 🟡 Kaprodi
```
index.html (Login)
    │
    ▼
kaprodi/dashboard.html
    ├── Review jadwal ujian yang diusulkan admin
    ├── Setujui / Revisi jadwal
    └── Tetapkan dosen penguji
```

### 🔴 Dosen Penguji
```
index.html (Login)
    │
    ▼
penguji/dashboard.html
    ├── Lihat jadwal ujian yang akan datang
    │
    └──► penguji/input-nilai.html
            ├── Input nilai per komponen (5 bobot)
            ├── Pilih hasil: Lulus / Lulus dengan Revisi / Tidak Lulus
            └── Tulis catatan revisi
```

### 🌐 Publik (Tanpa Login)
```
index.html  ──► jadwal-publik.html
                    ├── Filter: Semua / Proposal / Hasil / Munaqasyah
                    ├── Tabel jadwal ujian (nama, tanggal, ruang, penguji)
                    └── Daftar dosen penguji tetap
```

---

## 4. Alur Proses Bisnis (Business Flow)

```
[MAHASISWA] Isi Form Pendaftaran + Upload Berkas (termasuk scan ACC pembimbing)
        │
        ▼
[ADMIN]    Verifikasi semua berkas lengkap → Approve/Tolak
        │ (jika Approve)
        ▼
[ADMIN]    Input usulan jadwal di penjadwalan.html
        │
        ▼
[KAPRODI]  Review jadwal & penguji → Setujui
        │
        ▼
[SISTEM]   Kirim notifikasi jadwal ke Mahasiswa & Penguji
        │
        ▼
[PENGUJI]  Hari-H ujian → Input nilai di input-nilai.html
        │
        ▼
[SISTEM]   Generate SK Kelulusan → Mahasiswa dapat cetak
```

---

## 5. Data Dummy — Referensi Lengkap

Semua data di bawah ini adalah **dummy** yang tersebar di file-file HTML. Ganti sesuai data nyata.

---

### 👤 Data Mahasiswa (digunakan di: semua file `mahasiswa/`)

```
Nama Lengkap  : Ahmad Fauzi Ramadhan
NIM           : 60900121034
Angkatan      : 2021
Semester      : 8
Program Studi : Sistem Informasi
Email         : ahmadfauzi@student.uin-alauddin.ac.id
No. HP        : 0812-3456-7890
IPK           : 3.72 / 4.00
SKS Lulus     : 142 / 144
Inisial       : AF (dipakai di avatar navbar)
```

**Judul Penelitian:**
```
"Analisis Penerimaan Sistem Enterprise Resource Planning (ERP)
 Menggunakan Metode Technology Acceptance Model (TAM)
 pada PT. Sinar Nusantara Makassar"
```

**Cara Ganti:** Cari & Replace teks di VS Code:
- `Ahmad Fauzi Ramadhan` → nama baru
- `60900121034` → NIM baru
- `Angkatan 2021` → angkatan baru

---

### 🎓 Data Dosen (digunakan di: semua file dashboard/penguji)

| Role | Nama | NIDN/NIP |
|------|------|----------|
| Pembimbing I / Ketua Sidang | Dr. Andi Sumarni, S.T., M.Kom. | NIDN 0912027801 |
| Penguji I / Pembimbing II | Dr. Mustari Lamada, S.Pd., M.T. | NIDN 0001057401 |
| Penguji II | Nur Afif, S.T., M.T. | NIDN 0011088104 |
| Sekretaris Sidang | Andi M. Ansar, S.Kom., M.T. | NIDN 0014087903 |
| Kaprodi | Prof. Dr. H. Kamaruddin Tone, M.M. | NIP 197210102002121001 |

---

### 📅 Data Jadwal Ujian (digunakan di: `jadwal-publik.html`, `admin/penjadwalan.html`)

| No | Mahasiswa | Jenis Ujian | Tanggal | Waktu | Ruang |
|----|-----------|-------------|---------|-------|-------|
| 1 | Ahmad Fauzi Ramadhan (60900121034) | Munaqasyah | Senin, 30 Jun 2026 | 09:00–11:00 | Ruang Seminar Lt. 3 |
| 2 | Nurul Hidayah (60900121041) | Proposal | Selasa, 1 Jul 2026 | 10:00–12:00 | Ruang Sidang A |
| 3 | Muhammad Rizki (60900121028) | Hasil | Rabu, 2 Jul 2026 | 08:00–10:00 | Ruang Seminar Lt. 2 |
| 4 | Siti Rahayu (60900120015) | Munaqasyah | Kamis, 3 Jul 2026 | 13:00–15:00 | Ruang Sidang B |
| 5 | Bagas Prasetyo (60900121055) | Proposal | Jumat, 4 Jul 2026 | 09:00–11:00 | Ruang Seminar Lt. 3 |

---

### 🏫 Data Institusi (digunakan di: `sk-kelulusan.html`, `jadwal-publik.html`)

```
Nama Universitas : Universitas Islam Negeri Alauddin Makassar
Nama Prodi       : Sistem Informasi
Fakultas         : Fakultas Sains dan Teknologi
Alamat           : Jl. H. M. Yasin Limpo No. 36, Romang Polong, Gowa
Email            : adminsi@uin-alauddin.ac.id
Akreditasi       : A (Unggul)
```

---

### 📜 Data SK Kelulusan (digunakan di: `mahasiswa/sk-kelulusan.html`)

```
No. SK         : 045/SK/SI-UIN/III/2026
Tanggal Ujian  : Sabtu, 15 Maret 2026
Tanggal Terbit : Gowa, 20 Maret 2026
Jenis Ujian    : Ujian Proposal Skripsi
Nilai Akhir    : 84.6 (A)
```

**Bobot Nilai:**
| Komponen | Bobot | Nilai | Terbobot |
|----------|-------|-------|----------|
| Penguasaan Materi & Bidang Ilmu | 30% | 85 | 25.5 |
| Metodologi Penelitian | 25% | 82 | 20.5 |
| Kemampuan Presentasi & Argumentasi | 20% | 88 | 17.6 |
| Sistematika Penulisan | 15% | 80 | 12.0 |
| Etika & Sikap Ilmiah | 10% | 90 | 9.0 |
| **TOTAL** | **100%** | — | **84.6** |

---

### 🔔 Data Notifikasi (digunakan di: `mahasiswa/notifikasi.html`)

| # | Tipe | Judul | Dari | Tanggal | Status |
|---|------|-------|------|---------|--------|
| 1 | ⚠ Urgent | Batas Pengumpulan Berkas: 2 Hari Lagi! | Admin Prodi | Senin, 16 Jun 2026 · 07:30 | Belum Dibaca |
| 2 | 📅 Jadwal | Jadwal Ujian Proposal Dikonfirmasi | Kaprodi | Sabtu, 14 Jun 2026 · 16:00 | Belum Dibaca |
| 3 | ✓ ACC | Pembimbing I Memberikan ACC Berkas | Dosen Pembimbing | Kamis, 5 Jun 2026 · 14:22 | Belum Dibaca |
| 4 | ⏳ Proses | Berkas Diterima Admin – Sedang Diverifikasi | Admin Prodi | Senin, 2 Jun 2026 · 09:15 | Dibaca |
| 5 | ✏ Revisi | Catatan Revisi Ujian Proposal Diterima | Dr. Mustari Lamada, M.T. | Sabtu, 15 Mar 2026 · 11:40 | Dibaca |
| 6 | Sistem | Akun SIDANUS Berhasil Diaktifkan | Sistem | Senin, 5 Agustus 2021 · 10:00 | Dibaca |

---

## 6. Warna per Role (CSS Custom Properties)

Setiap role memiliki warna aksen berbeda yang dikontrol via CSS variable `--role-color` di `assets/css/base.css`:

| Role | Warna Utama | Hex | File CSS |
|------|-------------|-----|----------|
| Mahasiswa | Emerald | `#059669` | `mahasiswa.css` (default) |
| Admin Prodi | Blue | `#2563eb` | `admin.css` |
| Kaprodi | Amber | `#b45309` | `kaprodi.css` |
| Penguji | Rose | `#be123c` | `penguji.css` |

**Cara Ganti Warna Role:**  
Edit `:root` di file CSS role yang bersangkutan:
```css
/* Contoh: ganti warna admin dari biru ke teal */
:root {
  --role-color:        #0d9488;   /* ← ganti ini */
  --role-bg:           rgba(13, 148, 136, 0.10);
  --role-border:       #0d9488;
  --role-light:        #f0fdfa;
  --role-light-border: #ccfbf1;
}
```

---

## 7. Komponen Interaktif CSS-Only

### 7.1 Sidebar Mobile Toggle (Checkbox Hack)
Dipakai di: semua halaman kecuali `index.html` dan `jadwal-publik.html`

```html
<!-- Di dalam <body>, sebelum sidebar -->
<input type="checkbox" id="sidebar-toggle" />

<!-- Overlay gelap saat sidebar terbuka -->
<label id="sidebar-overlay" for="sidebar-toggle" ...></label>

<!-- Sidebar -->
<aside id="sidebar" ...>...</aside>

<!-- Tombol hamburger di navbar -->
<label for="sidebar-toggle" ...>☰</label>
```
CSS di `assets/css/base.css` (baris 22–28).

---

### 7.2 Tab Switcher (Radio Hack)
Dipakai di: `mahasiswa/profil.html`

```html
<!-- Radio buttons (hidden) -->
<input type="radio" class="tab-radio" id="tab-profil"   name="tabs" checked />
<input type="radio" class="tab-radio" id="tab-password" name="tabs" />

<!-- Label = Tab button -->
<div class="tab-labels">
  <label class="tab-label" for="tab-profil">Profil</label>
  <label class="tab-label" for="tab-password">Ganti Password</label>
</div>

<!-- Panel konten -->
<div class="tab-content">
  <div id="panel-profil">...konten profil...</div>
  <div id="panel-password">...konten password...</div>
</div>
```
CSS di `assets/css/profil.css` (baris 4–26).

---

### 7.3 Filter Chips (Radio Hack)
Dipakai di: `mahasiswa/notifikasi.html`, `jadwal-publik.html`

```html
<input type="radio" class="notif-filter" id="nf-semua" name="notif_filter" checked />
<label for="nf-semua">Semua (8)</label>

<input type="radio" class="notif-filter" id="nf-belum" name="notif_filter" />
<label for="nf-belum">Belum Dibaca (3)</label>
```
CSS di `assets/css/notifikasi.css` (baris 4–20) dan `public.css` (baris 18–37).

---

### 7.4 Accordion (Details/Summary)
Dipakai di: `notifikasi.html`, `penguji/input-nilai.html`

```html
<details class="notif-item unread">
  <summary>...header accordion...</summary>
  <div>...konten tersembunyi...</div>
</details>
```
CSS di `assets/css/base.css` (baris 77–81).

---

### 7.5 Hasil Ujian Radio (Custom Radio Buttons)
Dipakai di: `penguji/input-nilai.html`

```html
<input type="radio" class="hasil-radio" id="hasil-lulus" name="hasil" />
<label for="hasil-lulus">Lulus</label>

<input type="radio" class="hasil-radio" id="hasil-revisi" name="hasil" />
<label for="hasil-revisi">Lulus dengan Revisi</label>

<input type="radio" class="hasil-radio" id="hasil-tidak-lulus" name="hasil" />
<label for="hasil-tidak-lulus">Tidak Lulus</label>
```
CSS di `assets/css/penguji.css` (baris 48–81).

---

## 8. Cara Menambah Halaman Baru

1. **Buat file HTML** di folder role yang sesuai, misalnya `mahasiswa/riwayat.html`
2. **Salin template head** dari halaman sejenis:
```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Riwayat Ujian – SIDANUS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="../assets/js/tailwind.config.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/base.css" />
  <link rel="stylesheet" href="../assets/css/mahasiswa.css" />  <!-- atau CSS role lain -->
</head>
```
3. **Tambahkan link** di sidebar halaman-halaman dalam folder yang sama
4. **Jika butuh style baru**, tambahkan di file CSS role yang sesuai (bukan inline `<style>`)

---

## 9. Cara Mengganti Data Dummy

### Ganti Semua Tanggal Sekaligus (PowerShell)
```powershell
# Ganti semua "2026" menjadi tahun baru
Get-ChildItem "d:\Desktop\APSI_3" -Recurse -Filter "*.html" | ForEach-Object {
  (Get-Content $_.FullName -Raw) -replace '2026', '2027' |
  Set-Content $_.FullName
}
```

### Ganti Data Mahasiswa (PowerShell)
```powershell
$files = Get-ChildItem "d:\Desktop\APSI_3\mahasiswa" -Filter "*.html"
foreach ($f in $files) {
  $c = Get-Content $f.FullName -Raw
  $c = $c -replace 'Ahmad Fauzi Ramadhan', 'NAMA BARU'
  $c = $c -replace '60900121034', 'NIM_BARU'
  Set-Content $f.FullName $c
}
```

---

## 10. Catatan Teknis

| Item | Detail |
|------|--------|
| Path CSS (dari subfolder) | `../assets/css/base.css` |
| Path CSS (dari root) | `./assets/css/login.css` |
| Path JS (dari subfolder) | `../assets/js/tailwind.config.js` |
| Tailwind CDN | `https://cdn.tailwindcss.com` (JIT mode) |
| Google Fonts | Inter 300–800 |
| Print CSS | `@media print` ada di `sk-kelulusan.css` |
| Tidak ada backend | Semua form tidak submit ke server |
| Tidak ada session | Login hanya navigasi halaman |

---

*Dokumentasi ini dibuat otomatis oleh SIDANUS Generator · 14 Juni 2026*
