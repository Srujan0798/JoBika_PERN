const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SkillGap = sequelize.define('SkillGap', {
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
    matchingSkills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    missingSkills: {
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
    },
    recommendations: {
        type: DataTypes.JSONB,
        defaultValue: [],
        comment: 'Array of recommendation objects with skill, priority, learningTime, resources'
    }
}, {
    tableName: 'skill_gaps',
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'jobId']
        },
        {
            fields: ['userId', 'createdAt']
        }
    ]
});

module.exports = SkillGap;
