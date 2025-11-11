// doctor-modal.js - show doctor details in a modal dialog
document.addEventListener('DOMContentLoaded', function(){
  // delegate click handler for doctor cards
  document.body.addEventListener('click', function(e){
    const card = e.target.closest('[data-doctor-id]');
    if(card){
      const id = card.getAttribute('data-doctor-id');
      if(id) showDoctorModal(Number(id));
    }
  });

  // close modal when clicking backdrop or close button
  document.addEventListener('click', function(e){
    if(e.target.matches('.modal-backdrop.show')) hideDoctorModal();
    if(e.target.matches('.doctor-modal-close')) hideDoctorModal();
  });
});

function showDoctorModal(id){
  const data = getData();
  const doc = data && data.doctors ? data.doctors.find(d => Number(d.id) === Number(id)) : null;
  if(!doc) return;

  const backdrop = document.getElementById('doctorModalBackdrop');
  const container = document.getElementById('doctorModalContainer');

  // populate - ensure we select the correct image with a more specific selector
  container.querySelector('.doc-name').textContent = doc.name;
  container.querySelector('.doc-dept').textContent = doc.department;
  container.querySelector('.doc-qual').textContent = doc.qualification || '—';
  container.querySelector('.doc-exp').textContent = doc.experience || '—';
  container.querySelector('.doc-schedule').textContent = doc.schedule || '—';
  container.querySelector('.doc-email').textContent = doc.email || '—';
  container.querySelector('.doc-availability').textContent = doc.available ? 'Available' : 'Not Available';
  container.querySelector('.doc-availability').className = 'doc-availability ' + (doc.available ? 'text-green-600' : 'text-red-600');
  
  // Fix: Use more specific selector and force image reload
  const img = container.querySelector('.doctor-image-large');
  if (img) {
    img.src = doc.image || 'assets/doctor_1.png';
    img.alt = 'Dr. ' + doc.name;
    // Force reload to prevent caching issues on Netlify
    img.onerror = function() {
      this.src = 'assets/doctor_1.png';
    };
  }

  // professional details example
  const prof = container.querySelector('.doc-professional');
  const specialties = doc.department ? `<strong>Specialty:</strong> ${doc.department}` : '';
  prof.innerHTML = `
    <p class="text-gray-700 mb-2">${doc.profile || 'Expert in ' + (doc.department || 'General Medicine') + ', with years of clinical experience.'}</p>
    <p class="text-sm text-gray-600">${specialties} • ${doc.qualification || ''}</p>
  `;

  backdrop.classList.add('show');
}

function hideDoctorModal(){
  const backdrop = document.getElementById('doctorModalBackdrop');
  if(backdrop) backdrop.classList.remove('show');
}
