const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { status } = require('../constants/constant');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../utils/mailer');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Login user.
router.post('/login', async function (req, res) {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({
                message: 'User does not exist.'
            })
        }

        const isMatch = bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials. Please try again."
            })
        }

        // Generate a token upon signup
        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        existingUser.token = token;
        await existingUser.save();

        return res.status(200).json({
            message: "Login successfully.",
            token: token,
            data: existingUser
        })

    } catch (error) {
        return res.status(200).json({
            message: `There was an error in sign in: ${error}`
        })
    }
})


// Store users or register users.
router.post('/signup', async function (req, res) {
    try {
        const { first_name, last_name, email, password, mobile_number } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email already registered. Please try to log in.'
            });
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create(
            {
                first_name,
                last_name,
                email,
                password: hashPassword,
                mobile_number,
                status: status.active,
            });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        user.token = token;
        await user.save();

        return res.status(201).json({
            message: 'Account created successfully.',
            token: token,
            data: user,
        });

    } catch (error) {
        return res.status(500).json({
            message: `An error occurred. Please try again. ${error}`
        });
    }
})


// forgot password. 
router.post('/forgot-password', async function (req, res) {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetToken = hashedToken;
        user.resetTokenExpiration = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // Configure the mailoptions object
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset</p>
                <p>Token : ${resetToken}</p>
               <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>`,
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    }
})


// reset password 
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error('display error in node console section please', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});


module.exports = router;