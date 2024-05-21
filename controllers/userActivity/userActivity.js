const catchAsyncError = require('../../middlewares/catchAsyncError');
const UserActivity = require('../../model/userActivity');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

// Create a new user activity
const createUserActivity = catchAsyncError(async (req, res, next) => {
    try {
        const { activityType, activityDetails } = req.body;

        const newUserActivity = new UserActivity({
            user: req.user.id,
            activityType,
            activityDetails,
        });

        await newUserActivity.save();

        const successResponse = new SuccessHandler('User activity created successfully', newUserActivity);
        successResponse.sendResponse(res, 201);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

// Get all user activities
const getAllUserActivities = catchAsyncError(async (req, res, next) => {
    try {
        const userActivities = await UserActivity.find();
        const successResponse = new SuccessHandler('User activities retrieved successfully', userActivities);
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

// Get a single user activity by ID
const getUserActivityById = catchAsyncError(async (req, res, next) => {
    try {
        const userActivityId = req.params.id;
        const userActivity = await UserActivity.findById(userActivityId);

        if (!userActivity) {
            return next(new ErrorHandler('User activity not found', 404));
        }

        const successResponse = new SuccessHandler('User activity retrieved successfully', userActivity);
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

// Update a user activity by ID
const updateUserActivity = catchAsyncError(async (req, res, next) => {
    try {
        const userActivityId = req.params.id;
        const { activityType, activityDetails } = req.body;

        const userActivity = await UserActivity.findByIdAndUpdate(
            userActivityId,
            {
                activityType,
                activityDetails,
            },
            { new: true, runValidators: true }
        );

        if (!userActivity) {
            return next(new ErrorHandler('User activity not found', 404));
        }

        const successResponse = new SuccessHandler('User activity updated successfully', userActivity);
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

// Delete a user activity by ID
const deleteUserActivity = catchAsyncError(async (req, res, next) => {
    try {
        const userActivityId = req.params.id;
        const userActivity = await UserActivity.findByIdAndDelete(userActivityId);

        if (!userActivity) {
            return next(new ErrorHandler('User activity not found', 404));
        }

        const successResponse = new SuccessHandler('User activity deleted successfully', {});
        successResponse.sendResponse(res, 200);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = {
    createUserActivity,
    getAllUserActivities,
    getUserActivityById,
    updateUserActivity,
    deleteUserActivity,
};
