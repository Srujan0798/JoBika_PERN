const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Job } = require('../models');
const { Op } = require('sequelize');
const UniversalJobScraper = require('../services/jobScraper');

const jobScraper = new UniversalJobScraper();

// @route   GET api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { location, source, minSalary, search } = req.query;
        const where = {};

        if (location && location !== 'All Locations') {
            where.location = { [Op.iLike]: `%${location}%` };
        }

        if (source) {
            where.source = source;
        }

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { company: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const jobs = await Job.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: 100
        });

        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/jobs/:id
// @desc    Get single job
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/jobs/scrape
// @desc    Scrape jobs from various sources
// @access  Private (could be public, but rate-limited)
router.post('/scrape', auth, async (req, res) => {
    try {
        const { query = 'software engineer', location = 'remote', limit = 20 } = req.body;

        console.log(`Scraping jobs: ${query} in ${location}`);

        // Scrape jobs
        const scrapedJobs = await jobScraper.scrapeAllJobs(query, location, limit);

        // Save to database
        let addedCount = 0;
        for (const jobData of scrapedJobs) {
            // Check if job already exists
            const existing = await Job.findOne({
                where: {
                    title: jobData.title,
                    company: jobData.company,
                }
            });

            if (!existing) {
                await Job.create({
                    title: jobData.title,
                    company: jobData.company,
                    location: jobData.location,
                    salary: jobData.salary,
                    description: jobData.description,
                    requiredSkills: jobData.skills_required,
                    postedDate: jobData.posted_date,
                    source: jobData.source,
                    url: jobData.url,
                });

                addedCount++;
            }
        }

        res.json({
            message: `Scraped ${scrapedJobs.length} jobs, added ${addedCount} new jobs`,
            scraped: scrapedJobs.length,
            added: addedCount,
            jobs: scrapedJobs.slice(0, 10), // Return first 10 for preview
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/jobs (Admin only - create job manually)
// @desc    Create a job
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, company, location, description, salary, url, source, requiredSkills } = req.body;

    try {
        const job = await Job.create({
            title,
            company,
            location,
            description,
            salary,
            url,
            source: source || 'manual',
            requiredSkills: requiredSkills || [],
        });

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
