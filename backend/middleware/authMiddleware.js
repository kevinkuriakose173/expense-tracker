const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');

// Middleware to protect routes and verify JWT
const protect = async (req, res, next) => {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // If token exists, verify it
    if (token) {
        try {
            const decoded = verifyToken(token); // Use the verifyToken utility function

            // Find the user based on the decoded token and attach to the request object
            req.user = await User.findById(decoded.id).select('-password');  // Attach user without password to req.user
            console.log('User found:', req.user);
            next();  // Continue to the next middleware
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
