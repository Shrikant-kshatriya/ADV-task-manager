const express = require('express');
const router = express.Router();
const { getSingleUser, getAllUser, getUserNotifications, markAsRead } = require('../controllers/userController.js');

router.get('/', getSingleUser);
router.get('/all', getAllUser);


// user notification routes
router.get('/my-notifications', getUserNotifications);
router.patch('/my-notifications/:id', markAsRead);

module.exports = router;