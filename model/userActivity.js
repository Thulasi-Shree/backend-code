//providing insights into user behavior and interactions within your application:

const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activityType: {
    type: String,
    required: true,
    enum: ['Login', 'Logout', 'Order Placed', 'Review Submitted', 'Promotion Applied', 'Other'],
  },
  activityDetails: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;
