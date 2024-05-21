const express = require('express');
const router = express.Router();
const {contactUs} = require('../controllers/feedBack/ContactUs')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');

router.route('/send-email').post(contactUs);




module.exports = router;