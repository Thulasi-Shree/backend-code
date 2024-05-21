const catchAsyncError = require('../../middlewares/catchAsyncError');
const Address = require('../../model/Address');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const getAllAddress = catchAsyncError(async (req, res, next) => {
    try {
        const addresses = await Address.find();

        const successResponse = new SuccessHandler('All addresses retrieved successfully', addresses);
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = getAllAddress;
