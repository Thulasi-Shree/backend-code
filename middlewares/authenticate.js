const ErrorHandler = require("../utils/errorHandler");
const User = require('../model/user')
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = catchAsyncError( async (req, res, next) => {
   const { token  }  = req.cookies;
   
   if( !token ){
        return next(new ErrorHandler('Login first to handle this resource', 400))
   }

   try {
    const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRECT);
    req.user = await User.findById(decoded.id);
    next();
} catch (error) {
    return next(new ErrorHandler('Invalid or expired token', 400));
}
})

exports.authorizeRoles = (...roles) => { 
   return  (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 400))
        }
        next()
    }
}  