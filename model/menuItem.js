const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter food item name"],
        trim: true,
        maxLength: [100, "Food item name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: true,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Please enter food item description"]
    },
    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    },
    itemQuantity: {
        type:Number,
        // required: true
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    mealTypeCategory: {
        type: String,
        // enum: [
        //     'Appetizers',
        //     'Main Course',
        //     'Desserts',
        //     'Beverages',
        //     'Other'
        // ],
        required: true,
    },
    dietaryPreferenceCategory: {
        type: String,
        // enum: [
        //     'Vegetarian', 
        //     'Non-vegetarian',
        //     'Vegan',
        //     'Gluten-Free',
        //     'Halal',   
        //     'Other'
        // ],
        required: true,
    },
    restaurantId: {
        type: String,
        required: [true, "Please specify the restaurant Id"]
    },
    restaurantBranch: {
        type: String,
        required: [true, "Please specify the restaurant branch"]
    },
    isAvailable: {
        type: Boolean,
        // default: true
    },
    availableDate: {
        type: Date, 
    },
    isPreOrderAvailable: {
        type: Boolean,
        default: true 
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    preparationTime: Date,
    lastEdited: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
