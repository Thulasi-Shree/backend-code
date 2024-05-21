const Menu = require('../../model/menuItem');
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const SuccessHandler = require('../../utils/successHandler');

const getSingleMenu = catchAsyncError(async (req, res, next) => {
    try {
        const menu = await Menu.findById(req.params.id);

        if (!menu) {
            return next(new ErrorHandler('Menu not found', 404));
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        res.status(200).json({
            success: true,
            menu
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = getSingleMenu;
