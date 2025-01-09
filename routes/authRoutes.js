const express = require('express');
const router = express.Router();
const { loginUser, registerUser, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;