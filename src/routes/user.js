const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/add-friend', auth, userController.addFriend);
router.post('/remove-friend', auth, userController.removeFriend);

module.exports = router; 