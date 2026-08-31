require('dotenv').config(); // Load environment variables at the very beginning
const app = require('./app');
const { sequelize, connectDB } = require('./config/db');
require('./models'); // Import models to register associations

// Port configuration
// Requirements: Use process.env.PORT or default to 5000
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to database
        const isConnected = await connectDB();

        if (isConnected) {
            // Sync database (create tables if they don't exist)
            try {
                await sequelize.sync({ alter: false });
                console.log('✅ Database synchronized');
            } catch (syncError) {
                console.error('❌ Database sync error:', syncError.message);
            }
        } else {
            console.log('⚠️  Starting server without database connection. Please check your MySQL service.');
        }

        // Start server regardless of DB status (to avoid ERR_CONNECTION_REFUSED on frontend)
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Error: Port ${PORT} is already in use.`);
            } else {
                console.error('❌ Server error:', err);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};

startServer();
