document.addEventListener('DOMContentLoaded', () => {
  // --- File Upload UI Logic ---
  const fileInputs = document.querySelectorAll('input[type="file"]');
  
  fileInputs.forEach(input => {
    input.addEventListener('change', function(e) {
      const fileName = e.target.files[0]?.name;
      if (fileName) {
        // Update the dropzone text
        const dropZone = this.closest('.file-drop');
        if (dropZone) {
          const textElement = dropZone.querySelector('p');
          if (textElement) {
            textElement.textContent = fileName;
            textElement.classList.remove('text-slate-500');
            textElement.classList.add('text-emerald-600', 'font-semibold');
          }
          
          // Change the button text
          const label = dropZone.querySelector('label');
          if (label) {
            label.textContent = 'Ganti File';
            label.classList.replace('bg-emerald-100', 'bg-slate-100');
            label.classList.replace('text-emerald-700', 'text-slate-600');
            label.classList.replace('hover:bg-emerald-200', 'hover:bg-slate-200');
          }
        }
        
        // Update the badge in the <summary> (Header of the accordion)
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
});

// --- Modal UI Logic (Admin Dashboard) ---
window.openModal = function() {
  const modal = document.getElementById('fileModal');
  if (modal) {
    modal.classList.remove('hidden');
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function() {
  const modal = document.getElementById('fileModal');
  if (modal) {
    modal.classList.add('hidden');
    // Restore background scrolling
    document.body.style.overflow = '';
  }
};
