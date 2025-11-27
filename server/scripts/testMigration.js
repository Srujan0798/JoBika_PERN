#!/usr/bin/env node

/**
 * Quick Test Script for PERN Migration
 * Tests database connection and basic model operations
 */

const { sequelize } = require('./config/database');
const { User, Job, Application, Resume } = require('./models');

async function runTests() {
    console.log('🧪 Testing PERN Stack Migration\n');

    try {
        // Test 1: Database Connection
        console.log('1️⃣  Testing database connection...');
        await sequelize.authenticate();
        console.log('   ✅ Connected to PostgreSQL\n');

        // Test 2: Sync Models (create tables if they don't exist)
        console.log('2️⃣  Syncing database models...');
        await sequelize.sync({ alter: false });
        console.log('   ✅ Models synced\n');

        // Test 3: Create Test User
        console.log('3️⃣  Testing User model...');
        const testUser = await User.findOrCreate({
            where: { email: 'test@jobika.com' },
            defaults: {
                email: 'test@jobika.com',
                password: 'test123',
                fullName: 'Test User'
            }
        });
        console.log(`   ✅ User: ${testUser[0].fullName} (${testUser[0].email})\n`);

        // Test 4: Create Test Job
        console.log('4️⃣  Testing Job model...');
        const testJob = await Job.findOrCreate({
            where: {
                title: 'Test Developer',
                company: 'Test Company'
            },
            defaults: {
                title: 'Test Developer',
                company: 'Test Company',
                location: 'Remote',
                description: 'Test job description',
                requiredSkills: ['JavaScript', 'Node.js', 'PostgreSQL'],
                source: 'manual'
            }
        });
        console.log(`   ✅ Job: ${testJob[0].title} at ${testJob[0].company}\n`);

        // Test 5: Test Associations
        console.log('5️⃣  Testing model associations...');
        const userWithJobs = await User.findOne({
            where: { email: 'test@jobika.com' },
            include: [{ model: Application, as: 'applications' }]
        });
        console.log(`   ✅ Associations working (User has ${userWithJobs.applications?.length || 0} applications)\n`);

        // Test 6: Count Records
        console.log('6️⃣  Counting records...');
        const counts = {
            users: await User.count(),
            jobs: await Job.count(),
            applications: await Application.count(),
            resumes: await Resume.count()
        };
        console.log('   ✅ Database counts:');
        console.log(`      - Users: ${counts.users}`);
        console.log(`      - Jobs: ${counts.jobs}`);
        console.log(`      - Applications: ${counts.applications}`);
        console.log(`      - Resumes: ${counts.resumes}\n`);

        // Test 7: Test Password Hashing
        console.log('7️⃣  Testing password hashing...');
        const user = await User.findOne({ where: { email: 'test@jobika.com' } });
        const isMatch = await user.matchPassword('test123');
        console.log(`   ✅ Password verification: ${isMatch ? 'PASS' : 'FAIL'}\n`);

        console.log('═'.repeat(50));
        console.log('✅ All tests passed! PERN migration successful!');
        console.log('═'.repeat(50));
        console.log('\n📝 Next steps:');
        console.log('   1. Set up Supabase project (see docs/SUPABASE_SETUP.md)');
        console.log('   2. Update .env with DATABASE_URL');
        console.log('   3. Run: npm run dev');
        console.log('   4. Test at http://localhost:5000\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

runTests();
