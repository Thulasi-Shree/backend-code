
const express = require('express');
const router = express.Router();
const mealTypeCategoryController = require('../controllers/category/category');
const dietaryPreferenceCategoryController = require('../controllers/category/category');

// MealTypeCategory routes
router.get('/meal-types', mealTypeCategoryController.getAllMealTypes);
router.post('/meal-types', mealTypeCategoryController.createMealType);
router.delete('/meal-types/:id', mealTypeCategoryController.deleteMealType);

// DietaryPreferenceCategory routes
router.get('/dietary-preferences', dietaryPreferenceCategoryController.getAllDietaryPreferences);
router.post('/dietary-preferences', dietaryPreferenceCategoryController.createDietaryPreference);
router.delete('/dietary-preferences/:id', dietaryPreferenceCategoryController.deleteDietaryPreference);

module.exports = router;
