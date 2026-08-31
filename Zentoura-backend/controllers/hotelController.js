const { Hotel, Review, Room, Booking } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all hotels with filters and pagination
// @route   GET /api/hotels
// @access  Public
const getAllHotels = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const location = req.query.location || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 999999;
        const minRating = parseFloat(req.query.minRating) || 0;

        const whereClause = {
            pricePerNight: {
                [Op.between]: [minPrice, maxPrice]
            },
            rating: {
                [Op.gte]: minRating
            }
        };

        if (location) {
            whereClause.location = { [Op.like]: `%${location}%` };
        }

        const { count, rows } = await Hotel.findAndCountAll({
            where: whereClause,
            distinct: true,
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    attributes: ['rating']
                }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const language = req.query.language || 'en';
        let processedRows = rows;

        if (language && language !== 'en') {
            const { translateText } = require('../utils/translationService');
            processedRows = await Promise.all(rows.map(async (hotel) => {
                const plain = hotel.get({ plain: true });
                try {
                    // Translate simple fields
                    const [translatedName, translatedDesc, translatedLocation] = await Promise.all([
                        translateText(plain.name, language),
                        translateText(plain.description, language),
                        translateText(plain.location, language)
                    ]);

                    // Translate amenities (array)
                    let translatedAmenities = plain.amenities;
                    if (Array.isArray(plain.amenities)) {
                        translatedAmenities = await Promise.all(
                            plain.amenities.map(item => translateText(item, language))
                        );
                    }

                    return {
                        ...plain,
                        name: translatedName,
                        description: translatedDesc,
                        location: translatedLocation,
                        amenities: translatedAmenities,
                        originalLanguage: 'en',
                        displayLanguage: language
                    };
                } catch (err) {
                    console.error(`Translation failed for hotel ${hotel.id}:`, err);
                    return plain;
                }
            }));
        } else {
            processedRows = rows.map(hotel => hotel.get({ plain: true }));
        }

        const data = processedRows.map(plain => {
            const reviews = plain.reviews || [];
            const avg = reviews.length > 0
                ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                : 0;

            return {
                ...plain,
                rating: parseFloat(avg)
            };
        });

        // Optional: Re-sort by rating if needed, or keep chronological
        // data.sort((a, b) => b.rating - a.rating);

        res.json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id, {
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    include: ['user']
                },
                {
                    model: Room,
                    as: 'rooms'
                }
            ]
        });

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        let plain = hotel.get({ plain: true });
        const language = req.query.language || 'en';

        if (language && language !== 'en') {
            const { translateText } = require('../utils/translationService');
            try {
                const [translatedName, translatedDesc, translatedLocation] = await Promise.all([
                    translateText(plain.name, language),
                    translateText(plain.description, language),
                    translateText(plain.location, language)
                ]);

                let translatedAmenities = plain.amenities;
                if (Array.isArray(plain.amenities)) {
                    translatedAmenities = await Promise.all(
                        plain.amenities.map(item => translateText(item, language))
                    );
                }

                // Translate Rooms
                if (plain.rooms && Array.isArray(plain.rooms)) {
                    plain.rooms = await Promise.all(plain.rooms.map(async (room) => {
                        const [tName, tType] = await Promise.all([
                            translateText(room.name, language),
                            translateText(room.type, language)
                        ]);

                        let tAmenities = room.amenities;
                        if (Array.isArray(room.amenities)) {
                            tAmenities = await Promise.all(
                                room.amenities.map(am => translateText(am, language))
                            );
                        }

                        return {
                            ...room,
                            name: tName,
                            type: tType,
                            amenities: tAmenities
                        };
                    }));
                }

                plain = {
                    ...plain,
                    name: translatedName,
                    description: translatedDesc,
                    location: translatedLocation,
                    amenities: translatedAmenities,
                    originalLanguage: 'en',
                    displayLanguage: language
                };
            } catch (err) {
                console.error(`Translation failed for hotel details ${hotel.id}:`, err);
            }
        }

        const reviews = plain.reviews || [];
        const avg = reviews.length > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        const finalData = {
            ...plain,
            rating: parseFloat(avg)
        };

        const { checkIn, checkOut } = req.query;

        // If dates are provided, calculate availability for each room
        if (checkIn && checkOut) {
            const roomsWithAvailability = await Promise.all(hotel.rooms.map(async (room) => {
                const bookedRooms = await Booking.sum('numRooms', {
                    where: {
                        roomId: room.id,
                        status: { [Op.ne]: 'Cancelled' },
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

                return {
                    ...room.toJSON(),
                    availableRooms: Math.max(0, room.totalRooms - bookedRooms)
                };
            }));

            return res.json({
                success: true,
                data: {
                    ...finalData,
                    rooms: roomsWithAvailability
                }
            });
        }

        res.json({
            success: true,
            data: finalData
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res, next) => {
    try {
        const { name, description, location, pricePerNight, startingPrice } = req.body;
        const image = req.file ? req.file.filename : null;

        let amenities = req.body.amenities;
        if (typeof amenities === 'string') {
            try {
                amenities = JSON.parse(amenities);
            } catch (e) {
                amenities = [];
            }
        }

        const hotel = await Hotel.create({
            name,
            description,
            location,
            pricePerNight,
            rating: 0,
            startingPrice: startingPrice || pricePerNight || 0,
            amenities,
            image
        });

        res.status(201).json({
            success: true,
            data: hotel
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        const { name, description, location, pricePerNight, startingPrice } = req.body;
        const image = req.file ? req.file.filename : hotel.image;

        let amenities = req.body.amenities;
        if (typeof amenities === 'string') {
            try {
                amenities = JSON.parse(amenities);
            } catch (e) {
                // If parsing fails, maybe it's not JSON string, or keep existing?
                if (amenities) amenities = [];
            }
        }

        await hotel.update({
            name: name || hotel.name,
            description: description || hotel.description,
            location: location || hotel.location,
            pricePerNight: pricePerNight || hotel.pricePerNight,
            startingPrice: startingPrice !== undefined ? startingPrice : hotel.startingPrice,
            amenities: amenities !== undefined ? amenities : hotel.amenities,
            image
        });

        res.json({
            success: true,
            data: hotel
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        await hotel.destroy();

        res.json({
            success: true,
            message: 'Hotel deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllHotels,
    getHotel,
    createHotel,
    updateHotel,
    deleteHotel
};
