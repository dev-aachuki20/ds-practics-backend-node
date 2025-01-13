const User = require('../../models/user');

exports.usersList = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 1 } }, 'first_name last_name email mobile_number role createdAt updatedAt');

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No user found.' });
        }

        return res.status(200).json({
            message: 'Users details fetched successfully.',
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            message: `An error occurred while fetching the users list. Please try again. ${error}`
        });
    }
}