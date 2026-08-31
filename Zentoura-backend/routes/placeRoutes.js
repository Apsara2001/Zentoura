const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    getAllPlaces,
    getPlace,
    createPlace,
    updatePlace,
    deletePlace
} = require('../controllers/placeController');
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
        cb(null, 'place-' + uniqueSuffix + path.extname(file.originalname));
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
router.get('/', getAllPlaces);
router.get('/:id', getPlace);

// Protected admin routes
router.post('/', protect, authorize('admin'), upload.single('image'), createPlace);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updatePlace);
router.delete('/:id', protect, authorize('admin'), deletePlace);

module.exports = router;
