const Expense = require('../models/Expense');        // Import the Expense model

// Add a new expense
const addExpense = async (req, res) => {
    const { description, amount } = req.body;        // Extract fields from the request body

    if (!description || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Please provide a valid description and amount' });
    }

    // Create a new expense linked to the authenticated user (user is added from the JWT middleware)
    const expense = await Expense.create({
        user: req.user._id,        // req.user is available after the protect middleware
        description,
        amount,
        date: req.body.date || Date.now(),  // Optional custom date
    });

    if (expense) {
        return res.status(201).json(expense);
    } else {
        return res.status(400).json({ message: 'Invalid expense data' });
    }
};

// Get all expenses for a user
const getExpenses = async (req, res) => {
    const expenses = await Expense.find({ user: req.user._id });  // Fetch all expenses for the authenticated user
    res.json(expenses);
};

// Update an expense
const updateExpense = async (req, res) => {
    const { id } = req.params;      // Get the expense ID from the route params
    const { description, amount } = req.body;  // Extract the fields to update from the request body

    // Find the expense by ID and ensure it belongs to the authenticated user
    const expense = await Expense.findById(id);

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this expense' });
    }

    // Update the expense fields
    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;

    const updatedExpense = await expense.save();  // Save the updated expense

    res.json(updatedExpense);
};

// Delete an expense
const deleteExpense = async (req, res) => {
    const { id } = req.params;  // Get the expense ID from the route params

    // Find the expense by ID and ensure it belongs to the authenticated user
    const expense = await Expense.findById(id);

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this expense' });
    }

    await Expense.deleteOne({ _id: req.params.id }); // Delete the expense

    res.json({ message: 'Expense removed' });
};

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense };
