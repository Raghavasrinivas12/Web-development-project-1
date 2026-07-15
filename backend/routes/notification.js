const express = require('express');
const router = express.Router();
const { Notification } = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userid;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });
    return res.json({ notifications, unreadCount });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch notifications' });
  }
});

router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userid;
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isRead: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ msg: 'Notification not found' });
    return res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to mark notification as read' });
  }
});

router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userid;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    return res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to mark all as read' });
  }
});

module.exports = router;
