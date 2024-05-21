const catchAsyncError = require('../../middlewares/catchAsyncError');
const TimeSlot = require('../../model/timeSlot'); 
const ErrorHandler = require('../../utils/errorHandler');

const addAvailablePickupTimeSlots = catchAsyncError(async (req, res, next) => {
  try {
    const { newTimeSlot, restaurantName, restaurantId } = req.body;
    if (!newTimeSlot || typeof newTimeSlot !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid time slot format' });
    }

    const timeSlot = new TimeSlot({ slot: newTimeSlot, restaurantName, restaurantId  });
    await timeSlot.save();

    res.status(200).json({ success: true, message: 'New pickup time slot added successfully', timeSlot });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

const getAllTimeSlots = catchAsyncError(async (req, res, next ) => {
    try {
      const timeSlots = await TimeSlot.find();
      res.status(200).json({ success: true, timeSlots });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }); 
  const getAllTimeSlotsById = catchAsyncError(async (req, res, next) => {
    try {
      // Assuming restaurantId is available in the request body
      const restaurantId = req.body.restaurantId;
  
      // Find time slots based on restaurantId
      const timeSlots = await TimeSlot.find({  
        restaurantId: restaurantId
    })
  
      res.status(200).json({ success: true, timeSlots });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  });
  
  
  // Update a time slot by ID
  const updateTimeSlotById = catchAsyncError(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { updatedTimeSlot } = req.body;
  
      if (!updatedTimeSlot || typeof updatedTimeSlot !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid time slot format' });
      }
  
      const timeSlot = await TimeSlot.findByIdAndUpdate(id, { slot: updatedTimeSlot }, { new: true });
  
      if (!timeSlot) {
        return res.status(404).json({ success: false, error: 'Time slot not found' });
      }
  
      res.status(200).json({ success: true, message: 'Time slot updated successfully', timeSlot });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  });
  
  // Delete a time slot by ID
  const deleteTimeSlotById = catchAsyncError(async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedTimeSlot = await TimeSlot.findByIdAndDelete(id);
  
      if (!deletedTimeSlot) {
        return res.status(404).json({ success: false, error: 'Time slot not found' });
      }
  
      res.status(200).json({ success: true, message: 'Time slot deleted successfully', timeSlot: deletedTimeSlot });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  });

module.exports = {addAvailablePickupTimeSlots, deleteTimeSlotById, updateTimeSlotById, getAllTimeSlots, getAllTimeSlotsById}