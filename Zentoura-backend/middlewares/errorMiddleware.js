const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry',
            errors: err.errors.map(e => e.message)
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    // Sequelize connection errors
    if (err.name === 'SequelizeConnectionRefusedError') {
        return res.status(503).json({
            success: false,
            message: 'Could not connect to the database. Please make sure MySQL is running.'
        });
    }

    // Default error
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
