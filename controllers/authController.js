const User = require('../models/user');
const { status } = require('../constants/constant');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../utils/mailer');
const bcrypt = require('bcrypt');
const {
    registrationSchema,
    loginSchema,
    forgotPasswordSchema,
    reserPasswordSchema
} = require('../validations/authValidation');


const saltRounds = 10;

// Login user.
exports.loginUser = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                errors: error.details.map(detail => detail.message)
            });
        }

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({
                message: 'User does not exist.'
            })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials. Please try again."
            })
        }


        // if (existingUser.role != 1) {
        //     return res.status(403).json({
        //         message: "Access denied. Only admins are allowed to log in."
        //     })
        // }

        // Generate a token upon signup
        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        existingUser.token = token;
        await existingUser.save();

        return res.status(200).json({
            message: "Login successfully.",
            token: token,
            data: existingUser
        })

    } catch (error) {
        return res.status(500).json({
            message: `Internal server error`,
            error: error.message
        })
    }
}


// Store users or register users.
exports.registerUser = async (req, res) => {
    try {
        const { error } = registrationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                errors: error.details.map(detail => detail.message)
            });
        }

        const { first_name, last_name, email, password, mobile_number, role = 2, status } = req.body;

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
                role,
                status,
            });

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
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
}


// forgot password. 
exports.forgotPassword = async (req, res) => {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            errors: error.details.map(detail => detail.message)
        });
    }

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

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${hashedToken}`;

        // Configure the mailoptions object
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset</p>
               <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>`,
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    }
}


// reset password 
exports.resetPassword = async (req, res) => {

    const { error } = reserPasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            errors: error.details.map(detail => detail.message)
        });
    }

    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        // compare old password and new reset password.
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: 'New password cannot be the same as the old password.',
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
}