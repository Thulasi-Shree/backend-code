const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  type: {
    type: String,
    enum: ['Bug Report', 'Suggestion', 'Complaint', 'Compliment', 'Other'],
    required: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
