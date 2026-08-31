const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    getAllActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity
} = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'activity-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// Public routes
router.get('/', getAllActivities);
router.get('/:id', getActivity);

// Protected admin routes
router.post('/', protect, authorize('admin'), upload.single('image'), createActivity);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateActivity);
router.delete('/:id', protect, authorize('admin'), deleteActivity);

module.exports = router;
