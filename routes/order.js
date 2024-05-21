const express = require('express');
const {
    newOrder,
    getSingleOrder,
    myOrders,
    orders,
    ordersActive,
    ordersActivePickup,
    updateOrderStatus,
    deleteOrder,
    storeChosenPickupTime,
    
} = require('../controllers/order/order');

const {
    addAvailablePickupTimeSlots,
    deleteTimeSlotById,
    getAllTimeSlotsById,
    updateTimeSlotById,
    getAllTimeSlots,
} = require('../controllers/timeSlot/timeSlot')

const {
    getActiveOrdersByBranch,
    getNonActiveOrdersByBranch,
    getNonActiveOrdersByBranch1,
} = require('../controllers/order/orderHistory')
const getScheduledNotification = require('../controllers/order/scheduleReminder')
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

// User Routes

// Create New Order: POST /api/order/new
router.route('/order/new').post( newOrder);

// Get Single Order by ID: GET /api/order/:id
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);

// Get User's Orders: GET /api/myorders
// router.route('/myorders').get(isAuthenticatedUser, myOrders);
router.route('/myorders').get(isAuthenticatedUser, myOrders);

// Get Pickup Time Slots: GET /api/pickup-time-slots
router.route('/pickup-time-slots').get(isAuthenticatedUser);

// Store Chosen Pickup Time: POST /api/store-pickup-time
router.route('/store-pickup-time').post(isAuthenticatedUser, storeChosenPickupTime);

// Get All Time Slots: GET /api/time-slot
router.route('/time-slot').get( getAllTimeSlots);

// Get All Time Slots: GET /api/time-slot
router.route('/timeSlots').post( getAllTimeSlotsById);


// Admin Routes    

// Get All Order history for Admin: GET /api/admin/orders (Admin role required)
router.route('/admin/orders').get( orders);//isAuthenticatedUser, authorizeRoles('admin'),

// Get All Orders for Admin: GET /api/admin/orders (Admin role required) ordersActivePickup
router.route('/admin/orders/active').get( ordersActive);//isAuthenticatedUser, authorizeRoles('admin'),
router.route('/admin/orders/activeDelivery').get( ordersActivePickup);
// Update Order Status by ID: PUT /api/admin/order/:id (Admin role required)
router.route('/admin/order/:id').put(isAuthenticatedUser,  updateOrderStatus); //authorizeRoles('admin'),

// Delete Order by ID: DELETE /api/admin/order/:id (Admin role required)  
router.route('/admin/order/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

// Add Available Pickup Time Slots: POST /api/time-slot (Admin role required)
router.route('/time-slot').post(addAvailablePickupTimeSlots); //isAuthenticatedUser, authorizeRoles('admin'), 

// Update Time Slot by ID: PUT /api/time-slot (Admin role required)
router.route('/time-slot').put(isAuthenticatedUser, authorizeRoles('admin'), updateTimeSlotById);

// Delete Time Slot by ID: DELETE /api/time-slot/:id (Admin role required)
router.route('/time-slot/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteTimeSlotById);

// Get Active Orders by Restaurant ID: GET /api/admin/orderHistory-active/:restaurantId (Admin role required)
router.route('/admin/order/active').get(isAuthenticatedUser, getActiveOrdersByBranch);

// Get Non-Active Orders by Restaurant ID: GET /api/admin/orderHistory-nonActive/:restaurantId (Admin role required)
router.route('/admin/orderHistory-nonActive').post(isAuthenticatedUser, getNonActiveOrdersByBranch);
router.route('/nonActiveOrdersByBranch').post(isAuthenticatedUser, getNonActiveOrdersByBranch1);

router.route('/admin/notification').get(isAuthenticatedUser, getScheduledNotification);


module.exports = router; 