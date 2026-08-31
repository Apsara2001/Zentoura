const { sequelize } = require('../config/db');

const checkDbConnection = async (req, res, next) => {
    try {
        await sequelize.authenticate();
        next();
    } catch (error) {
        console.error('Database connection check failed:', error.message);
        res.status(503).json({
            success: false,
            message: 'Database connection is currently unavailable. Please ensure your MySQL service (XAMPP/WAMP) is running.'
        });
    }
};

module.exports = checkDbConnection;
