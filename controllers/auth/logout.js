const ErrorHandler = require('../../utils/errorHandler');

exports.logoutUser = (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true
        })
        .status(200)
        .json({
            success: true,
            message: "Logged out"
        });
    } catch (error) {
        next(new ErrorHandler('Internal Server Error', 500));
    }
};
