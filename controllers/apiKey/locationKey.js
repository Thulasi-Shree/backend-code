
const catchAsyncError = require('../../middlewares/catchAsyncError');

require('dotenv').config();

exports.locationApikey = catchAsyncError(async (req, res, next) => {
    try {
        const apiKey = process.env.LOCATION_API_KEY;

        res.status(200).json({ apiKey });
    } catch (error) {
        console.error('Error retrieving API key:', error);
        res.status(500).json({ error: 'Unable to retrieve API key' });
    }
});

