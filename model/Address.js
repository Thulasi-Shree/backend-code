const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  mobileNumber:{
    type: Number,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  line1: {
    type: String,
    // default: null,
  },
  line2: {
    type: String,
    // default: null,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  postal_code: {
    type: String,
    required: true,
  },
  
  country: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    default: null,
},
longitude: {
    type: Number,
    default: null,
},

});

const Address = mongoose.model('Address', addressSchema, 'address');

module.exports = Address;
