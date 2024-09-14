const mongoose = require('mongoose');  // Import the mongoose library for connecting to MongoDB

const connectDB = async () => {
    try {
        // Connect to MongoDB using the connection string from the environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,        // Ensures that the MongoDB connection uses the new URL parser
            useUnifiedTopology: true,     // Enables the new server discovery and monitoring engine
        });

        // If the connection is successful, log the connection host
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If there is an error during connection, log the error and exit the process
        console.error(`Error: ${error.message}`);
        process.exit(1);  // Exit process with failure
    }
};

module.exports = connectDB;  // Export the connectDB function to be used in other parts of the app