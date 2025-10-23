// dashboard.js - Dashboard functionality

// Submit suggestion/complaint
function submitSuggestion(suggestionData) {
  const data = getData();
  
  if (!suggestionData.subject || !suggestionData.message) {
    showToast('Please fill all fields', 'error');
    return false;
  }
  
  const newSuggestion = {
    id: generateId('SUG'),
    userId: data.session ? data.session.userId : null,
    userType: data.session ? data.session.userType : 'anonymous',
    userName: suggestionData.name || 'Anonymous',
    email: suggestionData.email || '',
    subject: suggestionData.subject,
    message: suggestionData.message,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  data.suggestions.push(newSuggestion);
  saveData(data);
  
  showToast('Suggestion submitted successfully!', 'success');
  return true;
}

// Get all suggestions
function getAllSuggestions() {
  const data = getData();
  return data.suggestions;
}

// Book seat
function bookSeat(seatData) {
  const data = getData();
  
  if (!seatData.patientName || !seatData.date || !seatData.seatType) {
    showToast('Please fill all required fields', 'error');
    return false;
  }
  
  // Check if date is in the future
  const bookingDate = new Date(seatData.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (bookingDate < today) {
    showToast('Cannot book seat in the past', 'error');
    return false;
  }
  
  const newBooking = {
    id: generateId('SEAT'),
    patientId: data.session ? data.session.userId : null,
    patientName: seatData.patientName,
    phone: seatData.phone,
    date: seatData.date,
    seatType: seatData.seatType,
    duration: seatData.duration || '1 day',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };
  
  data.seatBookings.push(newBooking);
  saveData(data);
  
  showToast('Seat booked successfully!', 'success');
  return true;
}

// Get seat bookings for patient
function getPatientSeatBookings(patientId) {
  const data = getData();
  return data.seatBookings.filter(booking => booking.patientId === patientId);
}

// Get all seat bookings
function getAllSeatBookings() {
  const data = getData();
  return data.seatBookings;
}

// Get dashboard statistics for doctor
function getDoctorStats(doctorId) {
  const data = getData();
  const appointments = getDoctorAppointments(doctorId);
  const todayAppointments = getTodayAppointments(doctorId);
  const completedAppointments = appointments.filter(apt => apt.status === 'Completed');
  const pendingAppointments = appointments.filter(apt => apt.status === 'Pending');
  
  return {
    totalAppointments: appointments.length,
    todayAppointments: todayAppointments.length,
    completedAppointments: completedAppointments.length,
    pendingAppointments: pendingAppointments.length
  };
}

// Get dashboard statistics for patient
function getPatientStats(patientId) {
  const data = getData();
  const appointments = getPatientAppointments(patientId);
  const invoices = getPatientInvoices(patientId);
  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate >= today && apt.status === 'Pending';
  });
  const unpaidInvoices = invoices.filter(inv => !inv.paid);
  
  return {
    totalAppointments: appointments.length,
    upcomingAppointments: upcomingAppointments.length,
    totalInvoices: invoices.length,
    unpaidInvoices: unpaidInvoices.length
  };
}

