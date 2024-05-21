const express = require('express');
const contentController = require('../controllers/content/carousel');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const multer = require('multer');
const path = require('path')

const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/carousel' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

// Get All carousel: GET /api/carousel
router.route('/carousel').get(contentController.getCarousel);

// Get Single carousel by ID: GET /api/carousel/:id
router.route('/carousel/:id').get(contentController.getSingleCarousel);

// Create New carousel: POST /api/admin/carousel/new
router.route('/admin/carousel/new').post( upload.array('images'), contentController.createCarousel);

// Delete carousel by ID: DELETE /api/admin/carousel/:id (Admin role required)
router.route('/admin/carousel/:id').delete(isAuthenticatedUser, authorizeRoles('superAdmin'), contentController.deleteCarousel);

// Update carousel by ID: PUT /api/admin/carousel/:id (Admin role required)
router.route('/admin/carousel/:id').put(isAuthenticatedUser,  upload.array('images'), contentController.updateCarousel);//authorizeRoles('admin'),


module.exports = router;    