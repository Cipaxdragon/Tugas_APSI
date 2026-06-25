/**
 * SIDANUS — Data Layer (localStorage)
 * Simulasi database untuk aplikasi pendaftaran ujian.
 * Semua data disimpan di localStorage browser.
 */

const SidanusDB = {

  // ══════════════════════════════════════
  // KEYS
  // ══════════════════════════════════════
  KEYS: {
    SESSION: 'sidanus_session',
    STUDENTS: 'sidanus_students',
    REGISTRATIONS: 'sidanus_registrations',
    SCHEDULES: 'sidanus_schedules',
  },

  // ══════════════════════════════════════
  // SEED DATA (Dummy)
  // ══════════════════════════════════════
  SEED_STUDENTS: [
    {
      nim: '60900121034',
      nama: 'Ahmad Fauzi Ramadhan',
      prodi: 'Sistem Informasi',
      semester: 8,
      email: 'ahmadffauzi@uin.ac.id',
      hp: '082312345678',
      judul: 'Analisis Penerimaan Sistem ERP Menggunakan Metode Technology Acceptance Model (TAM) pada PT. Sinar Nusantara Makassar',
      abstrak: 'Penelitian ini bertujuan untuk menganalisis tingkat penerimaan sistem Enterprise Resource Planning (ERP) pada PT. Sinar Nusantara Makassar menggunakan pendekatan Technology Acceptance Model (TAM).',
      pembimbing1: 'Dr. Andi Sumarni, S.T., M.Kom.',
      pembimbing2: 'Andi Muhammad Ansar, S.Kom., M.T.',
      // Status ujian: 'belum' | 'proposal_selesai' | 'hasil_selesai'
      statusUjian: 'belum',
      angkatan: 2021,
    },
    {
      nim: '60900120057',
      nama: 'Muhammad Rizal Aditya',
      prodi: 'Sistem Informasi',
      semester: 10,
      email: 'rizaladitya@uin.ac.id',
      hp: '081234567890',
      judul: 'Implementasi Machine Learning untuk Prediksi Mahasiswa Bermasalah di PTKIN',
      abstrak: 'Penelitian ini mengimplementasikan algoritma machine learning untuk memprediksi mahasiswa yang berpotensi bermasalah akademik.',
      pembimbing1: 'Dr. Andi Sumarni, S.T., M.Kom.',
      pembimbing2: 'Andi Muhammad Ansar, S.Kom., M.T.',
      statusUjian: 'hasil_selesai',
      angkatan: 2020,
    },
    {
      nim: '60900120091',
      nama: 'Zainal Abidin Harahap',
      prodi: 'Sistem Informasi',
      semester: 10,
      email: 'zainal.abidin@uin.ac.id',
      hp: '085678901234',
      judul: 'Analisis Keamanan Jaringan Komputer Menggunakan Metode Penetration Testing',
      abstrak: 'Penelitian ini menganalisis keamanan jaringan komputer dengan pendekatan penetration testing.',
      pembimbing1: 'Dr. H. Alamsyah, S.T., M.T.',
      pembimbing2: 'Faisal Akib, S.Kom., M.Kom.',
      statusUjian: 'hasil_selesai',
      angkatan: 2020,
    },
    {
      nim: '60900121005',
      nama: 'Fatimah Az-Zahra',
      prodi: 'Sistem Informasi',
      semester: 8,
      email: 'fatimah.az@uin.ac.id',
      hp: '087890123456',
      judul: 'Perancangan Sistem Informasi Perpustakaan Berbasis Web pada Kampus UIN Alauddin Makassar',
      abstrak: 'Penelitian ini merancang sistem informasi perpustakaan berbasis web untuk meningkatkan efisiensi layanan.',
      pembimbing1: 'Faisal Akib, S.Kom., M.Kom.',
      pembimbing2: 'Rismawati, S.Kom., M.Kom.',
      statusUjian: 'proposal_selesai',
      angkatan: 2021,
    },
    {
      nim: '60900121019',
      nama: 'Nur Hikmah Salsabila',
      prodi: 'Sistem Informasi',
      semester: 8,
      email: 'hikmah.salsa@uin.ac.id',
      hp: '089012345678',
      judul: 'Evaluasi Usability Aplikasi Mobile Banking Menggunakan Metode System Usability Scale (SUS)',
      abstrak: 'Penelitian ini mengevaluasi tingkat usability aplikasi mobile banking menggunakan metode SUS.',
      pembimbing1: 'Nur Afif, S.T., M.T.',
      pembimbing2: 'Rismawati, S.Kom., M.Kom.',
      statusUjian: 'belum',
      angkatan: 2021,
    },
  ],

  SEED_REGISTRATIONS: [
    {
      id: 'REG-001',
      nim: '60900120057',
      jenisUjian: 'munaqasyah',
      tanggalDaftar: '2026-06-10',
      berkas: {
        sk_seminar_hasil: true,
        berita_acara_hasil: true,
        naskah_skripsi: true,
        kartu_bimbingan: true,
        sertifikat: true,
        transkrip: true,
        bukti_lunas_spp: true,
        lembar_komprehensif: true,
        bukti_hafalan: true,
      },
      statusVerifikasi: 'disetujui', // 'menunggu' | 'disetujui' | 'dikembalikan'
      catatanAdmin: '',
    },
    {
      id: 'REG-002',
      nim: '60900121005',
      jenisUjian: 'hasil',
      tanggalDaftar: '2026-06-12',
      berkas: {
        sk_pembimbing: true,
        sk_sempro: true,
        berita_acara_sempro: true,
        draft_hasil: true,
        kartu_bimbingan_hasil: true,
      },
      statusVerifikasi: 'disetujui',
      catatanAdmin: '',
    },
  ],

  SEED_SCHEDULES: [
    {
      id: 'SCH-001',
      registrationId: 'REG-002',
      nim: '60900121005',
      jenisUjian: 'hasil',
      tanggal: '2026-06-16',
      jamMulai: '08:00',
      jamSelesai: '10:00',
      ruangan: 'Ruang Seminar Lt. 3, Gedung A',
      ketuaSidang: 'Faisal Akib, S.Kom., M.Kom.',
      sekretaris: 'Rismawati, S.Kom., M.Kom.',
      penguji1: 'Dr. Mustari Lamada, S.Pd., M.T.',
      penguji2: 'Nur Afif, S.T., M.T.',
      statusKaprodi: 'disetujui', // 'menunggu' | 'disetujui' | 'ditolak'
      catatan: 'Mohon mahasiswa hadir 30 menit sebelum ujian dimulai.',
    },
  ],

  // ══════════════════════════════════════
  // INITIALIZATION
  // ══════════════════════════════════════
  init() {
    if (!localStorage.getItem(this.KEYS.STUDENTS)) {
      localStorage.setItem(this.KEYS.STUDENTS, JSON.stringify(this.SEED_STUDENTS));
    }
    if (!localStorage.getItem(this.KEYS.REGISTRATIONS)) {
      localStorage.setItem(this.KEYS.REGISTRATIONS, JSON.stringify(this.SEED_REGISTRATIONS));
    }
    if (!localStorage.getItem(this.KEYS.SCHEDULES)) {
      localStorage.setItem(this.KEYS.SCHEDULES, JSON.stringify(this.SEED_SCHEDULES));
    }
  },

  /** Reset semua data ke seed awal */
  resetAll() {
    localStorage.removeItem(this.KEYS.STUDENTS);
    localStorage.removeItem(this.KEYS.REGISTRATIONS);
    localStorage.removeItem(this.KEYS.SCHEDULES);
    localStorage.removeItem(this.KEYS.SESSION);
    this.init();
  },

  // ══════════════════════════════════════
  // SESSION
  // ══════════════════════════════════════
  setSession(role, identifier) {
    const session = { role, identifier, loginTime: new Date().toISOString() };
    localStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
  },

  getSession() {
    const data = localStorage.getItem(this.KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  },

  clearSession() {
    localStorage.removeItem(this.KEYS.SESSION);
  },

  // ══════════════════════════════════════
  // STUDENTS (CRUD)
  // ══════════════════════════════════════
  getStudents() {
    const data = localStorage.getItem(this.KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },

  getStudent(nim) {
    return this.getStudents().find(s => s.nim === nim) || null;
  },

  updateStudent(nim, updates) {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.nim === nim);
    if (idx === -1) return false;
    students[idx] = { ...students[idx], ...updates };
    localStorage.setItem(this.KEYS.STUDENTS, JSON.stringify(students));
    return true;
  },

  /** Dapatkan jenis ujian berikutnya berdasarkan status */
  getNextExamType(nim) {
    const student = this.getStudent(nim);
    if (!student) return null;
    switch (student.statusUjian) {
      case 'belum': return 'proposal';
      case 'proposal_selesai': return 'hasil';
      case 'hasil_selesai': return 'munaqasyah';
      default: return null;
    }
  },

  // ══════════════════════════════════════
  // REGISTRATIONS (CRUD)
  // ══════════════════════════════════════
  getRegistrations() {
    const data = localStorage.getItem(this.KEYS.REGISTRATIONS);
    return data ? JSON.parse(data) : [];
  },

  getRegistration(id) {
    return this.getRegistrations().find(r => r.id === id) || null;
  },

  getRegistrationsByNim(nim) {
    return this.getRegistrations().filter(r => r.nim === nim);
  },

  getRegistrationsByStatus(status) {
    return this.getRegistrations().filter(r => r.statusVerifikasi === status);
  },

  /** Cek apakah mahasiswa punya pendaftaran aktif (menunggu/disetujui) */
  hasActiveRegistration(nim) {
    return this.getRegistrations().some(
      r => r.nim === nim && (r.statusVerifikasi === 'menunggu' || r.statusVerifikasi === 'disetujui')
    );
  },

  addRegistration(registration) {
    const regs = this.getRegistrations();
    registration.id = 'REG-' + String(regs.length + 1).padStart(3, '0');
    registration.tanggalDaftar = new Date().toISOString().split('T')[0];
    registration.statusVerifikasi = 'menunggu';
    registration.catatanAdmin = '';
    regs.push(registration);
    localStorage.setItem(this.KEYS.REGISTRATIONS, JSON.stringify(regs));
    return registration;
  },

  updateRegistration(id, updates) {
    const regs = this.getRegistrations();
    const idx = regs.findIndex(r => r.id === id);
    if (idx === -1) return false;
    regs[idx] = { ...regs[idx], ...updates };
    localStorage.setItem(this.KEYS.REGISTRATIONS, JSON.stringify(regs));
    return true;
  },

  // ══════════════════════════════════════
  // SCHEDULES (CRUD)
  // ══════════════════════════════════════
  getSchedules() {
    const data = localStorage.getItem(this.KEYS.SCHEDULES);
    return data ? JSON.parse(data) : [];
  },

  getSchedulesByStatus(status) {
    return this.getSchedules().filter(s => s.statusKaprodi === status);
  },

  addSchedule(schedule) {
    const schedules = this.getSchedules();
    schedule.id = 'SCH-' + String(schedules.length + 1).padStart(3, '0');
    schedule.statusKaprodi = 'menunggu';
    schedules.push(schedule);
    localStorage.setItem(this.KEYS.SCHEDULES, JSON.stringify(schedules));
    return schedule;
  },

  updateSchedule(id, updates) {
    const schedules = this.getSchedules();
    const idx = schedules.findIndex(s => s.id === id);
    if (idx === -1) return false;
    schedules[idx] = { ...schedules[idx], ...updates };
    localStorage.setItem(this.KEYS.SCHEDULES, JSON.stringify(schedules));
    return true;
  },

  // ══════════════════════════════════════
  // HELPER: Label & Format
  // ══════════════════════════════════════
  getExamLabel(type) {
    const labels = {
      proposal: 'Ujian Proposal',
      hasil: 'Seminar Hasil',
      munaqasyah: 'Munaqasyah',
    };
    return labels[type] || type;
  },

  getStatusLabel(status) {
    const labels = {
      menunggu: '⏳ Menunggu',
      disetujui: '✓ Disetujui',
      dikembalikan: '✗ Dikembalikan',
      ditolak: '✗ Ditolak',
    };
    return labels[status] || status;
  },

  getStatusColor(status) {
    const colors = {
      menunggu: { bg: 'bg-amber-100', text: 'text-amber-700' },
      disetujui: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      dikembalikan: { bg: 'bg-rose-100', text: 'text-rose-700' },
      ditolak: { bg: 'bg-rose-100', text: 'text-rose-700' },
    };
    return colors[status] || { bg: 'bg-slate-100', text: 'text-slate-700' };
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = new Date(dateStr);
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  },

  /** Daftar berkas per jenis ujian */
  getBerkasRequirements(jenisUjian) {
    const requirements = {
      proposal: [
        { key: 'kartu_kontrol', label: 'Kartu Kontrol / Lembar Konsultasi' },
        { key: 'naskah_proposal', label: 'Naskah Proposal (PDF)' },
        { key: 'persetujuan_pemb1', label: 'Bukti Persetujuan Pembimbing 1 (PDF)' },
        { key: 'persetujuan_pemb2', label: 'Bukti Persetujuan Pembimbing 2 (PDF)' },
        { key: 'transkrip', label: 'Transkrip Terakhir (PDF)' },
        { key: 'sk_ujian', label: 'SK Ujian (PDF)' },
      ],
      hasil: [
        { key: 'sk_pembimbing', label: 'SK Pembimbing (PDF)' },
        { key: 'sk_sempro', label: 'SK Pelaksanaan Ujian Proposal (PDF)' },
        { key: 'berita_acara_sempro', label: 'Berita Acara Ujian Proposal (PDF)' },
        { key: 'draft_hasil', label: 'Draft Hasil Penelitian (PDF)' },
        { key: 'kartu_bimbingan_hasil', label: 'Kartu Bimbingan (PDF)' },
      ],
      munaqasyah: [
        { key: 'sk_seminar_hasil', label: 'SK Pelaksanaan Ujian Seminar Hasil (PDF)' },
        { key: 'berita_acara_hasil', label: 'Berita Acara Seminar Hasil (PDF)' },
        { key: 'naskah_skripsi', label: 'Naskah Skripsi Final (PDF)' },
        { key: 'kartu_bimbingan', label: 'Kartu Bimbingan (PDF)' },
        { key: 'sertifikat', label: 'Sertifikat Kompetensi / Pendukung (PDF)' },
        { key: 'transkrip', label: 'Transkrip Nilai Sementara (Smt 1-7) (PDF)' },
        { key: 'bukti_lunas_spp', label: 'Bukti Lunas Pembayaran SPP (PDF)' },
        { key: 'lembar_komprehensif', label: 'Lembar Ujian Komprehensif (PDF)' },
        { key: 'bukti_hafalan', label: 'Bukti Hafalan (PDF)' },
      ],
    };
    return requirements[jenisUjian] || [];
  },
};

// Auto-init saat file dimuat
SidanusDB.init();
