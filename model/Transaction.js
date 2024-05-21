//allowing users to securely store their payment details for transactions:

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    trim: true,
  },
  transactionStatus:{
    type: Boolean
  },
  expirationDate: {
    type: String,
    required: true,
    trim: true,
  },
  cardType: {
    type: String,
    required: true,
    trim: true,
  },
  billingAddress: {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
