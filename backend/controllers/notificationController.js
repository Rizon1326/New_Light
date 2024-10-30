const Notification = require('../models/Notification');

// Create a notification for a specific user
exports.createNotification = async (userId, message, postId) => {
    try {
        const notification = new Notification({ userId, message, postId });
        await notification.save();
    } catch (error) {
        console.error('Notification error:', error);
    }
};

// Get notifications for the logged-in user
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.userId; // Extracted from middleware
        const notifications = await Notification.find({ userId })
            .populate('postId', 'title') // Populate the post title for better UX
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: error.message });
    }
};