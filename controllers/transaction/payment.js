const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncError = require("../../middlewares/catchAsyncError");

exports.processPayment = catchAsyncError(async (req, res, next) => {
    console.log(`Received request at: ${req.originalUrl}`);
    try {
        const { amount, shipping } = req.body;
        console.log(`Received request at: ${req.originalUrl}`);
        if (!amount || !shipping) {
            return res.status(400).json({ success: false, error: "Invalid input data" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            description: "PAYMENT",
            metadata: { integration_check: "accept_payment" },
            shipping
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret
        });
    } catch (error) {
        console.log(`Received request at: ${req.originalUrl}`);
        next(new ErrorHandler(error.message, 500));
        res.status(500).json({ success: false, error: "An error occurred while processing the payment." });
    }
});

exports.sendStripeApi = catchAsyncError((req, res) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_PUBLIC_KEY 
    });
});
