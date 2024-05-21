const catchAsyncError = require('../../middlewares/catchAsyncError');
const Restaurant = require('../../model/restaurant'); // Correct the import path if it's not 'user'
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');
const mongoose = require('mongoose');

const getRestaurant = catchAsyncError(async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find();

        if (!restaurants || restaurants.length === 0) {
            return next(new ErrorHandler('No restaurants found', 404));
        }

        const successResponse = new SuccessHandler('Restaurants retrieved successfully', restaurants);
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

const getRestaurantById = catchAsyncError(async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
        if (!restaurant) {
            return next(new ErrorHandler(`Restaurant not found with this id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            restaurant
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});
const getRestaurantByRestaurantId = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.query.id;
        if (!restaurantId || isNaN(restaurantId)) {
            throw new ErrorHandler('Invalid Restaurant ID provided in the request', 400);
        }
        const restaurant = await Restaurant.findOne({ restaurantId });

        if (!restaurant) {
            throw new ErrorHandler(`Restaurant not found with this id: ${restaurantId}`, 404);
        }
        res.status(200).json({
            success: true,
            restaurant
        });
    } catch (error) {
        next(error);
    }
});
module.exports = {
    getRestaurant,
    getRestaurantById,
    getRestaurantByRestaurantId
  };