//this file contains logic for DB connection 
const mongoose = require('mongoose');   // Mongoose to connect to MongoDB
//MongoDB connection
// Connect to MongoDB using environment variable
const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI) //use var loaded from .env file
        console.log("MongoDB connected Successfuly");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};
module.exports = connectDB; 