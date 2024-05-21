const catchAsyncError = require('../../middlewares/catchAsyncError');
const Address = require('../../model/Address'); // Adjust the path accordingly
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createAddress = catchAsyncError(async (req, res, next) => {
  const { streetAddress, city, state, postal_code, country, name, email, mobileNumber, latitude, longitude} = req.body;
  const { userId } = req.user || 'Guest User';

  try {
    const addressData = {
      streetAddress,
      city,
      state,
      postal_code,
      country,
      latitude,
      longitude,
      name,
      email,
      mobileNumber
    };

    if (userId) {
      addressData.userId = userId;
    }

    const address = await Address.create(addressData);

    const successResponse = new SuccessHandler(
      'Address added successfully',
      address
    );
    successResponse.sendResponse(res, 200);
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error', 500));
  }
});

module.exports = createAddress;
