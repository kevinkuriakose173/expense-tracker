const mongoose = require('mongoose');        // Import mongoose to define a schema

// Define the Expense schema
const expenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,   // Link the expense to a user by user ID
        required: true,                         // Each expense must be associated with a user
        ref: 'User',                            // Reference the User model
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],  // Description is required
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],      // Amount is required
        min: [0, 'Amount must be greater than 0']      // Amount cannot be less than 0
    },
    date: {
        type: Date,
        default: Date.now,                             // Default to current date if not provided
    }
}, {
    timestamps: true   // Automatically adds createdAt and updatedAt timestamps
});

// Create the Expense model using the schema
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;   // Export the model for use in the controllers
