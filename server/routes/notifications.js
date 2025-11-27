const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Notification } = require('../models');
const { Op } = require('sequelize');

// @route   GET api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { isRead } = req.query;
        const where = { userId: req.user.id };

        if (isRead !== undefined) {
            where.isRead = isRead === 'true';
        }

        const notifications = await Notification.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: 50
        });

        const unreadCount = await Notification.count({
            where: {
                userId: req.user.id,
                isRead: false,
            }
        });

        res.json({
            notifications,
            unreadCount,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/notifications/mark-read
// @desc    Mark notifications as read
// @access  Private
router.post('/mark-read', auth, async (req, res) => {
    try {
        const { notificationIds } = req.body;

        if (!notificationIds || !Array.isArray(notificationIds)) {
            return res.status(400).json({ msg: 'Invalid notification IDs' });
        }

        await Notification.update(
            { isRead: true },
            {
                where: {
                    id: { [Op.in]: notificationIds },
                    userId: req.user.id,
                }
            }
        );

        res.json({ msg: 'Notifications marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.post('/mark-all-read', auth, async (req, res) => {
    try {
        await Notification.update(
            { isRead: true },
            {
                where: {
                    userId: req.user.id,
                    isRead: false
                }
            }
        );

        res.json({ msg: 'All notifications marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        // Make sure user owns this notification
        if (notification.userId !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await notification.destroy();

        res.json({ msg: 'Notification removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
