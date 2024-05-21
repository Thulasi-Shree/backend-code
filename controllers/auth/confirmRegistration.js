const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');

exports.confirmRegistration = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ emailVerificationToken: token });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }

        const expirationTime = 24 * 60 * 60 * 1000;
        const isTokenExpired = Date.now() - user.emailVerificationSentAt.getTime() > expirationTime;

        if (isTokenExpired) {
            return res.status(400).json({ success: false, message: 'Token has expired' });
        }

        user.emailVerificationStatus = true;
        await user.save();

        return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
