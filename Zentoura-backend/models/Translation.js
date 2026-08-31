const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Translation = sequelize.define('Translation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    originalText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    targetLang: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    translatedText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: 'SHA256 hash of original text to optimize lookups'
    },
    expiry: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'translations',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['hash', 'targetLang']
        }
    ]
});

module.exports = Translation;
