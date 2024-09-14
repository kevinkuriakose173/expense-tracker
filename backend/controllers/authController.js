const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        const token = generateToken(user._id); // Use the generateToken utility function

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Secure in production (HTTPS)
            maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
        });

        return res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        return res.status(400).json({ message: 'Invalid user data' });
    }
};

// Authenticate (Login) a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id); // Use the generateToken utility function

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
        });

        return res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
};

const getUser = async (req, res) => {
    try {
      // Return user info, excluding password
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user (clear cookie)
const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),  // Expire cookie immediately
    });

    return res.json({ message: 'Logged out' });
};


module.exports = { registerUser, loginUser, logoutUser, getUser };
