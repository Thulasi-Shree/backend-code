const express = require('express');
const createRestaurant = require('../controllers/restaurant/createRestaurant');
const { getRestaurant, getRestaurantById, getRestaurantByRestaurantId} = require('../controllers/restaurant/getRestaurants') 
const  deleteRestaurant = require('../controllers/restaurant/deleteRestaurant')
const updateRestaurant = require('../controllers/restaurant/updateRestaurant')
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

            
// Create Restaurant: POST /api/restaurant/create (User role required)
router.route('/restaurant/create').post(isAuthenticatedUser, createRestaurant);

// Delete Restaurant by ID: DELETE /api/restaurant/delete/:id (Admin role required)
router.route('/restaurant/delete/:id').delete(isAuthenticatedUser, authorizeRoles('superAdmin'), deleteRestaurant);

// Get Restaurant: GET /api/restaurant/get (User role required)
router.route('/restaurant/get').get(getRestaurant);  

// Get Restaurant: GET /api/restaurant/get (User role required)
router.route('/restaurant/get/:id').get(getRestaurantById);
router.route('/restaurant').get(getRestaurantByRestaurantId);
// Update Restaurant by ID: PUT /api/restaurant/edit/:id (User role required)
router.route('/restaurant/edit/:id').put(isAuthenticatedUser, updateRestaurant);

module.exports = router; 