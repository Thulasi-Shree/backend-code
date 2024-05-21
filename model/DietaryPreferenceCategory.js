
const mongoose = require('mongoose');

const DietaryPreferenceCategory = new mongoose.Schema({
  dietaryPreferenceCategory: {
    type: String,
    required: true,
    unique: true
  },
});

const DietaryPreference = mongoose.model('DietaryPreferenceCategory', DietaryPreferenceCategory);

module.exports = DietaryPreference;
