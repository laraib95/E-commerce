const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Middleware to verify JWT and attach the user object to req
const verifyToken = async (req, res, next) => { // Made async because we'll be doing a database query
    let token;
    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID and attach to req. Exclude password.
            req.user = await User.findById(decoded.id).select('-password'); // .select('-password') prevents sending password hash

            // Check if user exists (edge case: user deleted after token issued)
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error('Token verification error:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please log in again.' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }
    } else { // If no token or not Bearer format
        return res.status(401).json({ message: 'Not authorized, no token or invalid token format' });
    }
};

// Middleware to check if the user has one of the specified roles
const authorizeRoles = (...roles) => { // Accepts multiple roles (e.g., 'Admin', 'User')
    return (req, res, next) => {
        // Ensure verifyToken has run and populated req.user
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access denied: User role not available or not authenticated.' });
        }

        // Check if the user's role is included in the authorized roles list
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Your role (${req.user.role}) is not authorized to access this resource.`,
            });
        }
        next(); // User has the required role, proceed
    };
};

module.exports = { verifyToken, authorizeRoles }; // Export both middleware functions