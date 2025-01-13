const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getProfileDetail, updateProfile, changePassword } = require('../controllers/profileController');


// authorizeRoles

router.get('/', requireAuth, getProfileDetail);
router.post('/update', requireAuth, updateProfile);
router.post('/change-password', requireAuth, changePassword);


module.exports = router;