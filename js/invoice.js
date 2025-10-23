// invoice.js - Invoice management

// Generate invoice
function generateInvoice(invoiceData) {
  const data = getData();
  
  // Validate
  if (!invoiceData.appointmentId || !invoiceData.amount) {
    showToast('Missing required invoice data', 'error');
    return false;
  }
  
  const appointment = getAppointmentDetails(invoiceData.appointmentId);
  if (!appointment) {
    showToast('Appointment not found', 'error');
    return false;
  }
  
  // Create invoice
  const newInvoice = {
    id: generateId('INV'),
    appointmentId: invoiceData.appointmentId,
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    patientName: appointment.patientName,
    doctorName: appointment.doctorName,
    date: new Date().toISOString().split('T')[0],
    services: invoiceData.services || 'Consultation',
    amount: parseFloat(invoiceData.amount),
    paid: false,
    createdAt: new Date().toISOString()
  };
  
  data.invoices.push(newInvoice);
  
  // Update appointment status to completed
  updateAppointmentStatus(invoiceData.appointmentId, 'Completed');
  
  saveData(data);
  showToast('Invoice generated successfully!', 'success');
  return newInvoice.id;
}

// Get invoices for patient
function getPatientInvoices(patientId) {
  const data = getData();
  return data.invoices.filter(inv => inv.patientId === patientId);
}

// Get invoices for doctor
function getDoctorInvoices(doctorId) {
  const data = getData();
  return data.invoices.filter(inv => inv.doctorId === doctorId);
}

// Get invoice by ID
function getInvoiceById(invoiceId) {
  const data = getData();
  return data.invoices.find(inv => inv.id === invoiceId);
}

// Mark invoice as paid
function markInvoicePaid(invoiceId) {
  const data = getData();
  const invoiceIndex = data.invoices.findIndex(inv => inv.id === invoiceId);
  
  if (invoiceIndex === -1) {
    showToast('Invoice not found', 'error');
    return false;
  }
  
  data.invoices[invoiceIndex].paid = true;
  data.invoices[invoiceIndex].paidDate = new Date().toISOString();
  saveData(data);
  
  showToast('Invoice marked as paid', 'success');
  return true;
}

// Print invoice
function printInvoice(invoiceId) {
  const invoice = getInvoiceById(invoiceId);
  if (!invoice) {
    showToast('Invoice not found', 'error');
    return;
  }
  
  // Create print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #2563eb; margin: 0; }
        .info { margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #2563eb; color: white; }
        .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>IST Medical College & Hospital</h1>
        <p>Invoice / Pay Slip</p>
      </div>
      <div class="info">
        <div class="info-row">
          <span><strong>Invoice ID:</strong> ${invoice.id}</span>
          <span><strong>Date:</strong> ${formatDate(invoice.date)}</span>
        </div>
        <div class="info-row">
          <span><strong>Patient Name:</strong> ${invoice.patientName}</span>
          <span><strong>Doctor:</strong> ${invoice.doctorName}</span>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${invoice.services}</td>
            <td>৳${invoice.amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div class="total">
        Total Amount: ৳${invoice.amount.toFixed(2)}
      </div>
      <div class="footer">
        <p>Thank you for choosing IST Medical College & Hospital</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

