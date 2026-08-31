const express = require('express');
const {
    createBooking,
    getMyBookings,
    getAllBookings,
    cancelBooking,
    updateBookingStatus
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Protected user routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);
router.put('/:id', protect, authorize('admin'), updateBookingStatus);

module.exports = router;
