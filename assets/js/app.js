/**
 * SIDANUS — Application Engine
 * Logika utama untuk semua halaman.
 * Membutuhkan data.js dimuat terlebih dahulu.
 */

const SidanusApp = {

  // ══════════════════════════════════════
  // LOGIN
  // ══════════════════════════════════════
  initLogin() {
    const form = document.querySelector('form');
    if (!form) return;

    // Redirect berdasarkan role
    const roleRedirects = {
      mahasiswa: 'mahasiswa/dashboard.html',
      admin: 'admin/dashboard.html',
      kaprodi: 'kaprodi/dashboard.html',
      penguji: 'penguji/dashboard.html',
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = document.getElementById('role')?.value;
      const username = document.getElementById('username')?.value?.trim();

      if (!role) {
        alert('Silakan pilih role terlebih dahulu.');
        return;
      }

      // Untuk mahasiswa, cari berdasarkan NIM
      if (role === 'mahasiswa') {
        const nim = username || '60900121034'; // Default ke Ahmad Fauzi
        const student = SidanusDB.getStudent(nim);
        if (!student) {
          alert('NIM tidak ditemukan. Gunakan salah satu NIM berikut:\n• 60900121034 (Ahmad Fauzi)\n• 60900120057 (M. Rizal)\n• 60900120091 (Zainal)\n• 60900121005 (Fatimah)\n• 60900121019 (Nur Hikmah)');
          return;
        }
        SidanusDB.setSession('mahasiswa', nim);
      } else {
        SidanusDB.setSession(role, username || role);
      }

      window.location.href = roleRedirects[role];
    });

    // Demo quick login buttons
    document.querySelectorAll('.demo-badge').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const href = btn.getAttribute('href');
        let role = 'mahasiswa';
        let identifier = '60900121034';

        if (href.includes('admin')) { role = 'admin'; identifier = 'admin'; }
        else if (href.includes('kaprodi')) { role = 'kaprodi'; identifier = 'kaprodi'; }
        else if (href.includes('penguji')) { role = 'penguji'; identifier = 'penguji'; }

        SidanusDB.setSession(role, identifier);
        window.location.href = href;
      });
    });
  },

  // ══════════════════════════════════════
  // MAHASISWA — Dashboard
  // ══════════════════════════════════════
  initMahasiswaDashboard() {
    const session = SidanusDB.getSession();
    if (!session || session.role !== 'mahasiswa') return;

    const student = SidanusDB.getStudent(session.identifier);
    if (!student) return;

    // Update nama di sidebar
    this._updateSidebarInfo(student);

    // Cek apakah mahasiswa punya pendaftaran aktif
    const regs = SidanusDB.getRegistrationsByNim(student.nim);
    const activeReg = regs.find(r => r.statusVerifikasi === 'menunggu' || r.statusVerifikasi === 'disetujui');

    // Update status cards jika ada
    this._updateDashboardCards(student, regs);

    // Cek akses daftar ujian
    const daftarLink = document.querySelector('a[href="daftar-ujian.html"]');
    if (daftarLink && activeReg) {
      // Sudah punya pendaftaran aktif — disable
      daftarLink.classList.add('opacity-50', 'pointer-events-none');
      daftarLink.setAttribute('title', 'Anda sudah memiliki pendaftaran aktif');
    }

    // Update timeline tracking
    this._updateTimeline(student, regs);

    // Update jadwal section
    this._updateJadwalSection(student);
  },

  _updateSidebarInfo(student) {
    // Update sidebar name
    const sidebarName = document.querySelector('.bg-emerald-50 .font-bold.text-slate-800');
    if (sidebarName) sidebarName.textContent = student.nama;

    const sidebarNim = document.querySelector('.bg-emerald-50 .text-xs.text-slate-500');
    if (sidebarNim) sidebarNim.textContent = `${student.nim} · Angkatan ${student.angkatan}`;

    // Update header avatar
    const avatar = document.querySelector('header .bg-emerald-600.rounded-full');
    if (avatar) {
      const initials = student.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      avatar.textContent = initials;
    }
  },

  _updateDashboardCards(student, regs) {
    const nextExam = SidanusDB.getNextExamType(student.nim);
    const latestReg = regs.length > 0 ? regs[regs.length - 1] : null;

    // Find and update status card elements if they exist
    const statusCards = document.querySelectorAll('.section-card .grid > div, .grid .bg-white.rounded-2xl');
    // We'll rely on the existing markup — update text content where possible
  },

  _updateTimeline(student, regs) {
    // Timeline will be rendered differently based on student status
    const nextExam = SidanusDB.getNextExamType(student.nim);
    const latestReg = regs.length > 0 ? regs[regs.length - 1] : null;

    // Find the welcome banner and update it
    const welcomeBanner = document.querySelector('.bg-emerald-600, .bg-gradient-to-r');
    if (welcomeBanner) {
      const nameEl = welcomeBanner.querySelector('h2, .text-lg, .text-xl');
      if (nameEl) nameEl.innerHTML = `Selamat Datang, <span class="font-extrabold">${student.nama.split(' ')[0]}!</span>`;

      const statusEl = welcomeBanner.querySelector('p');
      if (statusEl) {
        if (latestReg) {
          statusEl.textContent = `Status: ${SidanusDB.getExamLabel(latestReg.jenisUjian)} — ${SidanusDB.getStatusLabel(latestReg.statusVerifikasi)}`;
        } else if (nextExam) {
          statusEl.textContent = `Anda dapat mendaftar ${SidanusDB.getExamLabel(nextExam)}. Silakan lengkapi berkas.`;
        }
      }
    }
  },

  _updateJadwalSection(student) {
    const schedules = SidanusDB.getSchedules().filter(s => s.nim === student.nim);
    // If there are schedules, we can update the jadwal section in dashboard
    // For now, leave existing UI as-is if no dynamic container found
  },

  // ══════════════════════════════════════
  // MAHASISWA — Daftar Ujian
  // ══════════════════════════════════════
  initDaftarUjian() {
    const session = SidanusDB.getSession();
    if (!session || session.role !== 'mahasiswa') return;

    const student = SidanusDB.getStudent(session.identifier);
    if (!student) return;

    // Update sidebar
    this._updateSidebarInfo(student);

    // Fill form data pribadi
    this._fillStudentForm(student);

    // Lock exam type based on status
    this._lockExamType(student);

    // Handle form submission
    this._handleRegistrationSubmit(student);

    // File upload UI feedback
    this._initFileUploadUI();
  },

  _fillStudentForm(student) {
    const fields = {
      nim: student.nim,
      nama: student.nama,
      prodi: student.prodi,
      semester: student.semester,
      email: student.email,
      hp: student.hp,
      judul: student.judul,
      abstrak: student.abstrak,
      pembimbing1: student.pembimbing1,
      pembimbing2: student.pembimbing2,
    };

    for (const [id, value] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (el) el.value = value;
    }
  },

  _lockExamType(student) {
    const nextExam = SidanusDB.getNextExamType(student.nim);
    if (!nextExam) {
      // Semua tahapan selesai
      const main = document.querySelector('main');
      if (main) {
        main.innerHTML = `
          <div class="section-card text-center py-12">
            <svg class="w-16 h-16 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-xl font-bold text-slate-800 mb-2">Semua Tahapan Ujian Selesai</h2>
            <p class="text-sm text-slate-500">Anda telah menyelesaikan seluruh tahapan ujian. Selamat!</p>
            <a href="dashboard.html" class="inline-block mt-6 text-sm font-semibold text-emerald-600 hover:underline">← Kembali ke Dashboard</a>
          </div>`;
      }
      return;
    }

    // Cek apakah sudah punya pendaftaran aktif
    if (SidanusDB.hasActiveRegistration(student.nim)) {
      const main = document.querySelector('main');
      if (main) {
        main.innerHTML = `
          <div class="section-card text-center py-12">
            <svg class="w-16 h-16 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-xl font-bold text-slate-800 mb-2">Pendaftaran Sedang Diproses</h2>
            <p class="text-sm text-slate-500">Anda sudah memiliki pendaftaran ujian yang sedang menunggu verifikasi atau telah disetujui. Silakan pantau statusnya di Dashboard.</p>
            <a href="dashboard.html" class="inline-block mt-6 text-sm font-semibold text-emerald-600 hover:underline">← Kembali ke Dashboard</a>
          </div>`;
      }
      return;
    }

    // Lock radio buttons
    const radioMap = {
      proposal: 'ujian-proposal',
      hasil: 'ujian-hasil',
      munaqasyah: 'ujian-munaqasyah',
    };

    // Uncheck all, then check the correct one
    Object.values(radioMap).forEach(id => {
      const radio = document.getElementById(id);
      if (radio) radio.checked = false;
    });

    const targetRadio = document.getElementById(radioMap[nextExam]);
    if (targetRadio) targetRadio.checked = true;

    // Disable clicking on other cards
    const allLabels = document.querySelectorAll('.ujian-card');
    allLabels.forEach(label => {
      const forAttr = label.getAttribute('for');
      if (forAttr !== radioMap[nextExam]) {
        label.classList.add('opacity-40', 'pointer-events-none');
        label.style.cursor = 'not-allowed';
        // Add a lock icon
        const lockBadge = document.createElement('span');
        lockBadge.className = 'text-xs text-slate-400 mt-1 block';
        lockBadge.textContent = '🔒 Belum tersedia';
        label.appendChild(lockBadge);
      } else {
        // Add active indicator
        const activeBadge = document.createElement('span');
        activeBadge.className = 'text-xs text-emerald-600 font-bold mt-1 block';
        activeBadge.textContent = '✓ Tahapan saat ini';
        label.appendChild(activeBadge);
      }
    });

    // Update the info banner
    const infoBanner = document.querySelector('.bg-blue-50');
    if (infoBanner) {
      const title = infoBanner.querySelector('.font-semibold');
      const desc = infoBanner.querySelector('.text-xs.text-blue-600');
      if (title) title.textContent = `Pendaftaran ${SidanusDB.getExamLabel(nextExam)}`;
      if (desc) desc.textContent = `Jenis ujian Anda telah ditentukan secara otomatis berdasarkan status akademik. Silakan lengkapi berkas persyaratan di bawah ini. Format file: PDF (maks. 5 MB/berkas).`;
    }
  },

  _handleRegistrationSubmit(student) {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate checkboxes
      const cb1 = document.getElementById('konfirmasi1');
      const cb2 = document.getElementById('konfirmasi2');
      if (cb1 && !cb1.checked) {
        alert('Silakan centang pernyataan kebenaran data.');
        return;
      }
      if (cb2 && !cb2.checked) {
        alert('Silakan centang pernyataan persetujuan pemrosesan.');
        return;
      }

      const nextExam = SidanusDB.getNextExamType(student.nim);
      if (!nextExam) return;

      // Collect uploaded files (check which ones have been uploaded)
      const berkasReqs = SidanusDB.getBerkasRequirements(nextExam);
      const berkas = {};
      let allUploaded = true;

      // Check file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      const uploadedFiles = new Set();
      fileInputs.forEach(input => {
        if (input.files && input.files.length > 0) {
          uploadedFiles.add(input.name || input.id);
        }
      });

      // Also check badges that say "Sudah Upload" (from the UI feedback)
      const badges = document.querySelectorAll('.bg-emerald-100.text-emerald-700');
      
      // For demo purposes, mark all berkas keys — in a real system this would check actual uploads
      berkasReqs.forEach(req => {
        berkas[req.key] = true; // Simulated: assume all uploaded for demo
      });

      // Create registration
      const registration = {
        nim: student.nim,
        jenisUjian: nextExam,
        berkas: berkas,
      };

      SidanusDB.addRegistration(registration);

      // Show success and redirect
      alert(`✅ Pendaftaran ${SidanusDB.getExamLabel(nextExam)} berhasil dikirim!\n\nPendaftaran Anda akan diverifikasi oleh Admin Prodi. Silakan pantau statusnya di Dashboard.`);
      window.location.href = 'dashboard.html';
    });
  },

  _initFileUploadUI() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.addEventListener('change', function (e) {
        const fileName = e.target.files[0]?.name;
        if (fileName) {
          const dropZone = this.closest('.file-drop');
          if (dropZone) {
            const textElement = dropZone.querySelector('p');
            if (textElement) {
              textElement.textContent = fileName;
              textElement.classList.remove('text-slate-500');
              textElement.classList.add('text-emerald-600', 'font-semibold');
            }
            const label = dropZone.querySelector('label');
            if (label) {
              label.textContent = 'Ganti File';
              label.classList.replace('bg-emerald-100', 'bg-slate-100');
              label.classList.replace('text-emerald-700', 'text-slate-600');
              label.classList.replace('hover:bg-emerald-200', 'hover:bg-slate-200');
            }
          }
          const details = this.closest('details');
          if (details) {
            const badge = details.querySelector('summary .bg-amber-100');
            if (badge) {
              badge.textContent = 'Sudah Upload';
              badge.classList.replace('bg-amber-100', 'bg-emerald-100');
              badge.classList.replace('text-amber-700', 'text-emerald-700');
            }
          }
        }
      });
    });
  },

  // ══════════════════════════════════════
  // ADMIN — Dashboard Verifikasi
  // ══════════════════════════════════════
  initAdminDashboard() {
    const session = SidanusDB.getSession();
    if (!session || session.role !== 'admin') return;

    this._renderAdminTable();
    this._initAdminModal();
  },

  _renderAdminTable() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    const regs = SidanusDB.getRegistrations();
    tbody.innerHTML = '';

    if (regs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-sm text-slate-400">Belum ada pendaftaran masuk.</td></tr>`;
      return;
    }

    regs.forEach((reg, idx) => {
      const student = SidanusDB.getStudent(reg.nim);
      if (!student) return;

      const statusColor = SidanusDB.getStatusColor(reg.statusVerifikasi);
      const berkasReqs = SidanusDB.getBerkasRequirements(reg.jenisUjian);
      const berkasCount = berkasReqs.length;
      const uploadedCount = Object.values(reg.berkas || {}).filter(Boolean).length;
      const allComplete = uploadedCount >= berkasCount;

      let rowBg = 'hover:bg-slate-50/80';
      if (reg.statusVerifikasi === 'disetujui') rowBg = 'hover:bg-slate-50/80 bg-emerald-50/40';
      else if (reg.statusVerifikasi === 'dikembalikan') rowBg = 'hover:bg-slate-50/80 bg-rose-50/40';

      // Status kontrol button
      let kontrolBtn = '';
      if (reg.statusVerifikasi === 'disetujui') {
        const nextStep = this._getNextStepLabel(student, reg);
        if (nextStep) {
          kontrolBtn = `<button onclick="SidanusApp.markExamComplete('${reg.nim}', '${reg.jenisUjian}')" 
            class="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors whitespace-nowrap mt-1">
            ${nextStep}
          </button>`;
        }
      }

      const tr = document.createElement('tr');
      tr.className = `${rowBg} transition-colors`;
      tr.innerHTML = `
        <td class="px-5 py-4 text-slate-400 font-medium">${String(idx + 1).padStart(2, '0')}</td>
        <td class="px-5 py-4">
          <p class="font-bold text-slate-800 text-sm">${student.nama}</p>
          <p class="text-xs text-slate-500">${student.nim}</p>
        </td>
        <td class="px-5 py-4">
          <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
            reg.jenisUjian === 'munaqasyah' ? 'bg-emerald-100 text-emerald-700' :
            reg.jenisUjian === 'hasil' ? 'bg-teal-100 text-teal-700' :
            'bg-blue-100 text-blue-700'
          }">${SidanusDB.getExamLabel(reg.jenisUjian)}</span>
        </td>
        <td class="px-5 py-4 text-xs text-slate-600">${SidanusDB.formatDate(reg.tanggalDaftar)}</td>
        <td class="px-5 py-4">
          <span class="text-xs font-semibold ${allComplete ? 'text-emerald-600' : 'text-amber-600'}">
            ${allComplete ? '✓ Semua Lengkap' : `✗ Kurang ${berkasCount - uploadedCount} berkas`}
          </span>
        </td>
        <td class="px-5 py-4">
          <span class="text-xs font-bold px-2.5 py-1 rounded-full ${statusColor.bg} ${statusColor.text}">
            ${SidanusDB.getStatusLabel(reg.statusVerifikasi)}
          </span>
        </td>
        <td class="px-5 py-4">
          <div class="flex flex-col gap-1">
            ${reg.statusVerifikasi === 'menunggu' ? `
              <button onclick="SidanusApp.openVerifyModal('${reg.id}')" 
                class="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                🔍 Periksa Berkas
              </button>
            ` : reg.statusVerifikasi === 'disetujui' ? `
              <span class="text-xs text-emerald-600 font-semibold">✓ Sudah Diverifikasi</span>
            ` : `
              <span class="text-xs text-rose-600 font-semibold">✗ Dikembalikan</span>
            `}
            ${kontrolBtn}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Update stats
    this._updateAdminStats(regs);
  },

  _getNextStepLabel(student, reg) {
    if (reg.jenisUjian === 'proposal' && student.statusUjian === 'belum') {
      return '✓ Proposal Selesai';
    }
    if (reg.jenisUjian === 'hasil' && student.statusUjian === 'proposal_selesai') {
      return '✓ Hasil Selesai';
    }
    return null;
  },

  markExamComplete(nim, jenisUjian) {
    const labels = {
      proposal: 'Proposal Selesai',
      hasil: 'Hasil Selesai',
    };
    const newStatus = {
      proposal: 'proposal_selesai',
      hasil: 'hasil_selesai',
    };

    if (!newStatus[jenisUjian]) return;

    const student = SidanusDB.getStudent(nim);
    if (!confirm(`Apakah Anda yakin ingin menandai mahasiswa "${student.nama}" sebagai ${labels[jenisUjian]}?\n\nIni akan membuka akses pendaftaran ujian tahap berikutnya untuk mahasiswa tersebut.`)) return;

    SidanusDB.updateStudent(nim, { statusUjian: newStatus[jenisUjian] });
    alert(`✅ Status mahasiswa berhasil diperbarui menjadi "${labels[jenisUjian]}".`);
    this._renderAdminTable();
  },

  _updateAdminStats(regs) {
    const total = regs.length;
    const menunggu = regs.filter(r => r.statusVerifikasi === 'menunggu').length;
    const disetujui = regs.filter(r => r.statusVerifikasi === 'disetujui').length;

    // Try to update stat cards if they exist
    const statCards = document.querySelectorAll('.text-3xl, .text-2xl');
    // This depends on existing DOM structure — we'll update if found
  },

  _initAdminModal() {
    // Modal open/close functions are already defined in global scope below
  },

  openVerifyModal(regId) {
    const reg = SidanusDB.getRegistration(regId);
    if (!reg) return;

    const student = SidanusDB.getStudent(reg.nim);
    if (!student) return;

    const modal = document.getElementById('fileModal');
    if (!modal) return;

    // Update modal header
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = 'Detail Berkas Mahasiswa';

    const modalSubtitle = modal.querySelector('.text-xs.text-slate-500');
    if (modalSubtitle) modalSubtitle.textContent = `${student.nama} · ${student.nim}`;

    // Update modal body with berkas list
    const berkasContainer = modal.querySelector('.space-y-3');
    if (berkasContainer) {
      const berkasReqs = SidanusDB.getBerkasRequirements(reg.jenisUjian);
      berkasContainer.innerHTML = berkasReqs.map((req, i) => `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors gap-3 bg-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800">${req.label}</p>
              <p class="text-xs text-slate-500 font-medium mt-0.5">${reg.berkas[req.key] ? 'Menunggu Pengecekan · PDF' : '✗ Belum Diunggah'}</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button class="text-xs font-bold text-slate-600 bg-white hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5 shadow-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Buka
            </button>
            <div class="flex bg-slate-100/80 rounded-lg p-1 border border-slate-200">
              <label class="cursor-pointer">
                <input type="radio" name="doc${i}_status" class="peer sr-only" value="valid">
                <span class="px-3 py-1.5 text-xs font-bold text-slate-500 rounded-md peer-checked:bg-emerald-500 peer-checked:text-white transition-colors block">✓ Valid</span>
              </label>
              <label class="cursor-pointer">
                <input type="radio" name="doc${i}_status" class="peer sr-only" value="tolak">
                <span class="px-3 py-1.5 text-xs font-bold text-slate-500 rounded-md peer-checked:bg-rose-500 peer-checked:text-white transition-colors block">✗ Tolak</span>
              </label>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Update action buttons
    const approveBtn = modal.querySelector('.bg-emerald-600, [class*="bg-emerald"]');
    const rejectBtn = modal.querySelector('.bg-rose-600, [class*="bg-rose"]');

    // Wire up approve/reject from modal footer
    const modalFooter = modal.querySelector('.border-t.border-slate-100');
    if (modalFooter) {
      modalFooter.innerHTML = `
        <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div class="flex-1">
            <input type="text" id="modal-catatan" placeholder="Catatan revisi (opsional)..."
              class="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div class="flex gap-2">
            <button onclick="SidanusApp.rejectRegistration('${regId}')"
              class="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-lg border border-rose-200 transition-colors">
              ✗ Kembalikan
            </button>
            <button onclick="SidanusApp.approveRegistration('${regId}')"
              class="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg shadow-sm transition-colors">
              ✓ Setujui
            </button>
          </div>
        </div>
      `;
    }

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  approveRegistration(regId) {
    SidanusDB.updateRegistration(regId, { statusVerifikasi: 'disetujui' });
    this._closeModal();
    alert('✅ Berkas mahasiswa telah disetujui.');
    this._renderAdminTable();
  },

  rejectRegistration(regId) {
    const catatan = document.getElementById('modal-catatan')?.value || '';
    SidanusDB.updateRegistration(regId, {
      statusVerifikasi: 'dikembalikan',
      catatanAdmin: catatan,
    });
    this._closeModal();
    alert('Berkas dikembalikan kepada mahasiswa untuk dilengkapi.');
    this._renderAdminTable();
  },

  _closeModal() {
    const modal = document.getElementById('fileModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  },

  // ══════════════════════════════════════
  // ADMIN — Penjadwalan
  // ══════════════════════════════════════
  initAdminPenjadwalan() {
    const session = SidanusDB.getSession();
    if (!session || session.role !== 'admin') return;

    this._renderPendingQueue();
    this._handleScheduleSubmit();
    this._renderScheduleTable();
  },

  _renderPendingQueue() {
    const container = document.querySelector('.space-y-3');
    if (!container || !container.closest('section')?.querySelector('h2')?.textContent?.includes('Antrian')) return;

    const approvedRegs = SidanusDB.getRegistrationsByStatus('disetujui');
    // Filter only those that don't have a schedule yet
    const scheduledNims = new Set(SidanusDB.getSchedules().map(s => s.nim));
    const pending = approvedRegs.filter(r => !scheduledNims.has(r.nim));

    if (pending.length === 0) {
      container.innerHTML = `<div class="text-center py-6 text-sm text-slate-400">Tidak ada mahasiswa yang menunggu penjadwalan.</div>`;
      return;
    }

    container.innerHTML = pending.map((reg, idx) => {
      const student = SidanusDB.getStudent(reg.nim);
      if (!student) return '';

      const isFirst = idx === 0;
      return `
        <div class="${isFirst ? 'border-2 border-blue-400 bg-blue-50' : 'border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/30'} rounded-xl p-4 cursor-pointer transition-colors"
             onclick="SidanusApp.selectForScheduling('${reg.id}', '${reg.nim}')">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs ${
                  reg.jenisUjian === 'munaqasyah' ? 'bg-emerald-100 text-emerald-700' :
                  reg.jenisUjian === 'hasil' ? 'bg-teal-100 text-teal-700' :
                  'bg-blue-100 text-blue-700'
                } font-bold px-2 py-0.5 rounded-full">${SidanusDB.getExamLabel(reg.jenisUjian)}</span>
                ${isFirst ? '<span class="text-xs font-bold text-blue-700">▶ Sedang Dijadwalkan</span>' : ''}
              </div>
              <p class="font-bold text-slate-800">${student.nama}</p>
              <p class="text-xs text-slate-500">${student.nim}</p>
              <p class="text-xs text-slate-600 mt-1 max-w-sm italic">"${student.judul}"</p>
            </div>
            <span class="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full">Perlu Dijadwalkan</span>
          </div>
        </div>
      `;
    }).join('');
  },

  selectForScheduling(regId, nim) {
    const student = SidanusDB.getStudent(nim);
    const reg = SidanusDB.getRegistration(regId);
    if (!student || !reg) return;

    // Fill the form
    const fields = {
      'nim-s': student.nim,
      'nama-s': student.nama,
      'judul-s': student.judul,
      'jenis-s': SidanusDB.getExamLabel(reg.jenisUjian),
      'semester-s': student.semester,
    };

    for (const [id, value] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (el) el.value = value;
    }

    // Store selected reg ID
    const form = document.querySelector('form');
    if (form) form.dataset.regId = regId;
    if (form) form.dataset.nim = nim;
  },

  _handleScheduleSubmit() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const regId = form.dataset.regId;
      const nim = form.dataset.nim || document.getElementById('nim-s')?.value;

      if (!nim) {
        alert('Silakan pilih mahasiswa dari antrian terlebih dahulu.');
        return;
      }

      const reg = regId ? SidanusDB.getRegistration(regId) : null;

      const schedule = {
        registrationId: regId || '',
        nim: nim,
        jenisUjian: reg ? reg.jenisUjian : 'proposal',
        tanggal: document.getElementById('tgl-ujian')?.value || '',
        jamMulai: document.getElementById('jam-mulai')?.value || '',
        jamSelesai: document.getElementById('jam-selesai')?.value || '',
        ruangan: document.getElementById('ruangan')?.value || '',
        ketuaSidang: document.getElementById('ketua-sidang')?.value || '',
        sekretaris: document.getElementById('sekretaris')?.value || '',
        penguji1: document.getElementById('penguji1')?.value || '',
        penguji2: document.getElementById('penguji2')?.value || '',
        catatan: document.querySelector('textarea[name="catatan"]')?.value || '',
      };

      if (!schedule.tanggal || !schedule.jamMulai) {
        alert('Silakan lengkapi tanggal dan waktu ujian.');
        return;
      }

      SidanusDB.addSchedule(schedule);
      alert('✅ Jadwal ujian berhasil diajukan ke Kaprodi untuk disetujui.');
      
      // Refresh
      this._renderPendingQueue();
      this._renderScheduleTable();
    });
  },

  _renderScheduleTable() {
    const table = document.querySelector('table');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const schedules = SidanusDB.getSchedules();
    tbody.innerHTML = '';

    if (schedules.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-center text-sm text-slate-400">Belum ada jadwal.</td></tr>`;
      return;
    }

    schedules.forEach(sch => {
      const student = SidanusDB.getStudent(sch.nim);
      if (!student) return;

      const statusColor = sch.statusKaprodi === 'disetujui' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
      const statusLabel = sch.statusKaprodi === 'disetujui' ? '✓ Disetujui Kaprodi' : '⏳ Menunggu Kaprodi';

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50';
      tr.innerHTML = `
        <td class="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">${SidanusDB.formatDate(sch.tanggal)}</td>
        <td class="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">${sch.jamMulai} – ${sch.jamSelesai}</td>
        <td class="px-4 py-3">
          <p class="font-semibold text-slate-700 text-xs">${student.nama}</p>
          <p class="text-xs text-slate-400">${student.nim}</p>
        </td>
        <td class="px-4 py-3"><span class="text-xs ${
          sch.jenisUjian === 'munaqasyah' ? 'bg-emerald-100 text-emerald-700' :
          sch.jenisUjian === 'hasil' ? 'bg-teal-100 text-teal-700' :
          'bg-blue-100 text-blue-700'
        } font-semibold px-2 py-0.5 rounded-full">${SidanusDB.getExamLabel(sch.jenisUjian)}</span></td>
        <td class="px-4 py-3 text-xs text-slate-600">${sch.ruangan}</td>
        <td class="px-4 py-3"><span class="text-xs ${statusColor} font-semibold px-2 py-0.5 rounded-full">${statusLabel}</span></td>
      `;
      tbody.appendChild(tr);
    });
  },

  // ══════════════════════════════════════
  // KAPRODI — Dashboard
  // ══════════════════════════════════════
  initKaprodiDashboard() {
    const session = SidanusDB.getSession();
    if (!session || session.role !== 'kaprodi') return;

    this._renderKaprodiTable();
  },

  _renderKaprodiTable() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    const schedules = SidanusDB.getSchedules();
    tbody.innerHTML = '';

    if (schedules.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-6 text-center text-sm text-slate-400">Belum ada jadwal yang perlu disetujui.</td></tr>`;
      return;
    }

    schedules.forEach(sch => {
      const student = SidanusDB.getStudent(sch.nim);
      if (!student) return;

      const isPending = sch.statusKaprodi === 'menunggu';

      const tr = document.createElement('tr');
      tr.className = `hover:bg-slate-50 ${isPending ? 'bg-amber-50/30' : ''}`;
      tr.innerHTML = `
        <td class="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">${SidanusDB.formatDate(sch.tanggal)}</td>
        <td class="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">${sch.jamMulai} – ${sch.jamSelesai}</td>
        <td class="px-4 py-3">
          <p class="font-semibold text-slate-700 text-xs">${student.nama}</p>
          <p class="text-xs text-slate-400">${student.nim}</p>
        </td>
        <td class="px-4 py-3"><span class="text-xs ${
          sch.jenisUjian === 'munaqasyah' ? 'bg-emerald-100 text-emerald-700' :
          sch.jenisUjian === 'hasil' ? 'bg-teal-100 text-teal-700' :
          'bg-blue-100 text-blue-700'
        } font-semibold px-2 py-0.5 rounded-full">${SidanusDB.getExamLabel(sch.jenisUjian)}</span></td>
        <td class="px-4 py-3 text-xs text-slate-600">${sch.ruangan}</td>
        <td class="px-4 py-3">
          <span class="text-xs font-bold px-2.5 py-1 rounded-full ${sch.statusKaprodi === 'disetujui' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
            ${sch.statusKaprodi === 'disetujui' ? '✓ Disetujui' : '⏳ Menunggu'}
          </span>
        </td>
        <td class="px-4 py-3">
          ${isPending ? `
            <div class="flex gap-1">
              <button onclick="SidanusApp.approveSchedule('${sch.id}')"
                class="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors">
                ✓ Setujui
              </button>
              <button onclick="SidanusApp.rejectSchedule('${sch.id}')"
                class="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors">
                ✗ Tolak
              </button>
            </div>
          ` : `<span class="text-xs text-emerald-600 font-semibold">✓ Selesai</span>`}
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  approveSchedule(schId) {
    if (!confirm('Setujui jadwal ujian ini?')) return;
    SidanusDB.updateSchedule(schId, { statusKaprodi: 'disetujui' });
    alert('✅ Jadwal ujian telah disetujui.');
    this._renderKaprodiTable();
  },

  rejectSchedule(schId) {
    if (!confirm('Tolak jadwal ujian ini?')) return;
    SidanusDB.updateSchedule(schId, { statusKaprodi: 'ditolak' });
    alert('Jadwal ujian telah ditolak.');
    this._renderKaprodiTable();
  },

  // ══════════════════════════════════════
  // PENGUJI — Dashboard
  // ══════════════════════════════════════
  initPengujiDashboard() {
    const session = SidanusDB.getSession();
    if (!session || session.role !== 'penguji') return;

    this._renderPengujiSchedules();
  },

  _renderPengujiSchedules() {
    // Penguji sees approved schedules
    const schedules = SidanusDB.getSchedulesByStatus('disetujui');
    // For now keep the existing hardcoded UI — dynamic rendering depends on DOM structure
  },

  // ══════════════════════════════════════
  // LOGOUT
  // ══════════════════════════════════════
  initLogout() {
    // Find all logout links
    document.querySelectorAll('a[href*="index.html"]').forEach(link => {
      if (link.textContent.trim() === 'Keluar' || link.querySelector('svg')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          SidanusDB.clearSession();
          window.location.href = link.getAttribute('href');
        });
      }
    });
  },

  // ══════════════════════════════════════
  // GLOBAL RESET
  // ══════════════════════════════════════
  resetData() {
    if (confirm('⚠️ Apakah Anda yakin ingin menghapus semua data dan kembali ke data awal?\n\nSemua pendaftaran, jadwal, dan status akan direset.')) {
      SidanusDB.resetAll();
      alert('✅ Data berhasil direset ke kondisi awal.');
      window.location.reload();
    }
  },
};

// ══════════════════════════════════════
// Global Modal Functions (backward compat)
// ══════════════════════════════════════
window.openModal = function () {
  const modal = document.getElementById('fileModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function () {
  SidanusApp._closeModal();
};

// ══════════════════════════════════════
// AUTO-INIT based on current page
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // Login page
  if (path.endsWith('index.html') || path.endsWith('/')) {
    SidanusApp.initLogin();
    return;
  }

  // Mahasiswa pages
  if (path.includes('mahasiswa/dashboard')) {
    SidanusApp.initMahasiswaDashboard();
  } else if (path.includes('mahasiswa/daftar-ujian') || path.includes('daftar-ujian')) {
    SidanusApp.initDaftarUjian();
  }

  // Admin pages
  if (path.includes('admin/dashboard')) {
    SidanusApp.initAdminDashboard();
  } else if (path.includes('admin/penjadwalan')) {
    SidanusApp.initAdminPenjadwalan();
  }

  // Kaprodi
  if (path.includes('kaprodi/dashboard')) {
    SidanusApp.initKaprodiDashboard();
  }

  // Penguji
  if (path.includes('penguji/dashboard')) {
    SidanusApp.initPengujiDashboard();
  }

  // Logout handler for all pages
  SidanusApp.initLogout();
});
