const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const autopopulate = require('mongoose-autopopulate');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please enter last name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address'],

    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, 'any', { strictMode: false });
            },
            message: 'Please enter a valid phone number',
        },
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
    avatar: {
        type: String,
        // required: true,
        // default: 'uploads/user/avatar.jng'
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'DeliveryPerson', 'superAdmin'],
        default: 'user',
    },
    restaurantBranch: {
        type: String
    },
    restaurantId: {
        type: String
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    appliedPromotions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
    }],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    loginOtp: String,
    loginOtpExpire: Date,
    resetPasswordToken: String,

    resetPasswordTokenExpire: Date,
    emailVerificationToken: String,
    emailVerificationSentAt: Date,
    emailVerificationStatus: { type: Boolean, default: false },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});
userSchema.methods.generateEmailVerificationToken = function () {
    // Generate a random token using crypto module
    const token = crypto.randomBytes(32).toString('hex');

    // Save the generated token to the user's emailVerificationToken field
    this.emailVerificationToken = token;

    // Save the current timestamp when the verification email is sent
    this.emailVerificationSentAt = new Date();

    // Return the generated token
    return token;
};
// Apply the uniqueValidator plugin to enforce unique constraints
userSchema.plugin(uniqueValidator);

userSchema.plugin(autopopulate);

userSchema.methods.generateHashedOtp = async function (otp) {
    return await bcrypt.hash(otp, 10);
};






userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.getJwtToken = function () {
    try {
        return jwt.sign({ id: this.id }, process.env.JSON_WEB_TOKEN_SECRECT, {
            expiresIn: process.env.JSON_WEB_TOKEN_EXPIRE_DATE
        });
    } catch (error) {
        throw new Error('Token generation failed');
    }
};

userSchema.methods.isValidPassword = async function (reqPassword) {
    try {
        return await bcrypt.compare(reqPassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

userSchema.methods.getUserPassword = function () {
    try {
        const token = crypto.randomBytes(20).toString('hex');
        this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 10000;
        return token;
    } catch (error) {
        throw new Error('Token generation for password reset failed');
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;