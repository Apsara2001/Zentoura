const { Room, Hotel } = require('../models');

// @desc    Get all rooms for a hotel
// @route   GET /api/public/hotels/:hotelId/rooms
// @access  Public
const getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.findAll({
            where: { hotelId: req.params.hotelId }
        });

        res.json({
            success: true,
            data: rooms
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single room
// @route   GET /api/public/rooms/:id
// @access  Public
const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findByPk(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        res.json({
            success: true,
            data: room
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create room
// @route   POST /api/admin/hotels/:hotelId/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByPk(req.params.hotelId);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        let amenities = req.body.amenities;
        if (typeof amenities === 'string') {
            try {
                amenities = JSON.parse(amenities);
            } catch (e) {
                amenities = [];
            }
        }

        const image = req.file ? req.file.filename : null;

        const room = await Room.create({
            name: req.body.name,
            pricePerNight: req.body.pricePerNight,
            bedrooms: req.body.bedrooms || 1,
            maxGuests: req.body.maxGuests,
            totalRooms: req.body.totalRooms || 1,
            amenities,
            hotelId: req.params.hotelId,
            image
        });

        res.status(201).json({
            success: true,
            data: room
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update room
// @route   PUT /api/admin/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
    try {
        const room = await Room.findByPk(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        let amenities = req.body.amenities;
        if (typeof amenities === 'string') {
            try {
                amenities = JSON.parse(amenities);
            } catch (e) {
                if (amenities) amenities = [];
            }
        }

        const image = req.file ? req.file.filename : room.image;

        console.log('Updating room:', req.params.id);
        console.log('New file:', req.file ? req.file.filename : 'none');
        console.log('Final image value:', image);

        const updateData = {
            name: req.body.name || room.name,
            pricePerNight: req.body.pricePerNight || room.pricePerNight,
            bedrooms: req.body.bedrooms || room.bedrooms,
            maxGuests: req.body.maxGuests || room.maxGuests,
            totalRooms: req.body.totalRooms || room.totalRooms,
            amenities: amenities !== undefined ? amenities : room.amenities,
            image: image
        };

        await room.update(updateData);

        res.json({
            success: true,
            data: room
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete room
// @route   DELETE /api/admin/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findByPk(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        await room.destroy();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom
};
