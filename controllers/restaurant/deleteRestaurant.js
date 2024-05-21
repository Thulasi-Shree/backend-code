const catchAsyncError = require('../../middlewares/catchAsyncError');
const Restaurant = require('../../model/restaurant'); 
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const deleteRestaurant = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.params.id;

        // Find the restaurant by ID and remove it
        const restaurant = await Restaurant.findByIdAndDelete(restaurantId);

        if (!restaurant) {
            return next(new ErrorHandler(`Restaurant not found with id ${restaurantId}`, 404));
        }

        const successResponse = new SuccessHandler('Restaurant deleted successfully', restaurant);
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = deleteRestaurant