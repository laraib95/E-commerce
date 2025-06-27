const express = require('express');
const router = express.Router();
const {verifyToken} = require('../Middlewares/authMiddleware');
const {getUserCart, addItemToCart,updateCartItemQuantity, 
       removeItemFromCart,clearUserCart} = require('../Controllers/CartController');

// Define the route
router.get('/cart', verifyToken, getUserCart);
router.post('/cart',verifyToken, addItemToCart);
router.put('/cart',verifyToken, updateCartItemQuantity);
router.delete('/cart/:productId',verifyToken,removeItemFromCart);
router.delete('/cart/clear', clearUserCart)

module.exports = router;
