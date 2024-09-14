const mongoose = require('mongoose');        // Import mongoose to define a schema
const bcrypt = require('bcryptjs');          // Import bcrypt for password hashing

// Define the User schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],  // Username is required
        unique: true,                               // Username must be unique
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],    // Email is required
        unique: true,                               // Email must be unique
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],  // Password is required
    },
}, {
    timestamps: true   // Automatically adds createdAt and updatedAt timestamps
});

// Pre-save hook to hash password before saving user to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();  // If the password is not modified, skip the hashing
    }
    
    const salt = await bcrypt.genSalt(10);        // Generate a salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password using the salt
});

// Method to check if the entered password matches the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  // Compare entered password with stored hashed password
};

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;   // Export the model for use in the controllers
