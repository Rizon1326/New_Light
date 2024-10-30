const express = require('express');
const { getNotifications } = require('../controllers/notificationController');
const authMiddleware = require('/Users/rizon/Desktop/Buddhir_Bati/rizon_back/backend/middleware/authMiddleware.js'); // Import middleware

const router = express.Router();

router.get('/', authMiddleware, getNotifications); // Protected route

module.exports = router;