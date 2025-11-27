const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserPreference = sequelize.define('UserPreference', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    // Auto-apply settings
    autoApplyEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    targetRoles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    targetLocations: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    salaryRange: {
        type: DataTypes.JSONB,
        defaultValue: {
            min: 0,
            max: 0,
            currency: 'INR'
        }
    },
    jobTypes: {
        type: DataTypes.ARRAY(DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote')),
        defaultValue: ['full-time']
    },
    experienceLevel: {
        type: DataTypes.ARRAY(DataTypes.ENUM('entry', 'mid', 'senior', 'lead', 'executive')),
        defaultValue: []
    },
    preferredSources: {
        type: DataTypes.ARRAY(DataTypes.ENUM('linkedin', 'indeed', 'naukri', 'unstop')),
        defaultValue: ['linkedin', 'indeed', 'naukri']
    },
    minMatchScore: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
        validate: {
            min: 0,
            max: 100
        }
    },
    dailyApplicationLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        validate: {
            min: 1
        }
    },
    notificationSettings: {
        type: DataTypes.JSONB,
        defaultValue: {
            emailAlerts: true,
            applicationUpdates: true,
            jobRecommendations: true
        }
    }
}, {
    tableName: 'user_preferences',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId']
        }
    ]
});

module.exports = UserPreference;
