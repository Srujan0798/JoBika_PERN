const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const { Resume, ResumeVersion, SkillGap, Job, Notification } = require('../models');
const {
    parsePDF,
    parseDOCX,
    extractEmail,
    extractPhone,
    extractName,
    extractSkills,
    extractExperienceYears,
    enhanceResumeText,
} = require('../services/resumeParser');
const ResumeCustomizer = require('../services/resumeCustomizer');
const SkillGapAnalyzer = require('../services/skillAnalyzer');

const resumeCustomizer = new ResumeCustomizer();
const skillAnalyzer = new SkillGapAnalyzer();

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|docx|doc/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF and DOCX files are allowed'));
    }
});

// @route   POST api/resume/upload
// @desc    Upload and parse resume
// @access  Private
router.post('/upload', [auth, upload.single('resume')], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        let parsedContent = '';
        const filePath = req.file.path;
        const fileName = req.file.originalname.toLowerCase();

        // Parse based on file type
        if (fileName.endsWith('.pdf')) {
            parsedContent = await parsePDF(filePath);
        } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
            parsedContent = await parseDOCX(filePath);
        } else {
            return res.status(400).json({ msg: 'Unsupported file format' });
        }

        // Extract information
        const email = extractEmail(parsedContent);
        const phone = extractPhone(parsedContent);
        const name = extractName(parsedContent);
        const skills = extractSkills(parsedContent);
        const experienceYears = extractExperienceYears(parsedContent);
        const enhancedText = enhanceResumeText(parsedContent);

        // Create resume document
        const resume = await Resume.create({
            userId: req.user.id,
            originalName: req.file.originalname,
            path: req.file.path,
            parsedContent,
            enhancedText,
            skills,
            experienceYears,
            extractedInfo: {
                name,
                email,
                phone,
            },
        });

        // Create notification
        await Notification.create({
            userId: req.user.id,
            title: 'Resume Uploaded Successfully',
            message: `Your resume has been uploaded and parsed. We found ${skills.length} skills and ${experienceYears} years of experience.`,
            type: 'success',
        });

        res.json({
            id: resume.id,
            originalName: resume.originalName,
            skills: resume.skills,
            experienceYears: resume.experienceYears,
            extractedInfo: resume.extractedInfo,
        });

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
        const resumes = await Resume.findAll({
            where: { userId: req.user.id },
            order: [['uploadedAt', 'DESC']]
        });
        res.json(resumes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/resume/customize
// @desc    Customize resume for specific job
// @access  Private
router.post('/customize', auth, async (req, res) => {
    try {
        const { jobId } = req.body;

        // Get user's latest resume
        const resume = await Resume.findOne({
            where: { userId: req.user.id },
            order: [['uploadedAt', 'DESC']]
        });

        if (!resume) {
            return res.status(404).json({ msg: 'No resume found. Please upload a resume first.' });
        }

        // Get job details
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Customize resume
        const baseResume = {
            skills: resume.skills,
            experience_years: resume.experienceYears,
            original_text: resume.parsedContent,
        };

        const customized = resumeCustomizer.customizeResumeForJob(
            baseResume,
            job.description || '',
            job.title
        );

        // Save customized version
        const resumeVersion = await ResumeVersion.create({
            userId: req.user.id,
            baseResumeId: resume.id,
            jobId: job.id,
            versionName: `${job.title} - ${job.company}`,
            customizedSummary: customized.summary,
            customizedSkills: customized.skills,
            highlightedExperience: customized.highlightedExperience,
            matchScore: customized.match_score,
        });

        res.json({
            versionId: resumeVersion.id,
            versionName: resumeVersion.versionName,
            customized,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/resume/skill-gap
// @desc    Analyze skill gap for a job
// @access  Private
router.post('/skill-gap', auth, async (req, res) => {
    try {
        const { jobId } = req.body;

        // Get user's resume
        const resume = await Resume.findOne({
            where: { userId: req.user.id },
            order: [['uploadedAt', 'DESC']]
        });

        if (!resume) {
            return res.status(404).json({ msg: 'No resume found' });
        }

        // Get job
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Analyze skill gap
        const analysis = skillAnalyzer.analyzeSkillGap(
            resume.skills,
            job.requiredSkills,
            job.title
        );

        // Save analysis
        await SkillGap.create({
            userId: req.user.id,
            jobId: job.id,
            matchingSkills: analysis.matching_skills,
            missingSkills: analysis.missing_skills,
            matchScore: analysis.match_score,
            recommendations: analysis.recommendations,
        });

        res.json(analysis);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/resume/versions
// @desc    Get all resume versions
// @access  Private
router.get('/versions', auth, async (req, res) => {
    try {
        const versions = await ResumeVersion.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Job,
                as: 'job',
                attributes: ['title', 'company', 'location']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(versions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
