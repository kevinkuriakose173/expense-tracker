const express = require('express');           // Import express to create routes
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController'); // Import controller functions for expense operations
const { protect } = require('../middleware/authMiddleware'); // Import middleware to protect routes (JWT authentication)

const router = express.Router();              // Create a new router object to define routes

// POST route to add a new expense (protected route)
router.post('/', protect, addExpense);        // Calls the addExpense function when a POST request is made to /api/expenses, protected by JWT

// GET route to fetch all expenses for a user (protected route)
router.get('/', protect, getExpenses);        // Calls getExpenses when a GET request is made to /api/expenses, protected by JWT

// PUT route to update an existing expense (protected route)
router.put('/:id', protect, updateExpense);   // Calls updateExpense when a PUT request is made to /api/expenses/:id, protected by JWT

// DELETE route to delete an existing expense (protected route)
router.delete('/:id', protect, deleteExpense); // Calls deleteExpense when a DELETE request is made to /api/expenses/:id, protected by JWT

module.exports = router;                      // Export the router so it can be used in server.js
