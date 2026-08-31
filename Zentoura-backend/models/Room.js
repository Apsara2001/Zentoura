const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Room = sequelize.define('Room', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hotelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'hotels',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Standard', 'Deluxe', 'Suite', 'Family'),
        defaultValue: 'Standard'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pricePerNight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    maxGuests: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalRooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    images: {
        type: DataTypes.JSON, // Stores array of image filenames
        defaultValue: []
    },
    amenities: {
        type: DataTypes.JSON, // Stores array of strings
        defaultValue: []
    }
}, {
    tableName: 'rooms',
    timestamps: true
});

module.exports = Room;
