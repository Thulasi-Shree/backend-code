const catchAsyncError = require('../../middlewares/catchAsyncError');
const Restaurant = require('../../model/restaurant');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createRestaurant = catchAsyncError(async (req, res, next) => {
    try {
        const { restaurantName, address, images, restaurantId, description, restaurantBranch, openingHours, cuisineTypeCategory, dietaryPreferenceCategory } = req.body;
        const userId = req.user.id;

        // Create a new restaurant object
        const newRestaurant = await Restaurant.create({
            restaurantName,
            restaurantBranch,
            restaurantId,
            images,
            address,
            description,
            openingHours,
            createdBy: userId,
            dietaryPreferenceCategory,
            cuisineTypeCategory
        });

        const successResponse = new SuccessHandler('Restaurant created successfully', newRestaurant);
        successResponse.sendResponse(res, 201);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = createRestaurant;

