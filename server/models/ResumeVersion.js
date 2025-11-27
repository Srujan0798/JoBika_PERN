const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ResumeVersion = sequelize.define('ResumeVersion', {
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
    baseResumeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'resumes',
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
    versionName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        set(value) {
            this.setDataValue('versionName', value.trim());
        }
    },
    customizedSummary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    customizedSkills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    highlightedExperience: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    matchScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    }
}, {
    tableName: 'resume_versions',
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'jobId']
        },
        {
            fields: ['baseResumeId']
        }
    ]
});

module.exports = ResumeVersion;
