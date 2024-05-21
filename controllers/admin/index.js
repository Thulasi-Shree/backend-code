const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');
const APIFeatures = require('../../utils/apiFeatures');

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const resPerPage = 30;
    try {
        const filteredUsersCount = await new APIFeatures(User.find(), req.query).query.countDocuments({});
        const totalUsersCount = await User.countDocuments({});
        const usersCount = (filteredUsersCount !== totalUsersCount) ? filteredUsersCount : totalUsersCount;
        const Users = await new APIFeatures(User.find(), req.query)
        .search()
            .paginate(resPerPage)
            .query;

        if (!Users || Users.length === 0) {
            res.status(200).json({
                success: true,
                count: usersCount,
                resPerPage,
                Users
            });
        }
        res.status(200).json({
            success: true,
            count: usersCount,
            resPerPage,
            Users
        });
    } catch (error) {
        next(new ErrorHandler(error.message)); // Passes the error to the global error handling middleware
    }
});
exports.searchUser = catchAsyncError(async (req, res, next) => {
    const resPerPage = 30;
    try {
        const filteredUsersCount = await new APIFeatures(User.find(), req.query).query.countDocuments({});
        const totalUsersCount = await User.countDocuments({});
        const usersCount = (filteredUsersCount !== totalUsersCount) ? filteredUsersCount : totalUsersCount;
        const Users = await new APIFeatures(User.find(), req.query)
        .search()
            .paginate(resPerPage)
            .query;

        if (!Users || Users.length === 0) {
            const errorHandler = new ErrorHandler('No users found', 400);
            return next(errorHandler);
        }
        res.status(200).json({
            success: true,
            count: usersCount,
            resPerPage,
            Users
        });
    } catch (error) {
        next(new ErrorHandler(error.message));
    }
});

exports.getAllAdmins = catchAsyncError(async (req, res, next) => {
    const resPerPage = 30;
    try {
        const filteredUsersCount = await new APIFeatures(User.find({ role: { $nin: 'user' } }), req.query).query.countDocuments({});

        const totalUsersCount = await User.countDocuments({});
        const usersCount = (filteredUsersCount !== totalUsersCount) ? filteredUsersCount : totalUsersCount;

        const Users = await new APIFeatures(User.find({ role: { $nin: 'user' } }), req.query)
            .paginate(resPerPage)
            .query;

        if (!Users || Users.length === 0) {
            const errorHandler = new ErrorHandler('No users found', 400);
            return next(errorHandler);
        }

        res.status(200).json({
            success: true,
            count: usersCount,
            resPerPage,
            Users
        });
    } catch (error) {
        next(new ErrorHandler(error.message)); 
    }
});

exports.getUser = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
        }
        const successResponse = new SuccessHandler('User retrieved successfully', user);
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message)); 
    }
});

exports.updateUser = catchAsyncError(async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            restaurantBranch: req.body.assignBranch,
            restaurantId: req.body.assignBranchId
        };

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
        });

        const successResponse = new SuccessHandler('User updated successfully', user);
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message)); 
    }
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
        }
        await User.deleteOne({ _id: req.params.id });
        const successResponse = new SuccessHandler('User deleted successfully');
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message)); 
    }
});


