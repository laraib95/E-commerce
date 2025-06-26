//defines the schema of user (e.g email, password e.t.c)
const mongoose = require('mongoose');           //import mongoose

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim: true              //removes extra spaces
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    mobilenumber: {
        type : String,
        match : /^0\d{10}$/
    },
    age : {
        type : Number,
    },
    role : {
        type : String,
        enum : ['Admin' , 'User'],
        default : 'User'
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

module.exports= mongoose.model('User', userSchema)