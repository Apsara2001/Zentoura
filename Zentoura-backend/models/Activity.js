const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Activity = sequelize.define('Activity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Fun', 'Thrilling', 'Adventurous'),
        allowNull: false,
        defaultValue: 'Fun'
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    difficulty_level: {
        type: DataTypes.ENUM('Easy', 'Moderate', 'Challenging'),
        allowNull: false,
        defaultValue: 'Easy'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    short_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    full_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0.0,
        validate: {
            min: 0,
            max: 5
        }
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'activities',
    timestamps: true
});

module.exports = Activity;
