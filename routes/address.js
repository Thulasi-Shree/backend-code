const express = require('express');
const router = express.Router();
const getAllAddress = require('../controllers/address/getAllAddress');
const createAddress = require('../controllers/address/createAddress');
const updateAddress = require('../controllers/address/updateAddress');
const deleteAddress = require('../controllers/address/deleteAddress');
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');



// Create Address: POST /api/address/new (Private - User role required)
router.route('/address/new').post(createAddress);//authorizeRoles('user'),

// Get All Addresses: GET /api/address (Private - Admin role required)
router.route('/address').get(isAuthenticatedUser, authorizeRoles('admin'), getAllAddress);

// Update Address by ID: PUT /api/address/edit/:id (Private - User role required)
router.route('/address/edit/:id').put(isAuthenticatedUser, authorizeRoles('user'), updateAddress);

// Delete Address by ID: DELETE /api/address/delete/:id (Private - User role required)
router.route('/address/delete/:id').delete(isAuthenticatedUser, authorizeRoles('user'), deleteAddress);


module.exports = router;