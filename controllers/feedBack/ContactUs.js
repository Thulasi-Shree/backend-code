const nodemailer = require('nodemailer');
const catchAsyncError = require('../../middlewares/catchAsyncError');

// Nodemailer configuration (use your email service and credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
});

// POST endpoint to send emails
exports.contactUs = catchAsyncError(async(req, res) => {
  const { fullName, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'thulasi9941@gmail.com', // Change this to the admin's email address
    subject: subject,
    text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    return res.status(200).send('Email sent successfully');
  });
});

