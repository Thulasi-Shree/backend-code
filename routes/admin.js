const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin/index');

// Get All Users for Admin: GET /api/admin/users
router.get('/admin/users', adminController.getAllUsers);

// Get All Users for Admin: GET /api/admin/users
router.get('/admin/search/users', adminController.searchUser);

// Get All Users for Admin: GET /api/admin/admins
router.get('/admin/admins', adminController.getAllAdmins);

// Get User by ID for Admin: GET /api/admin/user/:id
router.get('/admin/user/:id', adminController.getUser);

// Update User by ID for Admin: PUT /api/admin/user/:id
router.put('/admin/user/:id', adminController.updateUser);

// Delete User by ID for Admin: DELETE /api/admin/user/:id
router.delete('/admin/user/:id', adminController.deleteUser);


module.exports = router;
