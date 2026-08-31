const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const placeRoutes = require('./routes/placeRoutes');
const activityRoutes = require('./routes/activityRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const activityBookingRoutes = require('./routes/activityBookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const translateRoutes = require('./routes/translateRoutes');

const checkDbConnection = require('./middlewares/dbMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route (exclude from DB check to allow status checks)
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Zentoura API is running',
        version: '1.0.0'
    });
});

// Apply DB check to all /api routes
app.use('/api', checkDbConnection);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/activity-bookings', activityBookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/translate', translateRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Zentoura API is running',
        version: '1.0.0'
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
