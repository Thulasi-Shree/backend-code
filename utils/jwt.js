
const sendToken = (user, statusCode, res) => {
    try {
        // Creating JWT Token
        const token = user.getJwtToken();

        // Setting cookies
        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.status(statusCode)
            .cookie('token', token, options)
            .json({
                success: true,
                token,
                user,
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = sendToken;
