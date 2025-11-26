const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const Resume = require('../models/Resume');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// @route   POST api/resume/upload
// @desc    Upload and parse resume
// @access  Private
router.post('/upload', [auth, upload.single('resume')], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);

        // Simple skill extraction logic (placeholder for more advanced AI)
        const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Java', 'C++'];
        const extractedSkills = commonSkills.filter(skill => data.text.includes(skill));

        const newResume = new Resume({
            user: req.user.id,
            originalName: req.file.originalname,
            path: req.file.path,
            parsedContent: data.text,
            skills: extractedSkills
        });

        const resume = await newResume.save();
        res.json(resume);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/resume
// @desc    Get user resumes
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id }).sort({ uploadedAt: -1 });
        res.json(resumes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
