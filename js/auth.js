// auth.js - Authentication logic

// Sign up new patient
function signUp(formData) {
  const data = getData();
  
  // Validate
  if (!formData.name || !formData.email || !formData.password || !formData.phone) {
    showToast('All fields are required', 'error');
    return false;
  }
  
  if (!validateEmail(formData.email)) {
    showToast('Invalid email address', 'error');
    return false;
  }
  
  if (!validatePhone(formData.phone)) {
    showToast('Invalid phone number', 'error');
    return false;
  }
  
  if (formData.password.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    return false;
  }
  
  // Check if email already exists
  if (data.patients.some(p => p.email === formData.email)) {
    showToast('Email already registered', 'error');
    return false;
  }
  
  // Create new patient
  const newPatient = {
    id: Date.now(),
    name: formData.name,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    address: formData.address || '',
    dateOfBirth: formData.dateOfBirth || '',
    gender: formData.gender || '',
    registeredDate: new Date().toISOString()
  };
  
  data.patients.push(newPatient);
  saveData(data);
  
  showToast('Registration successful! Please login.', 'success');
  return true;
}

// Login
function login(email, password, userType = 'patient') {
  const data = getData();
  
  if (!email || !password) {
    showToast('Email and password are required', 'error');
    return false;
  }
  
  let user = null;
  
  if (userType === 'doctor') {
    user = data.doctors.find(d => d.email === email && d.password === password);
  } else {
    user = data.patients.find(p => p.email === email && p.password === password);
  }
  
  if (!user) {
    showToast('Invalid credentials', 'error');
    return false;
  }
  
  // Create session
  data.session = {
    userType: userType,
    userId: user.id,
    loginTime: new Date().toISOString()
  };
  
  saveData(data);
  showToast('Login successful!', 'success');
  
  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = userType === 'doctor' ? 'doctor-dashboard.html' : 'patient-dashboard.html';
  }, 1000);
  
  return true;
}

// Logout
function logout() {
  const data = getData();
  data.session = null;
  saveData(data);
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Update patient profile
function updateProfile(patientId, formData) {
  const data = getData();
  const patientIndex = data.patients.findIndex(p => p.id === patientId);
  
  if (patientIndex === -1) {
    showToast('Patient not found', 'error');
    return false;
  }
  
  // Update patient data
  data.patients[patientIndex] = {
    ...data.patients[patientIndex],
    ...formData,
    password: data.patients[patientIndex].password // Don't update password here
  };
  
  saveData(data);
  showToast('Profile updated successfully', 'success');
  return true;
}

