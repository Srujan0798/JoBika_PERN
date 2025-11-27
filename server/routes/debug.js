const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

router.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        const tables = await sequelize.getQueryInterface().showAllSchemas();
        res.json({
            status: 'connected',
            message: 'Database connection successful',
            config: {
                database: sequelize.config.database,
                host: sequelize.config.host,
                port: sequelize.config.port,
                dialect: sequelize.config.dialect,
                ssl: sequelize.config.dialectOptions?.ssl
            },
            tables: tables
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            code: error.original?.code,
            detail: error.original?.detail
        });
    }
});

module.exports = router;
