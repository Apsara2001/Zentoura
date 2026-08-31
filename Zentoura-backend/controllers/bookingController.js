const { Booking, Room, Hotel, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
    try {
        const { hotelId, roomId, checkIn, checkOut, guests, numRooms } = req.body;
        const requestedRooms = parseInt(numRooms) || 1;
        const userId = req.user.id;

        // 1. Validate Room & Hotel
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        // 2. Calculate Nights & Price
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid check-in/out dates' });
        }

        const calculatedTotalPrice = room.pricePerNight * nights * requestedRooms;

        // 3. Advanced Availability Check
        // Find all confirmed or pending bookings for this room that overlap with the dates
        const bookedRooms = await Booking.sum('numRooms', {
            where: {
                roomId,
                status: { [Op.ne]: 'Cancelled' }, // Count everything not cancelled
                [Op.or]: [
                    { checkIn: { [Op.between]: [checkIn, new Date(new Date(checkOut).getTime() - 1).toISOString().split('T')[0]] } },
                    { checkOut: { [Op.between]: [new Date(new Date(checkIn).getTime() + 1).toISOString().split('T')[0], checkOut] } },
                    {
                        [Op.and]: [
                            { checkIn: { [Op.lte]: checkIn } },
                            { checkOut: { [Op.gte]: checkOut } }
                        ]
                    }
                ]
            }
        }) || 0;

        if (bookedRooms + requestedRooms > room.totalRooms) {
            return res.status(400).json({
                success: false,
                message: `Only ${room.totalRooms - bookedRooms} rooms available for these dates.`
            });
        }

        // 4. Create booking
        const booking = await Booking.create({
            userId,
            hotelId,
            roomId,
            checkIn,
            checkOut,
            guests,
            numRooms: requestedRooms,
            totalPrice: calculatedTotalPrice,
            status: 'Confirmed', // Default to confirmed for now
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

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [
                { model: Hotel, as: 'hotel', attributes: ['name', 'location', 'image'] },
                { model: Room, as: 'room', attributes: ['name', 'image'] }
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

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                { model: Hotel, as: 'hotel', attributes: ['name', 'image'] },
                { model: Room, as: 'room', attributes: ['name', 'image'] }
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

// @desc    Cancel booking (User)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Booking already cancelled' });
        }

        // Policy check: Can only cancel if check-in is in the future
        const today = new Date();
        const checkInDate = new Date(booking.checkIn);

        if (checkInDate <= today) {
            return res.status(400).json({ success: false, message: 'Cannot cancel past or current bookings' });
        }

        await booking.update({ status: 'Cancelled' });

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        await booking.update({ status });

        res.json({
            success: true,
            message: 'Booking status updated successfully',
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
    cancelBooking,
    updateBookingStatus
};
