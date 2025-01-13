const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the token exists in the Authorization header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized. Please provide a valid token' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: `Unauthorized. Invalid or expired token. ${error}`,
        });
    }
};

const requireAdmin = async (req, res, next) => {
    try {
        // Fetch the user based on the email from the token
        const user = await User.findOne({ email: req.user.email });

        if (!user || user.role !== 1) { // role 1 for admin 2 for user
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Admin authorization error:', error);
        return res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
};


const authorizeRoles = async (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access Denied. Insufficient permissions.' });
        }
        next();
    };
};


module.exports = { requireAuth, requireAdmin, authorizeRoles };