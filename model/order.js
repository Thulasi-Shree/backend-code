const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    shipping: {
        name: String,
        email: String,
        phone: Number,
        emailOrMobile: String,
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String
        },

    },
    delivery: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    items: [{
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
        },
        itemQuantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    itemsPrice: {
        type: Number,
    },
    userId: {
        type: String,
        // required: true,
        // ref: 'User'
    },

    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    deliveryInstruction: {
        type: String
    },
    orderInstruction: {
        type: String
    },
    paymentInfo: {

        type: String
    },
    paymentStatus: {
        type: String

    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    orderType: {
        type: String,
        required: true,
        // default: 'delivery'
    },
    orderDate: {
        type: String,
        required: true
    },
    reminderSent: {
        type: Boolean,
        default: false,
    },
    // pickupTime: {
    //     type: String
    // },
    selectedTimeSlot: {
        type: String,
        required: true,
    },
    // availableTimeSlots: {
    //     type: String,
    //     required: true,
    // },
    // selectedDate: {
    //     type: String,
    //     required: true,
    // },
    orderStatus: {
        type: String,
        required: true,
        default: 'Order Placed'
    },
    restaurantId: {
        type: String,
    },
    orderNotes: {
        type: String,
    },
    restaurantBranch: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;
