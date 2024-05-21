const express = require('express');
const router = express.Router();
const {
    createUserActivity,
    getAllUserActivities,
    getUserActivityById,
    updateUserActivity,
    deleteUserActivity
} = require('../controllers/userActivity/userActivity');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');


// Create User Activity: POST /api/activity (User role required)
router.route('/activity').post(isAuthenticatedUser, createUserActivity);

// Get All User Activities: GET /api/activities (User role required)
router.route('/activities').get(isAuthenticatedUser, getAllUserActivities);

// Get User Activity by ID: GET /api/activity/:id (User role required)
router.route('/activity/:id').get(isAuthenticatedUser, getUserActivityById);

// Update User Activity by ID: PUT /api/activity/:id (Admin role required)
router.route('/activity/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateUserActivity);

// Delete User Activity by ID: DELETE /api/activity/:id (Admin role required)
router.route('/activity/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUserActivity);


module.exports = router;
