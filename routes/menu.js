const express = require('express');
const newProduct = require('../controllers/menu/createMenu')
const getAdminProducts = require('../controllers/menu/getAdminMenus')
const updateProduct = require('../controllers/menu/updateMenu')
const {getMenus, getAdminMenusByBranch} = require('../controllers/menu/getMenus')
// const getAdminMenusByBranch = require('../controllers/menu/getMenus')
const  getSingleMenu = require('../controllers/menu/getSingleMenu');
const  deleteProduct = require('../controllers/menu/deleteMenu');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const multer = require('multer');
const path = require('path')

const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/product' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

// Get All Products: GET /api/products
router.route('/products').get(getMenus);

// Get Single Product by ID: GET /api/product/:id
router.route('/product/:id').get(getSingleMenu);

// Admin Routes

// Create New Product: POST /api/admin/product/new
router.route('/admin/product/new').post( upload.array('images'), newProduct);

// Get All Admin Products: GET /api/admin/products (Admin role required)
router.route('/admin/products').get( getAdminProducts);

// Get All Admin Products by brand: GET /api/admin/products (Admin role required)
router.route('/admin/products/branch').post( getAdminMenusByBranch);

// Delete Product by ID: DELETE /api/admin/product/:id (Admin role required)
router.route('/admin/product/:id').delete(isAuthenticatedUser,  deleteProduct); //authorizeRoles('admin'), 

// Update Product by ID: PUT /api/admin/product/:id (Admin role required)
router.route('/admin/product/:id').put(isAuthenticatedUser,  upload.array('images'), updateProduct);//authorizeRoles('admin'),


module.exports = router;    