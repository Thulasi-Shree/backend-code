const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');
const Location = require('../../model/Location');
const Restaurant = require('../../model/restaurant')
const catchAsyncError = require('../../middlewares/catchAsyncError');

// Update a location by ID
const updateLocation = catchAsyncError(async (req, res, next) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!location) {
            return next(new ErrorHandler(`Location not found with this id: ${req.params.id}`, 404));
        }
        const successResponse = new SuccessHandler('Location updated successfully', location);
        successResponse.sendResponse(res, 200);
    } catch (error) {
        return  next(new ErrorHandler(error.message, 500));
    }
});

// Delete a location by ID
const deleteLocation = catchAsyncError(async (req, res, next) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            return next(new ErrorHandler(`Location not found with this id: ${req.params.id}`, 404));
        }
        const successResponse = new SuccessHandler('Location deleted successfully', {});
        successResponse.sendResponse(res, 200);
    } catch (error) {
        return  next(new ErrorHandler(error.message, 500));
    }
});

// Save user location
const saveUserLocation = catchAsyncError(async (req, res, next) => {
    try {
        const { name, latitude, longitude } = req.body;
        const location = new Location({
            name: name,
            coordinates: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
            // ... other fields you want to save
        });
        await location.save();
        const successResponse = new SuccessHandler('Location data saved successfully', {});
        successResponse.sendResponse(res, 200);
    } catch (error) {
        console.error(error);
        return  next(new ErrorHandler(error.message, 500));
    }
});

// Get nearby restaurants
const getNearbyRestaurants = catchAsyncError(async (req, res, next) => {
    try {
        const { latitude, longitude } = req.params;
        const coordinates = [parseFloat(longitude), parseFloat(latitude)];

        // Use the $nearSphere operator to perform a geospatial query within the Restaurant model
        const nearbyRestaurants = await Restaurant.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coordinates,
                    },
                    $maxDistance: 10000, // Maximum distance in meters (adjust as needed)
                },
            },
        });

        res.status(200).json({ success: true, message: 'Nearby restaurants fetched successfully', restaurants: nearbyRestaurants });
    } catch (error) {
        console.log(error);
        return  next(new ErrorHandler(error.message, 500));
    }
});

module.exports = {
    saveUserLocation,
    updateLocation,
    deleteLocation,
    getNearbyRestaurants,
};
