const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Application, Job, SkillGap, Resume } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// @route   GET api/analytics
// @desc    Get user analytics and market insights
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Application stats
        const totalApplications = await Application.count({
            where: { userId: req.user.id }
        });

        // Applications by status
        const applicationsByStatus = await Application.findAll({
            where: { userId: req.user.id },
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        const statusCounts = {};
        applicationsByStatus.forEach(item => {
            statusCounts[item.status] = parseInt(item.count);
        });

        // Average match score
        const avgMatchScore = await Application.findOne({
            where: { userId: req.user.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('matchScore')), 'avgScore']
            ],
            raw: true
        });

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentApplications = await Application.count({
            where: {
                userId: req.user.id,
                appliedDate: { [Op.gte]: thirtyDaysAgo },
            }
        });

        // Top companies applied to
        const topCompanies = await Application.findAll({
            where: { userId: req.user.id },
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Application.id')), 'count']
            ],
            include: [{
                model: Job,
                as: 'job',
                attributes: ['company']
            }],
            group: ['job.company'],
            order: [[sequelize.fn('COUNT', sequelize.col('Application.id')), 'DESC']],
            limit: 5,
            raw: true,
            nest: true
        });

        // Market insights
        const totalJobs = await Job.count();

        const jobsBySource = await Job.findAll({
            attributes: [
                'source',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['source'],
            raw: true
        });

        const sourceCounts = {};
        jobsBySource.forEach(item => {
            sourceCounts[item.source] = parseInt(item.count);
        });

        // Most common skills required (simplified - PostgreSQL array handling)
        const topSkills = await sequelize.query(`
            SELECT skill, COUNT(*) as count
            FROM (
                SELECT unnest("requiredSkills") as skill
                FROM jobs
            ) as skills
            GROUP BY skill
            ORDER BY count DESC
            LIMIT 10
        `, { type: sequelize.QueryTypes.SELECT });

        res.json({
            applicationStats: {
                total: totalApplications,
                byStatus: statusCounts,
                averageMatchScore: parseFloat(avgMatchScore?.avgScore || 0),
                last30Days: recentApplications,
                topCompanies: topCompanies.map(c => ({
                    company: c.job?.company || 'Unknown',
                    count: parseInt(c.count)
                })),
            },
            marketInsights: {
                totalJobs,
                bySource: sourceCounts,
                topSkills: topSkills.map(s => ({ skill: s.skill, count: parseInt(s.count) })),
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/analytics/learning-recommendations
// @desc    Get learning recommendations based on skill gaps
// @access  Private
router.get('/learning-recommendations', auth, async (req, res) => {
    try {
        // Get user's latest resume
        const resume = await Resume.findOne({
            where: { userId: req.user.id },
            order: [['uploadedAt', 'DESC']]
        });

        if (!resume) {
            return res.status(404).json({ msg: 'No resume found' });
        }

        // Get recent skill gap analyses
        const skillGaps = await SkillGap.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        // Aggregate missing skills from all analyses
        const skillFrequency = {};
        const allRecommendations = [];

        skillGaps.forEach(gap => {
            gap.missingSkills.forEach(skill => {
                skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
            });

            // Recommendations is JSONB array
            const recs = Array.isArray(gap.recommendations) ? gap.recommendations : [];
            allRecommendations.push(...recs);
        });

        // Sort skills by frequency
        const sortedSkills = Object.entries(skillFrequency)
            .sort((a, b) => b[1] - a[1])
            .map(([skill, count]) => ({ skill, frequency: count }));

        // Get unique recommendations (prioritize by frequency)
        const uniqueRecommendations = [];
        const seenSkills = new Set();

        for (const rec of allRecommendations) {
            if (!seenSkills.has(rec.skill)) {
                seenSkills.add(rec.skill);
                uniqueRecommendations.push({
                    ...rec,
                    frequency: skillFrequency[rec.skill] || 1,
                });
            }
        }

        // Sort by priority and frequency
        uniqueRecommendations.sort((a, b) => {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return b.frequency - a.frequency;
        });

        res.json({
            currentSkills: resume.skills,
            missingSkills: sortedSkills.slice(0, 10),
            recommendations: uniqueRecommendations.slice(0, 10),
            analysisCount: skillGaps.length,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
