const Content = require('../../model/content');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const createCarousel = catchAsyncError(async (req, res, next) => {
    try {
        let images = [];
        let BASE_URL = process.env.BACKEND_URL;
        if (process.env.NODE_ENV === "production") {
            BASE_URL = `${req.protocol}://${req.get('host')}`;
        }
        
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                let url = `${BASE_URL}/uploads/carousel/${file.originalname}`;
                images.push({ image: url });
            });
        }

        req.body.images = images;

        const carousel = await Content.create(req.body);

        const successHandler = new SuccessHandler('Carousel created successfully', carousel);
        successHandler.sendResponse(res, 201);
    } catch (error) {
        
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});


const getCarousel = catchAsyncError(async (req, res, next) => {
    try {
        const carousel = await Content.find();

        const successHandler = new SuccessHandler('Carousel fetched successfully', carousel);
        successHandler.sendResponse(res, 200);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});


const updateCarousel = catchAsyncError(async (req, res, next) => {
    try {
        let carousel = await Content.findById(req.params.id);

        let images = [];

        if (req.body.imagesCleared === 'true') {
            images = carousel.images;
        }

        let BASE_URL = process.env.BACKEND_URL;
        if (process.env.NODE_ENV === "production") {
            BASE_URL = `${req.protocol}://${req.get('host')}`;
        }

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                let url = `${BASE_URL}/uploads/carousel/${file.originalname}`;
                images.push({ image: url });
            });
        }

        carousel.images = images;
        carousel.text = req.body.text;

        if (!carousel) {
            return next(new ErrorHandler('Carousel not found', 404));
        }

        // carousel = await Content.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // });
        await carousel.save();

        new SuccessHandler('Carousel updated successfully', { carousel }).sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


const getSingleCarousel = catchAsyncError(async (req, res, next) => {
    try {
        const carousel = await Content.findById(req.params.id);

        if (!carousel) {
            return next(new ErrorHandler('Carousel not found', 404));
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        res.status(200).json({
            success: true,
            carousel
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


const deleteCarousel = catchAsyncError(async (req, res, next) => {
    const carouselId = req.params.id;

    try {
        const carousel = await Content.findOneAndDelete({ _id: carouselId });

        if (!carousel) {
            const error = new ErrorHandler('Carousel not found', 404);
        }

        const successHandler = new SuccessHandler('Carousel Deleted!');
        successHandler.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


module.exports = {
    deleteCarousel,
    getSingleCarousel,
    updateCarousel,
    getCarousel,
    createCarousel
}