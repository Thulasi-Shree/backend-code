const Menu = require('../../model/menuItem');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const getAdminMenus = catchAsyncError(async (req, res, next) => {
    const { page = 1, pageSize = 30 } = req.query;
    try {
        const totalItems = await Menu.countDocuments();
        const totalPages = Math.ceil(totalItems / pageSize);

        const skip = (page - 1) * pageSize;
        const menus = await Menu.find().skip(skip).limit(parseInt(pageSize));

        res.set('X-Total-Count', totalItems.toString());
        res.set('X-Total-Pages', totalPages.toString());

        const successHandler = new SuccessHandler('Menus fetched successfully', menus);
        successHandler.sendResponse(res, 200);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = getAdminMenus;
