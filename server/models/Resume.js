const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Resume = sequelize.define('Resume', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parsedContent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Extracted text from PDF/DOCX'
    },
    enhancedText: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'AI-enhanced version'
    },
    skills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    experienceYears: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    extractedInfo: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'Contains name, email, phone extracted from resume'
    },
    uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'resumes',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        }
    ]
});

module.exports = Resume;
