const express = require('express');
const router = express.Router();
const {verifyToken} = require('../Middlewares/authMiddleware');
const {cart} = require('../Controllers/Cart');

// Define the route
router.get('/cart', verifyToken, cart);

module.exports = router;
