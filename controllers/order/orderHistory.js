const catchAsyncError = require('../../middlewares/catchAsyncError');
const Order = require('../../model/order');
const ErrorHandler = require('../../utils/errorHandler');
const { sendOrderReminderEmail } = require('../../utils/email');

const getActiveOrdersByBranch = catchAsyncError(async (req, res, next) => {
    const { page = 1, pageSize = 20 } = req.query;
    try {
        const totalItems = await Order.countDocuments();
        const restaurantId = req.query.restaurantId;
        const selectedDate = req.query.selectedDate;

        // Handle the case where restaurantId or selectedDate is not provided
        if (!restaurantId || !selectedDate) {
            return res.status(400).json({ error: 'restaurantId and selectedDate are required' });
        }
        const skip = (page - 1) * pageSize;
        const activeOrders = await Order.find({
            restaurantId,
            orderDate: selectedDate,
            orderStatus: { $nin: 'Delivered' }
        }).skip(skip).limit(parseInt(pageSize));

        res.set('X-Total-Count', totalItems.toString());


        const adminEmail = 'thulasi9941@gmail.com';

        // Function to calculate time difference and send reminder
        const calculateTimeDifferenceAndSendReminder = async (email, order) => {
            // Combine orderDate, selectedTimeSlot, and current year to create a valid Date object
            const currentYear = new Date().getFullYear();
            const combinedDateTimeString = `${order.orderDate}/${currentYear} ${order.selectedTimeSlot}`;
            const orderDateTime = new Date(combinedDateTimeString);
            console.log(orderDateTime)

            // Calculate the time difference in minutes
            const timeDifferenceInMinutes = (orderDateTime - new Date()) / (1000 * 60);
            console.log(timeDifferenceInMinutes)

            // Check if the order is within 60 minutes and hasn't been reminded yet
            if (timeDifferenceInMinutes <= 60 && timeDifferenceInMinutes > 0 && !order.reminderSent) {
                // Send order reminder email
                // await sendOrderReminderEmail(email, order);
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(`Order reminder for order ID ${order._id}`);
                    }
                });
                // Update the order in the database to mark the reminder as sent
                await Order.findByIdAndUpdate(order._id, { reminderSent: true });
            }
        };

        // Iterate through active orders and send reminders
        for (const order of activeOrders) {
            await calculateTimeDifferenceAndSendReminder(adminEmail, order);
        }

        res.status(200).json(activeOrders);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }

});


const getNonActiveOrdersByBranch = catchAsyncError(async (req, res, next) => {
    const { page = 1, pageSize = 30 } = req.query;
    try {
        const totalItems = await Order.countDocuments();
        const { startDate, endDate, orderType } = req.query;
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        const restaurantId = req.body.restaurantId;

        const query = {
            createdAt: {
                $gte: startDateTime,
                $lte: endDateTime,
            },
            orderStatus: 'Delivered',
            restaurantId: restaurantId,
        };
        if (orderType) {
            query.orderType = orderType;
        }
        const skip = (page - 1) * pageSize;
  
      const nonActiveOrders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(pageSize))
        .lean()
        .exec();
  
      res.set('X-Total-Count', totalItems.toString());
        const totalOrders = await Order.aggregate([
            {
                $match: query,
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalPrice: { $sum: "$totalPrice" }
                },
            },
        ]).exec();
        const totalOrdersCount = totalOrders.length > 0 ? totalOrders[0].totalOrders : 0;
        const totalPrice = totalOrders.length > 0 ? Number(totalOrders[0].totalPrice.toFixed(2)) : 0;
        res.status(200).json({ nonActiveOrders, totalOrders: totalOrdersCount, totalPrice });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});
const getNonActiveOrdersByBranch1 = catchAsyncError( async (req, res, next) => {
    const { page = 1, pageSize = 30, sortDirection = 'asc' } = req.query;
  
    try {
      const { startDate, endDate, orderType } = req.query;
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);
  
      const restaurantId = req.body.restaurantId;
  
      const query = {
        createdAt: {
          $gte: startDateTime,
          $lte: endDateTime,
        },
        orderStatus: 'Delivered',
        restaurantId: restaurantId,
      };
  
      if (orderType) {
        query.orderType = orderType;
      }
  
      const totalItems = await Order.countDocuments(query);
  
      const skip = (page - 1) * pageSize;
  
      const sortOrder = sortDirection === 'desc' ? -1 : 1;
  
      const nonActiveOrders = await Order.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(parseInt(pageSize))
        .lean()
        .exec();
  
      res.set('X-Total-Count', totalItems.toString());
  
      const totalOrders = await Order.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalPrice: { $sum: '$totalPrice' },
          },
        },
      ]).exec();
  
      const totalOrdersCount = totalOrders.length > 0 ? totalOrders[0].totalOrders : 0;
      const totalPrice = totalOrders.length > 0 ? Number(totalOrders[0].totalPrice.toFixed(2)) : 0;
  
      res.status(200).json({ nonActiveOrders, totalOrders: totalOrdersCount, totalPrice });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  });

const getNotification = catchAsyncError(async (req, res, next) => {

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

        const calculateTimeDifferenceAndSendReminder = async (email, order) => {
            const currentYear = new Date().getFullYear();
            const combinedDateTimeString = `${order.orderDate}/${currentYear} ${order.selectedTimeSlot}`;
            const orderDateTime = new Date(combinedDateTimeString);

            // Calculate the time difference in minutes
            const timeDifferenceInMinutes = (orderDateTime - new Date()) / (1000 * 60);

            // Check if the order is within 60 minutes and hasn't been reminded yet
            if (timeDifferenceInMinutes <= 60 && timeDifferenceInMinutes > 0 && !order.reminderSent) {
             
                await Order.findByIdAndUpdate(order._id, { reminderSent: true });

                sendWebSocketNotification(order);
                res.json({
                    reminder: {
                        orderId: order._id,
                        message: `Order reminder for the id - ${order._id}.`
                    }
                });
            }
        };
        for (const order of activeOrders) {
            await calculateTimeDifferenceAndSendReminder(adminEmail, order);
        }

        res.status(200).json(activeOrders);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = {
    getActiveOrdersByBranch,
    getNonActiveOrdersByBranch,
    getNonActiveOrdersByBranch1,
    getNotification
};
