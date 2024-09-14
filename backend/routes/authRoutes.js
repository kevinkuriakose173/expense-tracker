const express = require('express');       // Import express to create routes
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/authController'); // Import controller functions for register and login
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();          // Create a new router object to define routes

// POST route for user registration
router.post('/register', registerUser);   // Calls the registerUser function when a POST request is made to /register

// POST route for user login
router.post('/login', loginUser);         // Calls the loginUser function when a POST request is made to /login

router.post('/logout', logoutUser);

router.get('/me', protect, getUser);

module.exports = router;                  // Export the router so it can be used in server.js
