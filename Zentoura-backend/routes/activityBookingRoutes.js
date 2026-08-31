const express = require('express');
const {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus
} = require('../controllers/activityBookingController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);
router.patch('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router;
