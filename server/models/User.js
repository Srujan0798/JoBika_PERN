const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        set(value) {
            this.setDataValue('email', value.toLowerCase().trim());
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Nullable for OAuth users
        validate: {
            notEmpty: function (value) {
                if (!this.oauthProvider && !value) {
                    throw new Error('Password is required for non-OAuth users');
                }
            }
        }
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        set(value) {
            this.setDataValue('fullName', value.trim());
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue('phone', value.trim());
            }
        }
    },
    // OAuth fields
    oauthProvider: {
        type: DataTypes.ENUM('google', 'linkedin'),
        allowNull: true
    },
    oauthId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Two-Factor Authentication
    twoFactorSecret: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isTwoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            fields: ['oauthProvider', 'oauthId']
        }
    ],
    hooks: {
        // Hash password before creating user
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // Hash password before updating if it changed
        beforeUpdate: async (user) => {
            if (user.changed('password') && user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance method to verify password
User.prototype.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
