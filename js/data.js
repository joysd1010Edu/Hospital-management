// data.js - Initialize default data structure
function initializeData() {
  // Check if data already exists
  if (!localStorage.getItem('hospitalData')) {
    const initialData = {
      doctors: [
        { 
          id: 1, 
          name: "Dr. Abdul Rahman", 
          department: "Cardiology", 
          email: "rahman@istmedical.com",
          password: "doc123",
          qualification: "MBBS, MD (Cardiology)",
          experience: "15 years",
          available: true,
          schedule: "Mon-Fri, 9AM-5PM"
        },
        { 
          id: 2, 
          name: "Dr. Fatima Khan", 
          department: "Neurology", 
          email: "fatima@istmedical.com",
          password: "doc123",
          qualification: "MBBS, DM (Neurology)",
          experience: "12 years",
          available: true,
          schedule: "Mon-Sat, 10AM-4PM"
        },
        { 
          id: 3, 
          name: "Dr. Ahmed Hassan", 
          department: "Orthopedics", 
          email: "ahmed@istmedical.com",
          password: "doc123",
          qualification: "MBBS, MS (Orthopedics)",
          experience: "10 years",
          available: true,
          schedule: "Tue-Sat, 9AM-3PM"
        },
        { 
          id: 4, 
          name: "Dr. Nadia Islam", 
          department: "Pediatrics", 
          email: "nadia@istmedical.com",
          password: "doc123",
          qualification: "MBBS, DCH",
          experience: "8 years",
          available: true,
          schedule: "Mon-Fri, 8AM-2PM"
        },
        { 
          id: 5, 
          name: "Dr. Karim Uddin", 
          department: "General Surgery", 
          email: "karim@istmedical.com",
          password: "doc123",
          qualification: "MBBS, MS (Surgery)",
          experience: "18 years",
          available: true,
          schedule: "Mon-Sat, 10AM-6PM"
        },
        { 
          id: 6, 
          name: "Dr. Ayesha Begum", 
          department: "Gynecology", 
          email: "ayesha@istmedical.com",
          password: "doc123",
          qualification: "MBBS, MS (Obs & Gynae)",
          experience: "14 years",
          available: true,
          schedule: "Mon-Fri, 9AM-4PM"
        }
      ],
      patients: [],
      appointments: [],
      invoices: [],
      suggestions: [],
      seatBookings: [],
      session: null
    };
    
    localStorage.setItem('hospitalData', JSON.stringify(initialData));
  }
}

// Get all data
function getData() {
  const data = localStorage.getItem('hospitalData');
  return data ? JSON.parse(data) : null;
}

// Save data
function saveData(data) {
  localStorage.setItem('hospitalData', JSON.stringify(data));
}

// Initialize on load
initializeData();

