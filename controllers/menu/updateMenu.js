const fs = require('fs');
const path = require('path');
const Menu = require('../../model/menuItem');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const updateMenu = catchAsyncError(async (req, res, next) => {
    try {
        let menu = await Menu.findById(req.params.id);

        if (!menu) {
            return next(new ErrorHandler('Menu not found', 404));
        }

        let images = [];
        let BASE_URL = process.env.BACKEND_URL;

        if (process.env.NODE_ENV === "production") {
            BASE_URL = `${req.protocol}://${req.get('host')}`;
        }

        // If new images are uploaded, delete the old ones
        if (req.files && req.files.length > 0) {
            // Delete old images from the server
            menu.images.forEach(image => {
                const imagePath = path.join(__dirname, '../../uploads/product/', path.basename(image.image));
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete old image: ${imagePath}`, err);
                    }
                });
            });

            // Add new images
            req.files.forEach(file => {
                let url = `${BASE_URL}/uploads/product/${encodeURIComponent(file.filename)}`; // Use encodeURIComponent to handle special characters
                images.push({ image: url });
            });
        } else {
            // Retain old images if no new images are uploaded
            images = menu.images;
        }

        req.body.images = images;

        // Update the menu item with new data
        menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        new SuccessHandler('Menu updated successfully', { menu }).sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = updateMenu;
