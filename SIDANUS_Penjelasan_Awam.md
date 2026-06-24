# 📖 Penjelasan Sederhana Perbaikan Aplikasi SIDANUS

Dokumen ini berisi rangkuman perbaikan (revisi) yang telah dilakukan pada aplikasi **SIDANUS (Sistem Informasi Pendaftaran Ujian)** agar lebih mudah digunakan dan sesuai dengan aturan kampus. Penjelasan di bawah ini dibuat tanpa menggunakan istilah teknis komputer agar mudah dipahami oleh siapa saja (Dosen, Mahasiswa, maupun Staf).

---

## 1. Mahasiswa Tidak Bisa Lagi "Memilih" Dosen Pembimbing Sendiri
**Masalah sebelumnya:** Di halaman pendaftaran ujian, mahasiswa seolah-olah bebas memilih siapa dosen pembimbingnya dari daftar nama yang bisa diklik. Padahal di dunia nyata, dosen pembimbing ditetapkan oleh SK Ketua Jurusan.
**Perbaikannya:** Kolom nama dosen pembimbing sekarang dibuat terkunci (hanya bisa dibaca). Namanya akan otomatis terisi berdasarkan SK yang sudah ada, sehingga mahasiswa tidak bisa mengganti-ganti nama pembimbing sesuka hati.

## 2. Formulir Upload Berkas Jadi Lebih Pintar
**Masalah sebelumnya:** Saat mahasiswa mau mendaftar ujian, sistem selalu meminta semua dokumen (seperti transkrip, sertifikat, dll) tanpa peduli apakah mahasiswa itu mau ujian Proposal, Seminar Hasil, atau Munaqasyah. Ini membingungkan karena syarat tiap ujian itu berbeda-beda.
**Perbaikannya:** Sekarang formulirnya otomatis berubah! Jika mahasiswa memilih "Ujian Proposal", maka kotak yang muncul hanya untuk mengupload berkas syarat Proposal saja. Jika memilih "Munaqasyah", maka kotaknya ganti menyesuaikan syarat Munaqasyah.

## 3. Menghapus Fitur Login untuk "Dosen Pembimbing"
**Masalah sebelumnya:** Aplikasi ini tadinya menyuruh Dosen Pembimbing untuk ikut login dan mengeklik tombol "Setuju" kalau mahasiswanya mau ujian. Padahal, proses bimbingan dan corat-coret skripsi kan dilakukan secara langsung (tatap muka), dan persetujuan ujian dibuktikan dari tanda tangan di atas kertas.
**Perbaikannya:** Kita tidak perlu lagi merepotkan Dosen Pembimbing untuk login ke aplikasi. Cukup mahasiswa saja yang mengupload kertas persetujuan yang sudah ditandatangani basah oleh dosen, lalu Admin Prodi yang akan memeriksa kertas tersebut di sistem. Praktis!

## 4. Tampilan di HP Jadi Lebih Enak Dibaca
**Masalah sebelumnya:** Kalau mahasiswa membuka aplikasi ini lewat HP, informasi yang paling penting seperti "Jadwal Ujian" dan "Catatan Revisi" malah tenggelam di bagian paling bawah. Mahasiswa harus repot menggulir layar (scroll) jauh ke bawah.
**Perbaikannya:** Tampilannya sudah ditata ulang. Sekarang, begitu mahasiswa buka aplikasi di HP, informasi "Jadwal Ujian" dan "Catatan Revisi" langsung muncul di bagian atas karena itu yang paling penting untuk segera dibaca.

## 5. Merapikan Menu di Pinggir Layar
**Masalah sebelumnya:** Terlalu banyak tombol menu di pinggir layar untuk mahasiswa, yang sebenarnya isinya mengulang-ngulang halaman yang sama.
**Perbaikannya:** Menu-menu yang tidak penting dan membingungkan sudah dibuang agar layar terlihat lebih bersih dan simpel.

## 6. Merapikan Syarat Berkas Munaqasyah
**Masalah sebelumnya:** Ada pemberitahuan yang mengatakan mahasiswa kurang berkas A dan B, tapi tempat untuk mengupload berkas A dan B itu malah tidak disediakan oleh sistem.
**Perbaikannya:** Sekarang semua slot kotak tempat upload berkas sudah disamakan jumlahnya dengan daftar syarat berkas yang diminta.

## 7. Memperbaiki Salah Ketik di Judul Surat Lulus
**Masalah sebelumnya:** Di kertas pengumuman mahasiswa tertulis "Surat Keterangan Lulus Skripsi", padahal mahasiswanya baru saja lulus ujian "Proposal".
**Perbaikannya:** Judul suratnya sudah diganti agar sesuai dengan jenis ujian yang baru saja diselesaikan.

## 8. Mencegah Salah Ketik "Hari" Ujian
**Masalah sebelumnya:** Saat Admin Prodi mengatur jadwal ujian mahasiswa, admin disuruh mengetik tanggal (misal: 23 Juni) lalu disuruh lagi mengetik nama harinya (misal: Selasa). Ini bahaya kalau adminnya salah ketik hari.
**Perbaikannya:** Kolom ketik "Hari" sudah dihapus. Admin sekarang cukup memilih tanggal di kalender saja, dan sistem sudah cukup pintar untuk tahu hari apa itu.

## 9. Fitur Cek Berkas Admin yang Jauh Lebih Detail
**Masalah sebelumnya:** Admin bisa saja langsung mengeklik tombol "Loloskan Mahasiswa" tanpa perlu membuka dan membaca file dokumen yang dikirim mahasiswa. Ini sangat berisiko meloloskan berkas yang salah atau buram.
**Perbaikannya:** Tombol lolos instan dihapus. Sekarang Admin diwajibkan membuka "Layar Pop-up Pemeriksaan". Di layar itu, Admin harus memeriksa setiap dokumen satu per satu (misal: KTP oke, Transkrip ditolak karena buram, dsb) sebelum bisa meloloskan mahasiswa tersebut.

## 10. Membantu Admin Memilih Dosen Penguji
**Masalah sebelumnya:** Saat Admin mau mengatur jadwal, Admin harus repot mengingat-ingat siapa dosen pembimbing si mahasiswa untuk dijadikan Ketua Sidang.
**Perbaikannya:** Sekarang, di daftar nama dosen yang akan dipilih, sudah ditambahkan keterangan "Ini Pembimbing 1-nya" dan "Ini Pembimbing 2-nya", sehingga Admin bisa langsung mengeklik tanpa harus mengingat-ingat lagi.

## 11. Tampilan Upload File Lebih Jelas (Tidak Bikin Bingung)
**Masalah sebelumnya:** Saat mahasiswa memilih file PDF untuk diupload, tidak ada tulisan atau perubahan warna apa-apa di layar, sehingga mahasiswa sering ragu "Ini file saya sudah masuk belum ya?".
**Perbaikannya:** Sekarang, begitu mahasiswa selesai memilih file, kotaknya akan langsung berubah menjadi hijau, muncul nama filenya, dan ada tulisan "✓ Sudah Upload". Jadi mahasiswa merasa lebih tenang dan yakin.

## 12. Pewarnaan Tombol yang Lebih Tepat
**Masalah sebelumnya:** Warna hijau dipakai sembarangan untuk hal-hal yang sifatnya masih menunggu antrean. Padahal secara logika pikiran manusia, warna hijau itu artinya "Sukses/Selesai".
**Perbaikannya:** Semua warna di aplikasi sudah dirombak. Kuning untuk yang masih "Menunggu", Merah untuk "Ditolak", dan Hijau khusus hanya untuk yang benar-benar "Sudah Selesai/Lolos".

---
*Dibuat untuk memudahkan komunikasi antara Tim Pembuat Aplikasi dengan pihak Kampus (Dosen/Admin).*
