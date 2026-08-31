const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;
