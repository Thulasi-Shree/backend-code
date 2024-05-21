const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')

const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/user' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

const registerController = require('../controllers/auth/register');
const {confirmRegistration} = require('../controllers/auth/confirmRegistration')
const loginController = require('../controllers/auth/login');
const loginOtpController = require('../controllers/auth/login');
const guestOtpController = require('../controllers/auth/guestUser');
const logoutController = require('../controllers/auth/logout');
const forgotPasswordController = require('../controllers/auth/forgotPassword');
const resetPasswordController = require('../controllers/auth/resetPassword');
const profileController = require('../controllers/auth/profile');
const { isAuthenticatedUser } = require('../middlewares/authenticate');

// User Registration: POST /api/register
router.post('/register', registerController.registerUser);
router.post('/verify-email/:token', confirmRegistration);

// User Login with Credentials: POST /api/login
router.post('/login', loginController.loginUser);

// Send OTP in Mail for Login: POST /api/login/otp
router.post('/login/otp', loginOtpController.sendUserOtp); 

// guest user
router.post('/send/otp', guestOtpController.sendGuestUserOtp);
router.post('/verify/otp', guestOtpController.verifyGuestUserOtp);


// User Logout: POST /api/logout
router.post('/logout', logoutController.logoutUser);

// Forgot Password: POST /api/password/forgot
router.post('/password/forgot', forgotPasswordController.forgotPassword);

// Reset Password with Token: PUT /api/password/reset/:token
router.put('/password/reset/:token', resetPasswordController.resetPassword);

// Get User Profile: GET /api/myprofile/:token   
router.get('/myprofile/:token', profileController.getUserProfile);
router.route('/myprofile').get(isAuthenticatedUser, loginController.getUserProfile);

// Change Password: PUT /api/password/change/:id
router.put('/password/change/:id', profileController.changePassword);

// Update User Profile: PUT /api/update/:token
router.put('/update/:token', profileController.updateProfile);

//
router.route('/update1/:id').put(upload.single('avatar'), registerController.updateUserProfile);


module.exports = router;
