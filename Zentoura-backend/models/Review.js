const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
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
        allowNull: true,
        references: {
            model: 'hotels',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    placeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'places',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    activityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'activities',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'blogs',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'reviews',
    timestamps: true,
    validate: {
        // Ensure at least one foreign key is set
        atLeastOneReference() {
            if (!this.hotelId && !this.placeId && !this.activityId && !this.blogId) {
                throw new Error('Review must be associated with a hotel, place, activity, or blog');
            }
        }
    }
});

module.exports = Review;
