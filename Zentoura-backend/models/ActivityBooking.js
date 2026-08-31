const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ActivityBooking = sequelize.define('ActivityBooking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    activityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'activities',
            key: 'id'
        }
    },
    bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    guests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
        defaultValue: 'Confirmed'
    },
    paymentStatus: {
        type: DataTypes.ENUM('Unpaid', 'Paid'),
        defaultValue: 'Unpaid'
    }
}, {
    tableName: 'activity_bookings',
    timestamps: true
});

module.exports = ActivityBooking;
