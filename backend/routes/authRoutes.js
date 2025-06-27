//Define endpoints like /register, /login
const express = require('express');         //express for API routes
const router = express.Router();            //Router to define API paths

const {registerUser, loginUser, getAllUsers} = require('../Controllers/AuthController')
//API routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);

module.exports = router;