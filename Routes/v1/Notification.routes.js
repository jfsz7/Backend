// routes/notification.js
const express = require('express');
const { getNotifications } = require('../../Controllers/Notification.controllers');
const router = express.Router();
router.route('/userId/:id').get(getNotifications);

module.exports = router;