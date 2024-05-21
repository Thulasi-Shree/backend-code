const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');
const sendToken = require('../../utils/jwt');
const ErrorHandler = require('../../utils/errorHandler');
const { sendEmail } = require('../../utils/email');
const crypto = require('crypto');


exports.loginUser = catchAsyncError(async (req, res, next) => {
    try {
        const { email, otp, password } = req.body;

        if (!email) {
            throw new ErrorHandler('Please provide email', 400);
        }

        let user;

        if (otp) {
            const hashedOTP = generateHashedOTP(otp);
            user = await User.findOne({ email, loginOtp: hashedOTP });

            if (!user) {
                throw new ErrorHandler('Invalid OTP', 401);
            }

            user.loginOtp = undefined;
            user.loginOtpExpire = undefined;
            await user.save({ validateBeforeSave: false });
        } else if (password) {
            user = await User.findOne({ email }).select('+password');

            if (!user || !(await user.isValidPassword(password))) {
                throw new ErrorHandler('Invalid email or password', 401);
            }
        } else {
            throw new ErrorHandler('Please provide OTP or password', 400);
        }
        if (!user.emailVerificationStatus) {
            throw new ErrorHandler('Email is not verified', 401);
        }

        sendToken(user, 201, res);
    } catch (error) {
        if (error instanceof ErrorHandler) {
            res.status(error.statusCode).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Internal Server Error' });
          }
    }
});

const generateHashedOTP = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

exports.sendUserOtp = catchAsyncError(async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new ErrorHandler('Please enter email', 400);
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
        
        const plainOTP = generateOTP(6); 
        const hashedOTP = generateHashedOTP1(plainOTP); 
        
      

        const user = await User.findOneAndUpdate({ email }, { loginOtp: hashedOTP }, { new: true });


        user.loginOtp = hashedOTP;
        user.save();
        if (!user) {
            throw new ErrorHandler('Invalid email', 401);
        }

        const message = `Your OTP for login is: ${plainOTP}`;

        await sendEmail({
            email,
            subject: 'Login OTP',
            message
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email for login verification'
        });
    } catch (error) {
        next(new ErrorHandler('Internal Server Error', 500));
        
    }
});
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      next(new ErrorHandler('Error fetching user profile', 500));
  
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  });