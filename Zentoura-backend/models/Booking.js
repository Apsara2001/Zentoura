const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
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
    hotelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'hotels',
            key: 'id'
        }
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rooms',
            key: 'id'
        }
    },
    checkIn: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    checkOut: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    guests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    numRooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled'),
        defaultValue: 'Pending'
    },
    paymentStatus: {
        type: DataTypes.ENUM('Unpaid', 'Paid'),
        defaultValue: 'Unpaid'
    },
    paymentId: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

module.exports = Booking;
