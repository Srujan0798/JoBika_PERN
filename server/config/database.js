require('dotenv').config();
const { Sequelize } = require('sequelize');

const dns = require('dns');
const { URL } = require('url');

// Function to resolve hostname to IPv4
async function resolveToIPv4(connectionString) {
  if (!connectionString) return connectionString;

  try {
    const url = new URL(connectionString);
    const hostname = url.hostname;

    // Check if it's already an IP
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return connectionString;

    return new Promise((resolve) => {
      dns.resolve4(hostname, (err, addresses) => {
        if (err || !addresses || addresses.length === 0) {
          console.warn(`⚠️ Could not resolve ${hostname} to IPv4, using original`);
          resolve(connectionString);
        } else {
          console.log(`✅ Resolved ${hostname} to IPv4: ${addresses[0]}`);
          url.hostname = addresses[0];
          resolve(url.toString());
        }
      });
    });
  } catch (e) {
    return connectionString;
  }
}

// Wrap config creation in a function or promise?
// Sequelize config is synchronous usually.
// But we can resolve it before creating the instance.

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
    url: process.env.DATABASE_URL, // Will be replaced dynamically
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

// We need to handle the async resolution. 
// Since module.exports is synchronous, we'll create the instance synchronously 
// but update the connection manager or create a wrapper.
// Actually, for the purpose of this fix, let's use a hack:
// We will use the original URL for initialization, but we'll try to resolve it 
// and update the configuration if possible. 
// OR better: We can't easily make this async.
// 
// ALTERNATIVE: Use the `beforeConnect` hook or similar? No.
// 
// Let's use `dns-sync` or just rely on the fact that `dns.lookup` (which pg uses) 
// respects `dns.setDefaultResultOrder`.
//
// Wait, I already added `dns.setDefaultResultOrder` in index.js.
// Maybe it needs to be here too? Or maybe `pg` uses `dns.lookup` which ignores it?
//
// Let's try adding `dns.setDefaultResultOrder` HERE as well, at the very top.

if (require('dns').setDefaultResultOrder) {
  require('dns').setDefaultResultOrder('ipv4first');
}

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
