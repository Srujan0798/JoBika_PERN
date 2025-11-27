const { sequelize } = require('../config/database');
const models = require('../models');

async function syncDatabase() {
    try {
        console.log('🔄 Syncing database...');

        // Sync all models with database
        // alter: true will update tables to match models
        // force: true will drop and recreate tables (USE WITH CAUTION!)
        await sequelize.sync({ alter: true });

        console.log('✅ Database synced successfully!');
        console.log('');
        console.log('📊 Tables created/updated:');
        console.log('   - users');
        console.log('   - jobs');
        console.log('   - resumes');
        console.log('   - applications');
        console.log('   - resume_versions');
        console.log('   - skill_gaps');
        console.log('   - notifications');
        console.log('   - user_preferences');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error syncing database:', error);
        process.exit(1);
    }
}

syncDatabase();
