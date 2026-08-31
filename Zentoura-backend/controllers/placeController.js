const { Place, Review, sequelize } = require('../models');
const { Op } = require('sequelize');
const { translateText } = require('../utils/translationService');

// @desc    Get all places with pagination and search
// @route   GET /api/places
// @access  Public
const getAllPlaces = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const search = req.query.search || '';
        const locationFilter = req.query.location || '';

        const whereClause = {};
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }
        if (locationFilter) {
            whereClause.location = { [Op.like]: `%${locationFilter}%` };
        }

        const { count, rows } = await Place.findAndCountAll({
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

        // Use Promise.all with map to handle async translation for all items
        const data = await Promise.all(rows.map(async (place) => {
            const plain = place.get({ plain: true });
            const reviews = plain.reviews || [];
            const avg = reviews.length > 0
                ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                : 0;

            if (language !== 'en') {
                const [translatedName, translatedShortDesc, translatedFullDesc, translatedLocation] = await Promise.all([
                    translateText(plain.name, language),
                    translateText(plain.short_description, language),
                    translateText(plain.full_description, language),
                    translateText(plain.location, language)
                ]);

                return {
                    ...plain,
                    name: translatedName,
                    short_description: translatedShortDesc,
                    full_description: translatedFullDesc,
                    location: translatedLocation,
                    rating: parseFloat(avg),
                    originalLanguage: 'en',
                    displayLanguage: language
                };
            }

            return {
                ...plain,
                rating: parseFloat(avg)
            };
        }));

        // Optional: Re-sort by rating if needed, but keeping Hotel's pattern of returning DB order or custom sort
        // If sorting specifically by rating, it should ideally be done in SQL, but for now matching Hotel's manual feel if any.
        // Actually Hotel mapping doesn't sort after mapping, so I'll follow that.

        res.json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data
        });
    } catch (error) {
        console.error('Error in getAllPlaces:', error);
        next(error);
    }
};

// @desc    Get single place
// @route   GET /api/places/:id
// @access  Public
const getPlace = async (req, res, next) => {
    try {
        const place = await Place.findByPk(req.params.id, {
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    include: ['user']
                }
            ]
        });

        if (!place) return res.status(404).json({ success: false, message: 'Place not found' });

        const language = req.query.language || 'en';
        let plain = place.get({ plain: true });
        const reviews = plain.reviews || [];
        const avg = reviews.length > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        if (language !== 'en') {
            const [translatedName, translatedShortDesc, translatedFullDesc, translatedLocation] = await Promise.all([
                translateText(plain.name, language),
                translateText(plain.short_description, language),
                translateText(plain.full_description, language),
                translateText(plain.location, language)
            ]);

            plain = {
                ...plain,
                name: translatedName,
                short_description: translatedShortDesc,
                full_description: translatedFullDesc,
                location: translatedLocation,
                originalLanguage: 'en',
                displayLanguage: language
            };
        }

        res.json({
            success: true,
            data: {
                ...plain,
                rating: parseFloat(avg)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create place
// @route   POST /api/places
// @access  Private/Admin
const createPlace = async (req, res, next) => {
    try {
        const { name, location, short_description, full_description, latitude, longitude } = req.body;
        const image = req.file ? req.file.filename : null;

        const place = await Place.create({
            name,
            location,
            short_description,
            full_description,
            rating: 0,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            image
        });

        res.status(201).json({
            success: true,
            data: place
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update place
// @route   PUT /api/places/:id
// @access  Private/Admin
const updatePlace = async (req, res, next) => {
    try {
        const place = await Place.findByPk(req.params.id);

        if (!place) {
            return res.status(404).json({
                success: false,
                message: 'Place not found'
            });
        }

        const { name, location, short_description, full_description, latitude, longitude } = req.body;
        const image = req.file ? req.file.filename : place.image;

        await place.update({
            name: name || place.name,
            location: location || place.location,
            short_description: short_description || place.short_description,
            full_description: full_description || place.full_description,
            latitude: latitude !== undefined ? parseFloat(latitude) : place.latitude,
            longitude: longitude !== undefined ? parseFloat(longitude) : place.longitude,
            image
        });

        res.json({
            success: true,
            data: place
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete place
// @route   DELETE /api/places/:id
// @access  Private/Admin
const deletePlace = async (req, res, next) => {
    try {
        const place = await Place.findByPk(req.params.id);

        if (!place) {
            return res.status(404).json({
                success: false,
                message: 'Place not found'
            });
        }

        await place.destroy();

        res.json({
            success: true,
            message: 'Place deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPlaces,
    getPlace,
    createPlace,
    updatePlace,
    deletePlace
};
