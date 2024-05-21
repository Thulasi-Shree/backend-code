const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  slot: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: String,
    required: true,
},
restaurantName: {
    type: String,
    required: true,
},
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
