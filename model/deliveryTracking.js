const mongoose = require('mongoose');

const deliveryTrackingSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  currentLocation: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
    },
  }, 
  estimatedDeliveryTime: {
    type: Date,
  },
  updatedTimestamp: {
    type: Date,
    default: Date.now,
  },
  deliveredTime: {
    type: Date, 
  },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPerson', 
  },
});

// Index for geospatial query based on current location
deliveryTrackingSchema.index({ currentLocation: '2dsphere' });

const DeliveryTracking = mongoose.model('DeliveryTracking', deliveryTrackingSchema);

module.exports = DeliveryTracking;

