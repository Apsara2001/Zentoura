const { Review, User, Hotel, Place, Activity } = require('../models');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
    try {
        const { hotelId, placeId, activityId, blogId, rating, comment } = req.body;

        // Check if user has already reviewed this item
        const whereClause = { userId: req.user.id };
        if (hotelId) whereClause.hotelId = hotelId;
        if (placeId) whereClause.placeId = placeId;
        if (activityId) whereClause.activityId = activityId;
        if (blogId) whereClause.blogId = blogId;

        let review = await Review.findOne({ where: whereClause });

        if (review) {
            // Update existing review
            await review.update({ rating, comment });
        } else {
            // Create new review
            review = await Review.create({
                userId: req.user.id,
                hotelId: hotelId || null,
                placeId: placeId || null,
                activityId: activityId || null,
                blogId: blogId || null,
                rating,
                comment
            });
        }

        const createdReview = await Review.findByPk(review.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        // Update average rating if it's a hotel review
        if (hotelId) {
            const reviews = await Review.findAll({ where: { hotelId } });
            const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
            const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
            await Hotel.update({ rating: parseFloat(averageRating) }, { where: { id: hotelId } });
        }

        // Update average rating if it's a place review
        if (placeId) {
            const reviews = await Review.findAll({ where: { placeId } });
            const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
            const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
            await Place.update({ rating: parseFloat(averageRating) }, { where: { id: placeId } });
        }

        // Update average rating if it's an activity review
        if (activityId) {
            const reviews = await Review.findAll({ where: { activityId } });
            const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
            const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
            await Activity.update({ rating: parseFloat(averageRating) }, { where: { id: activityId } });
        }

        res.status(201).json({
            success: true,
            data: createdReview
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a hotel
// @route   GET /api/reviews/hotel/:hotelId
// @access  Public
const getHotelReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: { hotelId: req.params.hotelId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a place
// @route   GET /api/reviews/place/:placeId
// @access  Public
const getPlaceReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: { placeId: req.params.placeId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for an activity
// @route   GET /api/reviews/activity/:activityId
// @access  Public
const getActivityReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: { activityId: req.params.activityId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a blog
// @route   GET /api/reviews/blog/:blogId
// @access  Public
const getBlogReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: { blogId: req.params.blogId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        const { hotelId, placeId, activityId } = review;
        await review.destroy();

        // Update average rating if it's a hotel review
        if (hotelId) {
            const reviews = await Review.findAll({ where: { hotelId } });
            const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
            const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
            await Hotel.update({ rating: parseFloat(averageRating) }, { where: { id: hotelId } });
        }

        // Update average rating if it's a place review
        if (placeId) {
            const reviews = await Review.findAll({ where: { placeId } });
            const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
            const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
            await Place.update({ rating: parseFloat(averageRating) }, { where: { id: placeId } });
        }

        // Update average rating if it's an activity review
        if (activityId) {
            const reviews = await Review.findAll({ where: { activityId } });
            const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
            const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
            await Activity.update({ rating: parseFloat(averageRating) }, { where: { id: activityId } });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getHotelReviews,
    getPlaceReviews,
    getActivityReviews,
    getBlogReviews,
    deleteReview
};
