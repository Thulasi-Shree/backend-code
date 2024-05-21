const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');
const sendToken = require('../../utils/jwt');
const crypto = require('crypto');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        console.log(`Reset Password Token: ${resetPasswordToken}`);
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpire: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return next(new ErrorHandler('Password reset token is invalid or expired'));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler('Password does not match'));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        
        sendToken(user, 200, res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Password Reset failed! please check your password.', 500));
    }
});

