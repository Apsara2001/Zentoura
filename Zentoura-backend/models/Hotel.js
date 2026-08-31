const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Hotel = sequelize.define('Hotel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    pricePerNight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0.0,
        validate: {
            min: 0,
            max: 5
        }
    },
    startingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Main featured image'
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    amenities: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }
}, {
    tableName: 'hotels',
    timestamps: true
});

module.exports = Hotel;
