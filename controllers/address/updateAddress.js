const catchAsyncError = require('../../middlewares/catchAsyncError');
const Address = require('../../model/Address');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const updateAddress = catchAsyncError(async (req, res, next) => {
    const { street, city, state, postalCode, country } = req.body;
    const addressId = req.params.id;

    try {
        let address = await Address.findById(addressId);

        if (!address) {
            return next(new ErrorHandler('Address not found', 404));
        }

        address.street = street;
        address.city = city;
        address.state = state;
        address.postalCode = postalCode;
        address.country = country;

        await address.save();

        const successResponse = new SuccessHandler('Address updated successfully', address);
        successResponse.sendResponse(res, 200);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = updateAddress;
