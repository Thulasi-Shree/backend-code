const mongoose = require('mongoose');
const crypto = require('crypto');

const guestUserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true, // Make the email field optional
  },
  mobile: {
    type: String,
    trim: true,
    unique: true,
    sparse: true, // Make the mobile field optional
  },
  otpHash: String,
});

guestUserSchema.methods.generateHashedOTP = function (otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

guestUserSchema.methods.generateOTP = function (length) {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// You can add more fields and methods as needed

const GuestUser = mongoose.model('GuestUser', guestUserSchema);

module.exports = GuestUser;
