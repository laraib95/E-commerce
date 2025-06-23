//this file contains logic of loginUser, registerUser, getAllUsers
const User = require('../models/User');        // import User model
//imports for hashing and JWT 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


//POST api/register
exports.registerUser = async (req, res) => {
    //Extract + Validate + Save user
    const { name, email, password, mobilenumber, age } = req.body;
    if (!name || !email || !password || !mobilenumber || !age) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobilenumber,
            age
        });
        await newUser.save();   //save to DB
        res.status(200).json({ message: 'User Registered Successfuly! ' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

//POST api/login
exports.loginUser = async (req, res) => {

    const { email, password } = req.body;
    //check if both feilds are filled
    if (!email || !password) {
        return res.status(400).json({ message: "Both Fields are Required." });
    }
    try {
        console.log("Login attempt with email:", email);

        const user = await User.findOne({ email });
        //check if user exists
        if (!user) {
            return res.status(401).json({ message: "User not found. Please Register First" })
        }
        //check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }
        //generate token
        const token = jwt.sign(
            { id: user._id },           //payload
            process.env.JWT_SECRET,     //sign the token with JWT SECRET key 
            { expiresIn: '1d' }
        );
        res.status(200).json({          //returns back the generated token (jwt alongwith userdata) to frontend
            message: "Login Successful", user ,token
        });
    } catch (error) {
        console.error("Login Error", error)
        res.status(500).json({ message: "server Error" });
    }
};

//get all users for testing
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});      //fetch all users
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
        console.error("Error during registration:", err);  // ADD THIS
    }
};
