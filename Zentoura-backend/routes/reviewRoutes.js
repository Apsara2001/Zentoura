const express = require('express');
const {
    createReview,
    getHotelReviews,
    getPlaceReviews,
    getActivityReviews,
    getBlogReviews,
    deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Create review (authenticated users only)
router.post('/', protect, createReview);

// Delete review (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteReview);

// Get reviews (public)
router.get('/hotel/:hotelId', getHotelReviews);
router.get('/place/:placeId', getPlaceReviews);
router.get('/activity/:activityId', getActivityReviews);
router.get('/blog/:blogId', getBlogReviews);

module.exports = router;
