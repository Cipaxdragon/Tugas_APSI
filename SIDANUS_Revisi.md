# 📝 Dokumentasi Hasil Revisi SIDANUS

**Sistem Informasi Pendaftaran Ujian — Jurusan Sistem Informasi**  
UIN Alauddin Makassar · Tanggal Revisi: 20 Juni 2026

---

## Ringkasan Revisi

| No | Revisi | File yang Terpengaruh | Status |
|----|--------|-----------------------|--------|
| 1 | Inputan Dosen Pembimbing: Dropdown → Readonly | `mahasiswa/daftar-ujian.html` | ✅ Selesai |
| 2 | Berkas Persyaratan Ujian: Statis → Dinamis per Jenis Ujian | `mahasiswa/daftar-ujian.html`, `assets/css/mahasiswa.css` | ✅ Selesai |
| 3 | Penghapusan Role "Dosen Pembimbing" dari Sistem | `pembimbing/dashboard.html`, `assets/css/pembimbing.css`, `index.html`, `SIDANUS_Dokumentasi.md` | ✅ Selesai |

---

## Revisi 1: Inputan Dosen Pembimbing (Dropdown → Readonly)

### 📌 Kondisi Sebelum Revisi

Pada form pendaftaran ujian (`mahasiswa/daftar-ujian.html`), kolom **Dosen Pembimbing I** dan **Dosen Pembimbing II** menggunakan elemen `<select>` (dropdown) yang memungkinkan mahasiswa **memilih sendiri** dosen pembimbingnya dari daftar pilihan.

```html
<!-- SEBELUM REVISI -->
<label for="pembimbing1">Dosen Pembimbing I</label>
<select id="pembimbing1" name="pembimbing1" class="input-style">
  <option value="">— Pilih Pembimbing I —</option>
  <option value="dosen1">Dr. Andi Sumarni, S.T., M.Kom.</option>
  <option value="dosen2">Dr. Mustari Lamada, S.Pd., M.T.</option>
  <option value="dosen3">Nur Afif, S.T., M.T.</option>
  <!-- ... daftar dosen lainnya -->
</select>
```

### ❓ Alasan Revisi

**Dosen Pembimbing tidak dipilih oleh mahasiswa, melainkan ditetapkan melalui SK (Surat Keputusan) oleh Ketua Jurusan / Kaprodi.**

Pada prosedur akademik yang berlaku di UIN Alauddin Makassar:

1. Mahasiswa mengajukan judul penelitian ke jurusan.
2. **Ketua Jurusan/Kaprodi menerbitkan SK Penetapan Pembimbing** yang menetapkan siapa Pembimbing I dan Pembimbing II.
3. Mahasiswa **tidak memiliki wewenang** untuk memilih atau mengganti dosen pembimbing sendiri.

Dengan menggunakan `<select>` dropdown, tampilan UI seolah-olah memberikan kesan bahwa mahasiswa bisa memilih dosen pembimbingnya secara bebas, yang **tidak sesuai dengan alur prosedur akademik** yang sebenarnya.

### ✅ Kondisi Sesudah Revisi

Kolom pembimbing diubah menjadi `<input type="text" readonly>` dengan tampilan abu-abu (non-editable), menandakan bahwa data ini bersifat tetap dan diambil dari SK:

```html
<!-- SESUDAH REVISI -->
<label for="pembimbing1">Dosen Pembimbing I</label>
<input type="text" id="pembimbing1" name="pembimbing1"
       value="Dr. Andi Sumarni, S.T., M.Kom."
       class="input-style" readonly
       style="background:#f1f5f9; color:#64748b;" />

<label for="pembimbing2">Dosen Pembimbing II</label>
<input type="text" id="pembimbing2" name="pembimbing2"
       value="Andi Muhammad Ansar, S.Kom., M.T."
       class="input-style" readonly
       style="background:#f1f5f9; color:#64748b;" />
```

### 📊 Dampak Perubahan

- Mahasiswa **tidak dapat mengubah** nama pembimbing di form pendaftaran
- Data pembimbing ditampilkan sebagai informasi **read-only** yang berasal dari SK
- Tampilan visual berubah: background abu-abu (`#f1f5f9`) dan teks abu-abu (`#64748b`) menandakan field tidak bisa diedit
- Berlaku untuk **Pembimbing I** maupun **Pembimbing II**

---

## Revisi 2: Berkas Persyaratan Ujian (Statis → Dinamis per Jenis Ujian)

### 📌 Kondisi Sebelum Revisi

Seksi "Upload Berkas Persyaratan" pada form pendaftaran ujian menampilkan **satu set berkas yang sama** untuk semua jenis ujian, tanpa membedakan apakah mahasiswa mendaftar Seminar Proposal, Seminar Hasil, atau Munaqasyah.

### ❓ Alasan Revisi

Setiap tahapan ujian memiliki **persyaratan berkas administratif yang berbeda** sesuai prosedur akademik:

| Jenis Ujian | Berkas yang Dibutuhkan |
|-------------|----------------------|
| **Seminar Proposal (SEMPRO)** | 1. Kartu Kontrol |
| | 2. Naskah Proposal (PDF) |
| | 3. Bukti Persetujuan Pembimbing 1 (PDF) |
| | 4. Bukti Persetujuan Pembimbing 2 (PDF) |
| | 5. Transkrip Terakhir (PDF) |
| **Seminar Hasil Penelitian** | 1. SK Pembimbing |
| | 2. SK Pelaksanaan Ujian SEMPRO |
| | 3. Berita Acara Ujian SEMPRO |
| **Ujian Akhir (Munaqasyah)** | 1. SK Pelaksanaan Ujian Seminar Hasil |
| | 2. Berita Acara Seminar Hasil |

Tidak masuk akal jika mahasiswa yang mendaftar SEMPRO diminta mengunggah "Berita Acara Ujian SEMPRO" yang belum pernah ada, karena mereka belum pernah melaksanakan SEMPRO. Begitu juga sebaliknya — mahasiswa yang mendaftar Munaqasyah tidak perlu mengunggah "Kartu Kontrol" lagi.

### ✅ Kondisi Sesudah Revisi

Diimplementasikan **3 panel berkas terpisah** yang tampil secara dinamis berdasarkan jenis ujian yang dipilih, menggunakan teknik **CSS-only (Radio Hack + General Sibling Combinator `~`)** tanpa JavaScript:

**Struktur HTML:**
```html
<!-- Radio inputs di luar section (agar CSS ~ sibling hack bisa bekerja) -->
<input type="radio" class="radio-card-hidden" id="ujian-proposal"   name="jenis_ujian" value="proposal" />
<input type="radio" class="radio-card-hidden" id="ujian-hasil"      name="jenis_ujian" value="hasil" />
<input type="radio" class="radio-card-hidden" id="ujian-munaqasyah" name="jenis_ujian" value="munaqasyah" checked />

<!-- Section pemilihan Jenis Ujian (label sebagai card) -->
<section class="section-card">
  <label for="ujian-proposal"   class="ujian-card">Ujian Proposal</label>
  <label for="ujian-hasil"      class="ujian-card">Seminar Hasil</label>
  <label for="ujian-munaqasyah" class="ujian-card">Munaqasyah</label>
</section>

<!-- 3 Panel Berkas terpisah — hanya 1 yang tampil sesuai pilihan -->
<section id="berkas-proposal"   class="section-card berkas-panel">...5 berkas SEMPRO...</section>
<section id="berkas-hasil"      class="section-card berkas-panel">...3 berkas Hasil...</section>
<section id="berkas-munaqasyah" class="section-card berkas-panel">...2 berkas Munaqasyah...</section>
```

**CSS Logic (`assets/css/mahasiswa.css`):**
```css
/* Sembunyikan radio input asli */
.radio-card-hidden {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* Default: semua panel berkas tersembunyi */
.berkas-panel {
  display: none;
}

/* Tampilkan panel yang sesuai dengan radio yang dipilih */
#ujian-proposal:checked   ~ #berkas-proposal   { display: block; }
#ujian-hasil:checked       ~ #berkas-hasil       { display: block; }
#ujian-munaqasyah:checked ~ #berkas-munaqasyah { display: block; }

/* Highlight card yang sedang aktif */
#ujian-proposal:checked ~ section .ujian-card[for="ujian-proposal"],
#ujian-hasil:checked ~ section .ujian-card[for="ujian-hasil"],
#ujian-munaqasyah:checked ~ section .ujian-card[for="ujian-munaqasyah"] {
  border-color: #059669;
  background: #ecfdf5;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
}
```

### 📊 Dampak Perubahan

- Form upload berkas **otomatis berubah** saat pengguna memilih jenis ujian yang berbeda
- Tidak ada JavaScript yang digunakan — implementasi **murni CSS**
- Konsisten dengan arsitektur CSS-only SIDANUS yang sudah ada
- Setiap jenis ujian hanya menampilkan berkas yang **relevan** dengan tahapannya

### 💡 Catatan Teknis

Pada sistem nyata (dengan backend/database), jenis ujian seharusnya **terpilih otomatis** berdasarkan status riwayat kelulusan mahasiswa:
- Belum pernah ujian → otomatis tampil: **Seminar Proposal**
- Sudah lulus SEMPRO → otomatis tampil: **Seminar Hasil**
- Sudah lulus Seminar Hasil → otomatis tampil: **Munaqasyah**

Pada mockup frontend ini, ketiga pilihan tetap bisa diklik untuk **keperluan demonstrasi UI** agar dosen penilai bisa melihat tampilan form untuk masing-masing jenis ujian.

---

## Revisi 3: Penghapusan Role "Dosen Pembimbing" dari Sistem

### 📌 Kondisi Sebelum Revisi

Sistem SIDANUS memiliki **5 role/aktor** dengan halaman masing-masing:

| No | Role | Halaman | Warna |
|----|------|---------|-------|
| 1 | Mahasiswa | `mahasiswa/` | Emerald |
| 2 | Admin Prodi | `admin/` | Blue |
| 3 | **Dosen Pembimbing** | **`pembimbing/`** | **Violet** |
| 4 | Ketua Prodi (Kaprodi) | `kaprodi/` | Amber |
| 5 | Dosen Penguji | `penguji/` | Rose |

Role "Dosen Pembimbing" memiliki dashboard (`pembimbing/dashboard.html`) dengan fitur:
- Melihat daftar mahasiswa bimbingan
- Mengecek berkas naskah yang di-upload mahasiswa
- Memberikan ACC (persetujuan digital) atau mengembalikan untuk revisi
- Menulis catatan untuk mahasiswa

**Alur bisnis sebelum revisi:**
```
Mahasiswa Upload Berkas
    → Pembimbing Login & Review → Klik ACC / Revisi
    → Admin Verifikasi Kelengkapan → Approve / Tolak
    → Admin Input Jadwal
    → Kaprodi Setujui
    → Penguji Menguji & Input Nilai
```

### ❓ Alasan Revisi

Berdasarkan analisis terhadap **alur bisnis nyata** di lingkungan akademik:

**1. Proses bimbingan dilakukan secara offline (tatap muka)**
- Diskusi konten skripsi, revisi materi, coret-coret draf, semua dilakukan secara tatap muka antara mahasiswa dan dosen.
- Sistem informasi pendaftaran ujian **bukan tempat untuk bimbingan** — ia hanya menangani administrasi pendaftaran.

**2. Persetujuan (ACC) pembimbing diberikan melalui tanda tangan fisik**
- Saat dosen pembimbing menganggap mahasiswa siap ujian, dosen menandatangani **Lembar Persetujuan** secara fisik.
- Mahasiswa men-scan lembar tersebut menjadi PDF dan mengunggahnya ke sistem sebagai salah satu **berkas persyaratan** ("Bukti Persetujuan Pembimbing 1/2").

**3. Pengecekan kelengkapan berkas administratif adalah tugas Admin Prodi**
- Yang mengecek apakah berkas-berkas (Transkrip, SK, Berita Acara, dll.) lengkap dan valid adalah **Admin Prodi**, bukan dosen pembimbing.
- Menambahkan fitur "cek berkas" di dashboard pembimbing berarti **duplikasi tugas** dengan Admin Prodi.

**4. Fitur "Revisi" di dashboard pembimbing membingungkan**
- Tombol "Kembalikan untuk Revisi" di dashboard pembimbing bisa disalahartikan sebagai proses revisi materi/konten skripsi.
- Padahal proses revisi materi sudah ditangani secara offline saat bimbingan.
- Yang sebenarnya dimaksud hanyalah kesalahan upload file, yang lebih tepat dicek oleh Admin Prodi.

**5. Menambah beban kerja dosen yang tidak perlu**
- Dosen (terutama dosen senior) harus login ke sistem hanya untuk menekan satu tombol "ACC".
- Ini menambah langkah yang tidak efisien, padahal proses persetujuan sudah terjadi secara offline.

### ✅ Kondisi Sesudah Revisi

**File yang dihapus:**

| File/Folder | Keterangan |
|-------------|------------|
| `pembimbing/dashboard.html` | Halaman dashboard dosen pembimbing (414 baris) |
| `pembimbing/` (folder) | Seluruh folder role pembimbing |
| `assets/css/pembimbing.css` | CSS khusus role pembimbing — warna violet (69 baris) |

**File yang dimodifikasi:**

| File | Detail Perubahan |
|------|------------------|
| `index.html` | Menghapus `<option value="pembimbing">Dosen Pembimbing</option>` dari dropdown role login |
| `index.html` | Menghapus tombol demo shortcut "Pembimbing" (link ke `pembimbing/dashboard.html`) |
| `SIDANUS_Dokumentasi.md` | Menghapus pembimbing dari: struktur file, alur per role, business flow, tabel warna, dan referensi accordion |

**Alur bisnis sesudah revisi:**
```
Mahasiswa Upload Berkas (termasuk scan ACC pembimbing fisik)
    → Admin Verifikasi Semua Berkas (termasuk keaslian scan ACC) → Approve / Tolak
    → Admin Input Jadwal
    → Kaprodi Setujui
    → Penguji Menguji & Input Nilai
```

**Role aktif sesudah revisi (4 role):**

| No | Role | Warna | Halaman |
|----|------|-------|---------|
| 1 | Mahasiswa | Emerald (#059669) | `mahasiswa/` |
| 2 | Admin Prodi | Blue (#2563eb) | `admin/` |
| 3 | Ketua Prodi (Kaprodi) | Amber (#b45309) | `kaprodi/` |
| 4 | Dosen Penguji | Rose (#be123c) | `penguji/` |

### 📊 Dampak Perubahan

- Jumlah role berkurang dari **5 → 4** (lebih sederhana)
- Alur bisnis lebih pendek: Mahasiswa langsung ke Admin tanpa melewati langkah Pembimbing
- Beban Admin Prodi sedikit bertambah (harus cek keaslian scan tanda tangan pembimbing)
- **Nama dosen pembimbing tetap ditampilkan** di form pendaftaran ujian sebagai informasi readonly — yang dihapus hanya akses login dan dashboard-nya

---

## Perbandingan Alur Bisnis: Sebelum vs Sesudah Revisi

### Sebelum Revisi (5 Role — Full Digital)
```
Mahasiswa  →  Pembimbing (ACC Digital)  →  Admin  →  Kaprodi  →  Penguji
   │               │                        │          │           │
   │          Login & klik ACC         Verifikasi   Setujui    Input Nilai
   │                                    berkas      jadwal
   Upload berkas
```

### Sesudah Revisi (4 Role — Hybrid: Offline + Digital)
```
Mahasiswa  →  Admin  →  Kaprodi  →  Penguji
   │            │          │           │
   │       Verifikasi   Setujui    Input Nilai
   │        berkas      jadwal
   Upload berkas
   (termasuk scan
   ACC fisik dari
   pembimbing)
```

---

*Dokumentasi revisi ini dibuat pada 20 Juni 2026 sebagai lampiran dari SIDANUS_Dokumentasi.md*
