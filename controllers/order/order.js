const catchAsyncError = require('../../middlewares/catchAsyncError');
const { startOfWeek, startOfMonth, subMonths, subYears } = require('date-fns');
const Order = require('../../model/order');
const Cart = require('../../model/cart');

const ErrorHandler = require('../../utils/errorHandler');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../../utils/email');

exports.newOrder = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.body.restaurantId ? req.body.restaurantId.toString() : null;
        const restaurantBranch = req.body.restaurantBranch ? req.body.restaurantBranch.toString() : null;
        const {
            shipping,
            email,
            userId,
            delivery,
            phone,
            items,
            emailOrMobile,
            orderInstruction,
            deliveryInstruction,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentStatus,
            selectedTimeSlot,
            paymentInfo,
            orderType,
            orderDate
        } = req.body;

        const order = await Order.create({
            items,
            email,
            phone,
            shipping,
            delivery,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paymentStatus,
            orderInstruction,
            deliveryInstruction,
            selectedTimeSlot,
            orderType,
            emailOrMobile,
            restaurantId, 
            restaurantBranch, 
            orderDate,   
            paidAt: Date.now(),
            userId
        });

        sendOrderConfirmationEmail(order.shipping.email, order);
        if (!order.shipping.email) {
            sendOrderConfirmationEmail(order.shipping.emailOrMobile, order);
          }

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});
   
exports.updateOrderStatus = catchAsyncError( async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
        sendOrderStatusUpdateEmail(order.shipping.email, order);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});
exports.myOrders = catchAsyncError(async (req, res, next) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            throw new ErrorHandler('Invalid user ID provided in the request', 400);
        }

        const order = await Order.find({ userId });

        if (!order) {
            throw new ErrorHandler(`Order not found`, 404);
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        // Pass the error to the next middleware
        next(error);
    }
});
  
exports.orders = catchAsyncError(async (req, res, next) => {
    const { page = 1, pageSize = 30 } = req.query;
    try {
      const totalItems = await Order.countDocuments();
      const { startDate, endDate, orderType } = req.query;
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);
  
      const query = {
        createdAt: {
          $gte: startDateTime,
          $lte: endDateTime,
        },
        orderStatus: 'Delivered',
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
            totalPrice: { $sum: "$totalPrice" },
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
  

exports.ordersActive = catchAsyncError(async (req, res, next) => {
    const { page = 1, pageSize = 20 } = req.query;
    try {
        const totalItems = await Order.countDocuments();
        const restaurantId = req.query.restaurantId;
        const selectedDate = req.query.selectedDate;

        const skip = (page - 1) * pageSize;
        const orders = await Order.find({orderStatus: { $nin: 'Delivered' },
        orderDate: selectedDate,}).skip(skip).limit(parseInt(pageSize));

        res.set('X-Total-Count', totalItems.toString());

        let totalAmount = 0;
        const activeOrders = await Order.find({
            restaurantId,
            orderDate: selectedDate,
            orderStatus: { $nin: 'Delivered' }
        });
        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });
        const adminEmail = 'thulasi9941@gmail.com';
        const calculateTimeDifferenceAndSendReminder = async (email, order) => {
            const currentYear = new Date().getFullYear();
            const combinedDateTimeString = `${order.orderDate}/${currentYear} ${order.selectedTimeSlot}`;
            const orderDateTime = new Date(combinedDateTimeString);
            console.log(orderDateTime)

            const timeDifferenceInMinutes = (orderDateTime - new Date()) / (1000 * 60);
            console.log(timeDifferenceInMinutes)

            if (timeDifferenceInMinutes <= 60 && timeDifferenceInMinutes > 0 && !order.reminderSent) {
                await Order.findByIdAndUpdate(order._id, { reminderSent: true });
            }
        };

        for (const order of activeOrders) {
            await calculateTimeDifferenceAndSendReminder(adminEmail, order);
        }
        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});
exports.ordersActivePickup = catchAsyncError(async (req, res, next) => {
    try {
        const orders = await Order.find( {orderStatus: { $nin: 'Delivered' }, orderType: { $in: 'Delivery' } } );
        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});

exports.storeChosenPickupTime = async (req, res) => {
    try {
        const { orderId, chosenPickupTime } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { pickupTime: chosenPickupTime }, { new: true }).populate('pickupTime', 'slot');

        res.status(200).json({ success: true, message: 'Chosen pickup time stored successfully', order });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
