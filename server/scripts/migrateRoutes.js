#!/usr/bin/env node

/**
 * Migration Script: Update all route files from Mongoose to Sequelize
 * This script performs find-and-replace operations to convert Mongoose syntax to Sequelize
 */

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../routes');

// Files to update
const routeFiles = [
    'jobs.js',
    'applications.js',
    'resume.js',
    'notifications.js',
    'analytics.js'
];

// Replacement patterns
const replacements = [
    // Model imports
    {
        from: /const (\w+) = require\('\.\.\/models\/(\w+)'\);/g,
        to: (match, varName) => `// Updated to use models/index.js`
    },
    // Add models import at top
    {
        from: /(const express = require\('express'\);[\s\S]*?)(const \w+ = require)/,
        to: '$1const models = require(\'../models\');\n$2'
    },
    // findOne queries
    {
        from: /\.findOne\(\{\s*(\w+):/g,
        to: '.findOne({ where: { $1:'
    },
    // findById -> findByPk
    {
        from: /\.findById\(/g,
        to: '.findByPk('
    },
    // new Model() -> Model.create()
    {
        from: /new (\w+)\(\{/g,
        to: '$1.create({'
    },
    // Remove .save() after create
    {
        from: /\}\);[\s\n]*await \w+\.save\(\);/g,
        to: '});'
    },
    // find() -> findAll()
    {
        from: /\.find\(\{/g,
        to: '.findAll({ where: {'
    },
    // find() with no args -> findAll()
    {
        from: /\.find\(\)/g,
        to: '.findAll()'
    },
    // countDocuments -> count
    {
        from: /\.countDocuments\(/g,
        to: '.count({ where: '
    },
    // deleteOne -> destroy
    {
        from: /\.deleteOne\(\{/g,
        to: '.destroy({ where: {'
    },
    // updateOne -> update
    {
        from: /\.updateOne\(\{/g,
        to: '.update({ where: {'
    }
];

console.log('🔄 Starting Mongoose to Sequelize migration for routes...\n');

routeFiles.forEach(file => {
    const filePath = path.join(routesDir, file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${file} (not found)`);
        return;
    }

    console.log(`📝 Processing ${file}...`);

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ from, to }) => {
        if (content.match(from)) {
            content = content.replace(from, to);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${file}`);
    } else {
        console.log(`ℹ️  No changes needed for ${file}`);
    }
});

console.log('\n✅ Migration complete!');
console.log('\n⚠️  IMPORTANT: Please manually review the following:');
console.log('   1. Model associations (populate -> include)');
console.log('   2. Aggregation queries (need manual conversion)');
console.log('   3. Text search queries (MongoDB $text -> PostgreSQL full-text)');
console.log('   4. Array operations ($push, $pull -> Sequelize array methods)');
