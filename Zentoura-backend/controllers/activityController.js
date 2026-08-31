const { Activity, Review } = require('../models');
const { Op } = require('sequelize');
const { translateText } = require('../utils/translationService');

// @desc    Get all activities with filters and pagination
// @route   GET /api/activities
// @access  Public
const getAllActivities = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const search = req.query.search || req.query.location || '';
        const category = req.query.category || '';
        const minRating = parseFloat(req.query.minRating) || 0;

        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } }
            ];
        }

        if (category) {
            whereClause.category = category;
        }

        if (minRating) {
            whereClause.rating = { [Op.gte]: minRating };
        }

        const { count, rows } = await Activity.findAndCountAll({
            where: whereClause,
            distinct: true,
            limit,
            offset,
            order: [['rating', 'DESC'], ['createdAt', 'DESC']]
        });

        const language = req.query.language || 'en';

        // Use Promise.all with map to handle async translation for all items
        const data = await Promise.all(rows.map(async (activity) => {
            const plain = activity.get({ plain: true });

            if (language !== 'en') {
                const [translatedName, translatedShortDesc, translatedFullDesc, translatedLocation, translatedCategory, translatedDifficulty] = await Promise.all([
                    translateText(plain.name, language),
                    translateText(plain.short_description, language),
                    translateText(plain.full_description, language),
                    translateText(plain.location, language),
                    translateText(plain.category, language),
                    translateText(plain.difficulty_level, language)
                ]);

                return {
                    ...plain,
                    name: translatedName,
                    short_description: translatedShortDesc,
                    full_description: translatedFullDesc,
                    location: translatedLocation,
                    category: translatedCategory,
                    difficulty_level: translatedDifficulty,
                    rating: parseFloat(plain.rating || 0),
                    originalLanguage: 'en',
                    displayLanguage: language
                };
            }

            return {
                ...plain,
                rating: parseFloat(plain.rating || 0)
            };
        }));

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

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
const getActivity = async (req, res, next) => {
    try {
        const activity = await Activity.findByPk(req.params.id, {
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    include: ['user']
                }
            ]
        });

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        const language = req.query.language || 'en';
        let plain = activity.get({ plain: true });
        const reviews = plain.reviews || [];

        // Calculate average rating
        const avg = reviews.length > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        // Calculate breakdown (5, 4, 3, 2, 1)
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            if (breakdown[r.rating] !== undefined) {
                breakdown[r.rating]++;
            }
        });

        if (language !== 'en') {
            const [translatedName, translatedShortDesc, translatedFullDesc, translatedLocation, translatedCategory, translatedDifficulty] = await Promise.all([
                translateText(plain.name, language),
                translateText(plain.short_description, language),
                translateText(plain.full_description, language),
                translateText(plain.location, language),
                translateText(plain.category, language),
                translateText(plain.difficulty_level, language),
            ]);

            plain = {
                ...plain,
                name: translatedName,
                short_description: translatedShortDesc,
                full_description: translatedFullDesc,
                location: translatedLocation,
                category: translatedCategory,
                difficulty_level: translatedDifficulty,
                originalLanguage: 'en',
                displayLanguage: language
            };
        }

        res.json({
            success: true,
            data: {
                ...plain,
                rating: parseFloat(avg),
                reviewCount: reviews.length,
                breakdown
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create activity
// @route   POST /api/activities
// @access  Private/Admin
const createActivity = async (req, res, next) => {
    try {
        const {
            name,
            category,
            location,
            difficulty_level,
            price,
            short_description,
            full_description,
            latitude,
            longitude
        } = req.body;
        const image = req.file ? req.file.filename : null;

        const activity = await Activity.create({
            name,
            category,
            location,
            difficulty_level,
            price,
            short_description,
            full_description,
            latitude,
            longitude,
            image
        });

        res.status(201).json({
            success: true,
            data: activity
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private/Admin
const updateActivity = async (req, res, next) => {
    try {
        const activity = await Activity.findByPk(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        const {
            name,
            category,
            location,
            difficulty_level,
            price,
            short_description,
            full_description,
            latitude,
            longitude
        } = req.body;
        const image = req.file ? req.file.filename : activity.image;

        await activity.update({
            name: name || activity.name,
            category: category || activity.category,
            location: location || activity.location,
            difficulty_level: difficulty_level || activity.difficulty_level,
            price: price || activity.price,
            short_description: short_description || activity.short_description,
            full_description: full_description || activity.full_description,
            latitude: latitude || activity.latitude,
            longitude: longitude || activity.longitude,
            image
        });

        res.json({
            success: true,
            data: activity
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private/Admin
const deleteActivity = async (req, res, next) => {
    try {
        const activity = await Activity.findByPk(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        await activity.destroy();

        res.json({
            success: true,
            message: 'Activity deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity
};
