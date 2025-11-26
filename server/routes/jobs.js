const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ date: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/jobs
// @desc    Create a job
// @access  Private (Admin only ideally, but open for now)
router.post('/', auth, async (req, res) => {
    const { title, company, location, description, salary, url, source } = req.body;

    try {
        const newJob = new Job({
            title,
            company,
            location,
            description,
            salary,
            url,
            source,
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
