const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });


  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email transporter verification failed:', error.message);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });

  return transporter;
};

// Password validation helper
const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ EMAIL_USER or EMAIL_PASSWORD not set in .env file');
    return false;
  }

  if (process.env.EMAIL_PASSWORD.length < 16) {
    console.error('❌ EMAIL_PASSWORD looks too short. Make sure you are using a 16-character App Password (no spaces)');
    return false;
  }

  return true;
};

// Send appointment confirmation email
const sendAppointmentConfirmation = async (appointmentData) => {
  if (!validateEmailConfig()) {
    return { success: false, error: 'Email credentials not configured properly' };
  }

  try {
    const transporter = createTransporter();

    const { patientName, patientEmail, patientNumber, appointmentTime, preferredMode, patientGender } = appointmentData;

    const formattedDate = new Date(appointmentTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mailOptions = {
      from: `"Health Plus" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: 'Appointment Confirmation - Health Plus',
      html: `... your existing HTML ...`  // (keep your HTML content same)
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', patientEmail);
    return { success: true };

  } catch (error) {
    console.error('❌ Error sending appointment confirmation email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send appointment notification to admin (similar improvements)
const sendAdminNotification = async (appointmentData) => {
  if (!validateEmailConfig()) {
    return { success: false, error: 'Email credentials not configured properly' };
  }

  if (!process.env.ADMIN_EMAIL) {
    console.error('❌ ADMIN_EMAIL not set in .env file');
    return { success: false, error: 'Admin email not configured' };
  }

  try {
    const transporter = createTransporter();

    // ... rest of your existing code for admin notification (same as before)

    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent successfully to:', process.env.ADMIN_EMAIL);
    return { success: true };

  } catch (error) {
    console.error('❌ Error sending admin notification email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendAdminNotification
};