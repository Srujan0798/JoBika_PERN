require('dotenv').config();
const { Sequelize } = require('sequelize');

const config = {
  development: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/jobika_dev',
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.co') ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Supabase
      }
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
let sequelize;
if (dbConfig.url) {
  sequelize = new Sequelize(dbConfig.url, {
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {}
  });
} else {
  sequelize = new Sequelize({
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {}
  });
}

// Test connection
sequelize.authenticate()
  .then(() => {
    if (env === 'development') {
      console.log('✅ Database connection established successfully');
    }
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err.message);
  });

module.exports = {
  sequelize,
  config,
  Sequelize
};
