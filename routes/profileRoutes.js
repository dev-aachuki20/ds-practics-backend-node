const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { updateProfile, changePassword } = require('../controllers/profileController');


router.post('/update', requireAuth, updateProfile);
router.post('/change-password', requireAuth, changePassword);


module.exports = router;