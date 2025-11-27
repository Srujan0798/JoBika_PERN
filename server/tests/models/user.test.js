const { User } = require('../../models');
const { Sequelize } = require('sequelize');

describe('User Model', () => {
    it('should create a user successfully', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'password123',
            fullName: 'Test User',
        };

        const user = await User.create(userData);

        expect(user.id).toBeDefined();
        expect(user.email).toBe(userData.email);
        expect(user.fullName).toBe(userData.fullName);
        expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should hash password before saving', async () => {
        const user = await User.create({
            email: 'test2@example.com',
            password: 'plaintext',
            fullName: 'Test User',
        });

        expect(user.password).not.toBe('plaintext');
        expect(user.password.length).toBeGreaterThan(20); // Bcrypt hash length
    });

    it('should not save user without required fields', async () => {
        let err;
        try {
            await User.create({ email: 'test3@example.com' });
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.name).toBe('SequelizeValidationError');
    });

    it('should not allow duplicate emails', async () => {
        const userData = {
            email: 'duplicate@example.com',
            password: 'password123',
            fullName: 'Test User',
        };

        await User.create(userData);

        let err;
        try {
            await User.create(userData);
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.name).toBe('SequelizeUniqueConstraintError');
    });

    it('should verify password correctly', async () => {
        const user = await User.create({
            email: 'verify@example.com',
            password: 'password123',
            fullName: 'Test User',
        });

        const isMatch = await user.matchPassword('password123');
        expect(isMatch).toBe(true);

        const isNotMatch = await user.matchPassword('wrongpassword');
        expect(isNotMatch).toBe(false);
    });

    it('should allow OAuth users without password', async () => {
        const user = await User.create({
            email: 'oauth@example.com',
            fullName: 'OAuth User',
            oauthProvider: 'google',
            oauthId: '12345',
        });

        expect(user.id).toBeDefined();
        expect(user.oauthProvider).toBe('google');
    });
});
