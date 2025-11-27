const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        set(value) {
            this.setDataValue('title', value.trim());
        }
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        set(value) {
            this.setDataValue('company', value.trim());
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    salary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    source: {
        type: sequelize.getDialect() === 'postgres'
            ? DataTypes.ENUM('linkedin', 'indeed', 'naukri', 'unstop', 'other')
            : DataTypes.STRING,
        allowNull: false
    },
    requiredSkills: {
        type: sequelize.getDialect() === 'postgres'
            ? DataTypes.ARRAY(DataTypes.STRING)
            : DataTypes.JSON,
        defaultValue: []
    },
    postedDate: {
        type: DataTypes.STRING,
        defaultValue: 'Recently'
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
    tableName: 'jobs',
    timestamps: true,
    indexes: [
        {
            fields: ['location', 'source']
        },
        {
            fields: ['company']
        },
        {
            fields: ['createdAt']
        }
    ]
});

module.exports = Job;
