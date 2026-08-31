const { ActivityBooking, Activity, User } = require('../models');

// @desc    Create a new activity booking
// @route   POST /api/activity-bookings
// @access  Private
const createBooking = async (req, res, next) => {
    try {
        const { activityId, bookingDate, guests } = req.body;
        const userId = req.user.id;

        // 1. Validate Activity
        const activity = await Activity.findByPk(activityId);
        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }

        // 2. Calculate Price
        const totalPrice = activity.price * guests;

        // 3. Create Booking
        const booking = await ActivityBooking.create({
            userId,
            activityId,
            bookingDate,
            guests,
            totalPrice,
            status: 'Confirmed',
            paymentStatus: 'Unpaid'
        });

        res.status(201).json({
            success: true,
            data: booking
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user activity bookings
// @route   GET /api/activity-bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await ActivityBooking.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Activity,
                    as: 'activity',
                    attributes: ['name', 'location', 'image', 'price']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all activity bookings (Admin)
// @route   GET /api/activity-bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await ActivityBooking.findAll({
            include: [
                {
                    model: Activity,
                    as: 'activity',
                    attributes: ['name', 'location', 'image', 'price']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking status (Admin)
// @route   PATCH /api/activity-bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const booking = await ActivityBooking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus
};
