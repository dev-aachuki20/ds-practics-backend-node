const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { requireAuth } = require('../middleware');
const { status } = require('../constants/constant');

// Update profile API
router.post('/update', requireAuth, async function (req, res) {
    try {
        const { first_name, last_name, mobile_number } = req.body;

        //  update only the provided fields.
        const updateFields = {};
        if (first_name) updateFields.first_name = first_name;
        if (last_name) updateFields.last_name = last_name;
        if (mobile_number) updateFields.mobile_number = mobile_number;

        const updatedUser = await User.findOneAndUpdate({ email: req.user.email }, updateFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Profile updated successfully.',
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: `An error occurred. Please try again. ${error}`
        });
    }
});

// Change password
router.post('/change-password', async function (req, res) {
    try {
        const { password } = req.body;
        console.log('change password api:', req.body);

        //  update only the provided fields.
        const updateFields = {};
        if (password) updateFields.password = password;

        const updatedUser = await User.findOneAndUpdate({ email: req.user.email }, updateFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Profile updated successfully.',
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: `An error occurred. Please try again. ${error}`
        });
    }
});


module.exports = router;