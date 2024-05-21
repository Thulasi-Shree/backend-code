const WebSocket = require('ws');
const ws = new WebSocket('ws://your-website-ws-endpoint'); 
const catchAsyncError = require('../../middlewares/catchAsyncError');
const Order = require('../../model/order');
const ErrorHandler = require('../../utils/errorHandler');
const {sendOrderReminderEmail} = require('../../utils/email');

const getActiveOrdersByBranchWs = catchAsyncError(async (req, res, next) => {
  try {
      const restaurantId = req.query.restaurantId;
      const selectedDate = req.query.selectedDate;

      if (!restaurantId || !selectedDate) {
          return res.status(400).json({ error: 'restaurantId and selectedDate are required' });
      }

      const activeOrders = await Order.find({
          restaurantId,
          orderDate: selectedDate,
          orderStatus: { $nin: 'Delivered' }
      });

      const adminEmail = 'thulasi9941@gmail.com';
      const sendWebSocketNotification = (order) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'order_reminder', orderId: order._id }));
        }
    };

      const calculateTimeDifferenceAndSendReminder = async (email, order) => {
        const currentYear = new Date().getFullYear();
        const combinedDateTimeString = `${order.orderDate}/${currentYear} ${order.selectedTimeSlot}`;
        const orderDateTime = new Date(combinedDateTimeString);
    
        const timeDifferenceInMinutes = (orderDateTime - new Date()) / (1000 * 60);
        if (timeDifferenceInMinutes <= 60 && timeDifferenceInMinutes > 0 && !order.reminderSent) {
            // Send order reminder email
            sendOrderReminderEmail(email, order);
    
            // Update the order in the database to mark the reminder as sent
            await Order.findByIdAndUpdate(order._id, { reminderSent: true });
    
            // Send WebSocket notification
            sendWebSocketNotification(order);
        }
    };
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      if (data.type === 'order_reminder') {
          console.log(`Received order reminder for orderId: ${data.orderId}`);
      }
  });
      // Iterate through active orders and send reminders
      for (const order of activeOrders) {
          await calculateTimeDifferenceAndSendReminder(adminEmail, order);
      }

      res.status(200).json(activeOrders);
  } catch (error) {
      next(new ErrorHandler(error.message, 500));
  }
});
module.exports = {
  getActiveOrdersByBranchWs
};