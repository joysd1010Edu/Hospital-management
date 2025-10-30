// utils.js - Helper functions

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 transition-opacity duration-300 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Generate unique ID
function generateId(prefix = '') {
  return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone
function validatePhone(phone) {
  const re = /^[0-9]{10,15}$/;
  return re.test(phone);
}

// Check if user is logged in
function isLoggedIn() {
  const data = getData();
  return data && data.session !== null;
}

// Get current user
function getCurrentUser() {
  const data = getData();
  if (!data || !data.session) return null;
  
  if (data.session.userType === 'admin') {
    return { id: 0, name: "Admin" };
  } else if (data.session.userType === 'doctor') {
    return data.doctors.find(d => d.id === data.session.userId);
  } else if (data.session.userType === 'patient') {
    return data.patients.find(p => p.id === data.session.userId);
  }
  return null;
}

// Get user type
function getUserType() {
  const data = getData();
  return data && data.session ? data.session.userType : null;
}

// Redirect if not authenticated
function requireAuth(allowedTypes = []) {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  
  const userType = getUserType();
  if (allowedTypes.length > 0 && !allowedTypes.includes(userType)) {
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

// Update navigation based on login status
function updateNavigation() {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const dashboardBtn = document.getElementById('dashboardBtn');
  
  if (isLoggedIn()) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (dashboardBtn) {
      dashboardBtn.style.display = 'block';
      const userType = getUserType();
      dashboardBtn.onclick = () => {
        if (userType === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else if (userType === 'doctor') {
          window.location.href = 'doctor-dashboard.html';
        } else {
          window.location.href = 'patient-dashboard.html';
        }
      };
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (signupBtn) signupBtn.style.display = 'block';
    if (dashboardBtn) dashboardBtn.style.display = 'none';
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
  }
}

