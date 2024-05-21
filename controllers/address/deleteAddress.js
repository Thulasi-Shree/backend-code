const catchAsyncError = require('../../middlewares/catchAsyncError');
const Address = require('../../model/Address');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');


const deleteAddress = catchAsyncError(async (req, res, next) => {
    try {
        const addressId = req.params.id;

        const address = await Address.findByIdAndDelete(addressId);

        if (!address) {
            return next(new ErrorHandler(`Address not found with id ${addressId}`, 404));
        }

        const successResponse = new SuccessHandler('Address deleted successfully', {});
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = deleteAddress;
