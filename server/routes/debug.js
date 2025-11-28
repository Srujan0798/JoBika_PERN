const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    let resolutionStatus = {};
    try {
        const statusPath = '/tmp/resolution_status.json';
        if (fs.existsSync(statusPath)) {
            resolutionStatus = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
        }
    } catch (e) {
        resolutionStatus = { error: e.message };
    }

    try {
        await sequelize.authenticate();
        const tables = await sequelize.getQueryInterface().showAllSchemas();
        res.json({
            status: 'connected',
            resolution: resolutionStatus,
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
            resolution: resolutionStatus,
            message: error.message,
            code: error.original?.code,
            detail: error.original?.detail
        });
    }
});

module.exports = router;
