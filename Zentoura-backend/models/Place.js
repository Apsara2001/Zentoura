const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Place = sequelize.define('Place', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: ''
    },
    short_description: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: ''
    },
    full_description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

}, {
    tableName: 'places',
    timestamps: true
});

module.exports = Place;
