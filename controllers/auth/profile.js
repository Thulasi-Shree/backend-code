const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.token);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }
        new SuccessHandler('User profile retrieved successfully', { user }).sendResponse(res);
    } catch (error) {
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

exports.changePassword = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('+password');
        if (!user || !(await user.isValidPassword(req.body.oldPassword))) {
            return next(new ErrorHandler('Old password is incorrect', 401));        }
        user.password = req.body.password;
        await user.save();
        new SuccessHandler('Password changed successfully').sendResponse(res);
    } catch (error) {
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    try {
        let newUserData = {
            name: req.body.name,
            email: req.body.email
        };
        let avatar;
        let BASE_URL = process.env.BACKEND_URL;
        if (process.env.NODE_ENV === 'production') {
            BASE_URL = `${req.protocol}://${req.get('host')}`;
        }
        if (req.file) {
            avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
            newUserData = { ...newUserData, avatar };
        }
        const user = await User.findByIdAndUpdate(req.params.token, newUserData, {
            new: true,
            runValidators: true
        });
        new SuccessHandler('Profile updated successfully', { user }).sendResponse(res);
    } catch (error) {
        next(new ErrorHandler('Internal Server Error', 500));
    }
});
