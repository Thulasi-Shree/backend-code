const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    coordinates: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
        },
    },
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    }],
    sales: {
        type: Number,
        default: 0,
    },
    taxRate: {
        type: Number,
        default: 0,
    },
    averageDeliveryTime: {
        type: Number, 
        default: 0,
    },
    customerRatings: [{
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
    }],
    revenue: {
        type: Number,
        default: 0,
    },
    totalOrders: {
        type: Number,
        default: 0,
    },
    deliveryCount: {
        type: Number,
        default: 0,
    },
    bestSellerItems: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
        },
        orderCount: {
            type: Number,
            default: 0,
        },
    }],
    // More analytics-related fields can be added as needed
});

locationSchema.index({ coordinates: '2dsphere' }); // Creating the 2dsphere index

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
