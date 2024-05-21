const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/GuestUser');
const sendToken = require('../../utils/jwt');
const ErrorHandler = require('../../utils/errorHandler');
const { sendEmail } = require('../../utils/email');
const crypto = require('crypto');
const sendOtp = require('../../utils/sendMobileOtp');



const generateHashedOTP = (otp) => {
  if (!otp) {
    throw new ErrorHandler('Invalid OTP value.', 400);
  }

  return crypto.createHash('sha256').update(otp).digest('hex');
};

exports.verifyGuestUserOtp = catchAsyncError(async (req, res) => {
  try {
    const { email, mobile, enteredOtp } = req.body;

    if (!email && !mobile) {
      throw new ErrorHandler('Please provide either email or mobile number.', 400);
    }

    let user;

    if (email || mobile) {
      user = await User.findOne({ $or: [{ email }, { mobile }] });
    }
    if (!user || !user.otpHash) {
      throw new ErrorHandler('Invalid email/mobile or OTP not generated.', 400);
    }
    console.log('Recipient Mobile Number:', user.mobile);
    console.log('Recipient Mobile Number:', user.email);

    if (!enteredOtp) {
      throw new ErrorHandler('Please provide the OTP for verification.', 400);
    }

    const enteredHashedOTP = generateHashedOTP(enteredOtp);
    console.log('Stored Hashed OTP:', user.otpHash);
    console.log('Entered Hashed OTP:', enteredHashedOTP);

    if (enteredHashedOTP === user.otpHash) {
      await User.findByIdAndDelete(user._id);

      res.status(200).json({ success: true, message: 'OTP verified successfully.' });
    } else {
      throw new ErrorHandler('Invalid OTP.', 400);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP.' });
  }
});

exports.sendGuestUserOtp = catchAsyncError(async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!(email || mobile)) {
      throw new ErrorHandler('Please provide either email or mobile number.', 400);
    }

    const generateOTP = (length) => {
      const digits = '0123456789';
      let OTP = '';
      for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
    };

    const generateHashedOTP1 = (otp) => {
      return crypto.createHash('sha256').update(otp).digest('hex');
    };

    let user;

    if (email) {
      user = await User.findOne({ email });
    } 

    if (mobile) {
      user = await User.findOne({ mobile });
    }

    if (!user) {
      user = new User({ email, mobile });
    }

    const plainOTP = generateOTP(6);
    const hashedOTP = generateHashedOTP1(plainOTP);

    user.otpHash = hashedOTP;

    const message = `Your OTP for login is: ${plainOTP}`;

    console.log('Recipient Mobile Number:', user.mobile);
    console.log('Generated OTP:', plainOTP);

    if (user.mobile) {
      try {
        const formattedPhoneNumber = `+91${user.mobile}`;
        await sendOtp(formattedPhoneNumber, plainOTP);
        console.log('OTP sent successfully via SMS');
      } catch (smsError) {
        console.error('Error sending OTP via SMS:', smsError);
        throw new ErrorHandler('Failed to send OTP via SMS', 500);
      }
    }

    if (user.email) {
      await sendEmail({
        email: user.email,
        subject: 'Login OTP',
        message,
      });
    }
    await user.save();

    res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(error.statusCode || 500).json({ success: false, message: 'Failed to send OTP.' });
  }
});
