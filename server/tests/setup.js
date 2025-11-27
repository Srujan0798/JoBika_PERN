const { sequelize } = require('../config/database');

// Setup Database before all tests
beforeAll(async () => {
    // Sync database (create tables)
    // force: true drops tables if they exist
    await sequelize.sync({ force: true });
});

// Clear all test data after each test
afterEach(async () => {
    // Recreate tables to clear data
    await sequelize.sync({ force: true });
});

// Close database connection after all tests
afterAll(async () => {
    await sequelize.close();
});
