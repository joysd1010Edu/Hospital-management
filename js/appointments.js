// appointments.js - Appointment management

// Book appointment
function bookAppointment(appointmentData) {
  const data = getData();
  
  // Validate
  if (!appointmentData.doctorId || !appointmentData.date || !appointmentData.time) {
    showToast('Please fill all required fields', 'error');
    return false;
  }
  
  // Check if date is in the future
  const appointmentDate = new Date(appointmentData.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (appointmentDate < today) {
    showToast('Cannot book appointment in the past', 'error');
    return false;
  }
  
  // Check if patient is logged in
  if (!data.session || data.session.userType !== 'patient') {
    showToast('Please login as patient to book appointment', 'error');
    return false;
  }
  
  // Create appointment
  const newAppointment = {
    id: generateId('APT'),
    patientId: data.session.userId,
    doctorId: parseInt(appointmentData.doctorId),
    date: appointmentData.date,
    time: appointmentData.time,
    reason: appointmentData.reason || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  data.appointments.push(newAppointment);
  saveData(data);
  
  showToast('Appointment booked successfully!', 'success');
  return true;
}

// Get appointments for patient
function getPatientAppointments(patientId) {
  const data = getData();
  return data.appointments.filter(apt => apt.patientId === patientId);
}

// Get appointments for doctor
function getDoctorAppointments(doctorId) {
  const data = getData();
  return data.appointments.filter(apt => apt.doctorId === doctorId);
}

// Get today's appointments for doctor
function getTodayAppointments(doctorId) {
  const today = new Date().toISOString().split('T')[0];
  const data = getData();
  return data.appointments.filter(apt => 
    apt.doctorId === doctorId && apt.date === today
  );
}

// Update appointment status
function updateAppointmentStatus(appointmentId, status) {
  const data = getData();
  const appointmentIndex = data.appointments.findIndex(apt => apt.id === appointmentId);
  
  if (appointmentIndex === -1) {
    showToast('Appointment not found', 'error');
    return false;
  }
  
  data.appointments[appointmentIndex].status = status;
  saveData(data);
  
  showToast(`Appointment ${status.toLowerCase()}`, 'success');
  return true;
}

// Cancel appointment
function cancelAppointment(appointmentId) {
  return updateAppointmentStatus(appointmentId, 'Cancelled');
}

// Complete appointment
function completeAppointment(appointmentId) {
  return updateAppointmentStatus(appointmentId, 'Completed');
}

// Get appointment details with patient and doctor info
function getAppointmentDetails(appointmentId) {
  const data = getData();
  const appointment = data.appointments.find(apt => apt.id === appointmentId);
  
  if (!appointment) return null;
  
  const patient = data.patients.find(p => p.id === appointment.patientId);
  const doctor = data.doctors.find(d => d.id === appointment.doctorId);
  
  return {
    ...appointment,
    patientName: patient ? patient.name : 'Unknown',
    patientEmail: patient ? patient.email : '',
    patientPhone: patient ? patient.phone : '',
    doctorName: doctor ? doctor.name : 'Unknown',
    doctorDepartment: doctor ? doctor.department : ''
  };
}

// Get all appointments with details
function getAllAppointmentsWithDetails(appointments) {
  return appointments.map(apt => getAppointmentDetails(apt.id));
}

