const mongoose = require('mongoose');

const MealTypeCategory = new mongoose.Schema({
  mealTypeCategory: {
    type: String,
    required: true,
    unique: true
  },
});

const MealType = mongoose.model('MealTypeCategory', MealTypeCategory);

module.exports = MealType;
