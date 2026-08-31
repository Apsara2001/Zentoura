const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const {
    createMessage,
    getAllMessages,
    updateMessageStatus
} = require('../controllers/messageController');

// Public route - anyone can submit a message
router.post('/', createMessage);

// Admin routes - require authentication and admin role
router.get('/', protect, authorize('admin'), getAllMessages);
router.patch('/:id', protect, authorize('admin'), updateMessageStatus);

module.exports = router;
