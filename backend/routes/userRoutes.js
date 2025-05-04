const express = require('express');
const router = express.Router();
const { getSingleUser, getAllUser } = require('../controllers/userController.js');

router.get('/', getSingleUser);
router.get('/all', getAllUser);

module.exports = router;