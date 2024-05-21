const Menu = require('../../model/menuItem');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const newMenu = catchAsyncError(async (req, res, next) => {
    try {
        let images = [];
        let BASE_URL = process.env.BACKEND_URL;
        if (process.env.NODE_ENV === "production") {
            BASE_URL = `${req.protocol}://${req.get('host')}`;
        }
        
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                let url = `${BASE_URL}/uploads/product/${file.originalname}`;
                images.push({ image: url });
            });
        }

        req.body.images = images;

        const menu = await Menu.create(req.body);

        const successHandler = new SuccessHandler('Menu created successfully', menu);
        successHandler.sendResponse(res, 201);
    } catch (error) {
        
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = newMenu;
