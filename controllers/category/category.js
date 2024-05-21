const catchAsyncError = require('../../middlewares/catchAsyncError');
const MealTypeCategory = require('../../model/MealTypeCategory');
const DietaryPreferenceCategory = require('../../model/DietaryPreferenceCategory');
const ErrorHandler = require('../../utils/errorHandler');

exports.getAllMealTypes = catchAsyncError(async (req, res, next) => {
  try {
    const mealTypes = await MealTypeCategory.find();
    res.status(200).json({
      success: true,
      data: mealTypes,
    });
  } catch (error) {
    next(new ErrorHandler('Internal Server Error', 500));
  }
});

exports.createMealType = catchAsyncError(async (req, res, next) => {
  try {
    const { mealTypeCategory } = req.body;
    const mealType = await MealTypeCategory.create({ mealTypeCategory });
    res.status(201).json({
      success: true,
      data: mealType,
    });
  } catch (error) {
    next(new ErrorHandler('Internal Server Error', 500));
  }
});

exports.deleteMealType = catchAsyncError(async (req, res, next) => {
  try {
    const mealType = await MealTypeCategory.findByIdAndDelete(req.params.id);
    if (!mealType) {
      return next(new ErrorHandler('Meal type not found', 404));
    }
    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(new ErrorHandler('Internal Server Error', 500));
  }
});


exports.getAllDietaryPreferences = catchAsyncError(async (req, res, next) => {
  try {
    const dietaryPreferences = await DietaryPreferenceCategory.find();
    res.status(200).json({
      success: true,
      data: dietaryPreferences,
    });
  } catch (error) {
    next(new ErrorHandler('Internal Server Error', 500));
  }
});

exports.createDietaryPreference = catchAsyncError(async (req, res, next) => {
  try {
    const { dietaryPreferenceCategory } = req.body;
    const dietaryPreference = await DietaryPreferenceCategory.create({ dietaryPreferenceCategory });
    res.status(201).json({
      success: true,
      data: dietaryPreference,
    });
  } catch (error) {
    next(new ErrorHandler('Internal Server Error', 500));
  }
});

exports.deleteDietaryPreference = catchAsyncError(async (req, res, next) => {
  try {
    const dietaryPreference = await DietaryPreferenceCategory.findByIdAndDelete(req.params.id);
    if (!dietaryPreference) {
      return next(new ErrorHandler('Dietary preference not found', 404));
    }
    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(new ErrorHandler('Internal Server Error', 500));
  }
});
