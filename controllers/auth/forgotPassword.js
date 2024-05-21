const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user'); 
const { sendEmail} = require('../../utils/email');
const ErrorHandler = require('../../utils/errorHandler');

exports.forgotPassword = catchAsyncError(async (req, res, next)=>{
        const user = await User.findOne({email: req.body.email})
    
        if(!user){
            return next(new ErrorHandler("User not found", 403))
        }
    
        const resetToken = user.getUserPassword(); 
    
        await user.save({validateBeforeSave: false})

        let BASE_URL = process.env.FRONTEND_URL;
        if (process.env.NODE_ENV === 'production') {
            BASE_URL = `${req.protocol}://${req.get('host')}`;
        }
    
        const resetUrl = `${BASE_URL}/api/password/reset/${resetToken}`
    
        const message = `Your password reset URL is: \n\n ${resetUrl} \n\n If not you, please ignore.`
    
        try{ 
           sendEmail({
                email: user.email,
                subject: "Food delivery app password recovery",
                message
            })
    
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`
        
               
            }) 
    
        }catch(err){
            user.resetPassword = undefined;
            user.resetPasswordTokenExpire = undefined
            await user.save({validateBeforeSave: false})
            return next(new ErrorHandler(err.message), 500)
        }
    })
