const User = require('../models/user');
const bcrypt = require('bcrypt');
const { updateProfileSchema, changePasswordSchema } = require('../validations/profileValidation');


exports.updateProfile = async (req, res) => {
    try {
        const { error } = updateProfileSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                errors: error.details.map(detail => detail.message)
            });

        }

        const { first_name, last_name, mobile_number } = req.body;

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
}

exports.changePassword = async (req, res) => {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            errors: error.details.map(detail => detail.message)
        });

    }

    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "old password is incorrect."
            })
        }

        // Prevent using the same old password as the new password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: 'New password cannot be the same as the old password.',
            });
        }
        const saltRounds = 10;

        const hashPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashPassword;
        await user.save();

        return res.status(200).json({
            message: 'Password changed successfully.',
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: `An error occurred. Please try again. ${error}`
        });
    }
}