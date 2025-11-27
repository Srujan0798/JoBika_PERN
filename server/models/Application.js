const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
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
    jobId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'jobs',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    resumeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'resumes',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    status: {
        type: sequelize.getDialect() === 'postgres'
            ? DataTypes.ENUM('applied', 'screening', 'interviewing', 'offered', 'rejected', 'withdrawn')
            : DataTypes.STRING,
        defaultValue: 'applied'
    },
    matchScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    appliedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'applications',
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'appliedDate']
        },
        {
            fields: ['userId', 'status']
        },
        {
            fields: ['jobId']
        }
    ]
});

module.exports = Application;
