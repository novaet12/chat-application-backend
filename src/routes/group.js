const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

router.post('/create', auth, groupController.createGroup);
router.post('/add-member', auth, groupController.addMember);
router.post('/remove-member', auth, groupController.removeMember);
router.get('/my-groups', auth, groupController.getGroups);

module.exports = router;