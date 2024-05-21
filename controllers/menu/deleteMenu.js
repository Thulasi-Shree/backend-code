const Menu = require('../../model/menuItem');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const deleteMenu = catchAsyncError(async (req, res, next) => {
    const menuId = req.params.id;

    try {
        const menu = await Menu.findOneAndDelete({ _id: menuId });

        if (!menu) {
            throw new ErrorHandler('Menu not found', 404); 
        }

        const successHandler = new SuccessHandler('Menu Deleted!');
        successHandler.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = deleteMenu;
