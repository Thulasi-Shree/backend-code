// orderScheduler.js
const schedule = require('node-schedule');
const { sendOrderReminderEmail } = require('../../utils/email'); 
const Order = require('../../model/order'); 
const catchAsyncError = require('../../middlewares/catchAsyncError');

const getScheduledNotification = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.query.restaurantId;
        const selectedDate = req.query.selectedDate;

        // Handle the case where restaurantId or selectedDate is not provided
        if (!restaurantId || !selectedDate) {
            return res.status(400).json({ error: 'restaurantId and selectedDate are required' });
        }

        const activeOrders = await Order.find({
            restaurantId,
            orderDate: selectedDate,
            orderStatus: { $nin: 'Delivered' }
        });

        const adminEmail = 'thulasi9941@gmail.com';

        // Function to calculate time difference and schedule reminder
        const scheduleReminder = (email, order) => {
            // Combine orderDate, selectedTimeSlot, and current year to create a valid Date object
            const currentYear = new Date().getFullYear();
            const combinedDateTimeString = `${order.orderDate}/${currentYear} ${order.selectedTimeSlot}`;
            const orderDateTime = new Date(combinedDateTimeString);

            // Schedule the reminder for 60 minutes before the order time
            const reminderDateTime = new Date(orderDateTime.getTime() - 60 * 60 * 1000);

            // Schedule the reminder using node-schedule
            const job = schedule.scheduleJob(order._id.toString(), reminderDateTime, async () => {
                // Send order reminder email
               sendOrderReminderEmail(email, order);

                // Update the order in the database to mark the reminder as sent
                await Order.findByIdAndUpdate(order._id, { reminderSent: true });

                console.log(`Order reminder sent for ID: ${order._id}`);
            });

            console.log(`Reminder scheduled for order ID: ${order._id}`);
        };

        // Iterate through active orders and schedule reminders
        for (const order of activeOrders) {
            // Schedule reminder for each order
            scheduleReminder(adminEmail, order);
        }

        res.status(200).json(activeOrders);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = getScheduledNotification;