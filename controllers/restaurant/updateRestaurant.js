const catchAsyncError = require('../../middlewares/catchAsyncError');
const Restaurant = require('../../model/restaurant');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const updateRestaurant = catchAsyncError(async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return next(new ErrorHandler('Restaurant not found', 404));
        }

        restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        new SuccessHandler(`Restaurant updated successfully`, { restaurant }).sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = updateRestaurant;
