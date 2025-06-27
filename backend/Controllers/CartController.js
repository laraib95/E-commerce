// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../Middlewares/authMiddleware');
const Cart = require('../models/Cart');
const Product = require('../models/Product')    //--> import products to get product details
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../Middlewares/catchAsyncErrors');

exports.getUserCart = catchAsyncErrors(async (req,res,next) => {
    const cart = await Cart.findOne({user: req.user.id}).populate('items.product', 'name price images stock');
        if(!cart || cart.items.length === 0)
        {   
            return res.status(200).json({
                success: true,
                message: "Cart is empty. ",
                items:[],
            });
        };
        res.status(200).json({
            success: true,
            items : cart.items,
        }); 
    
});

exports.addItemToCart = catchAsyncErrors(async (req,res,next)=>{
    const {productId , quantity} = req.body;
    console.log("DEBUG: addItemToCart - Received productId:", productId, "quantity:", quantity);
    console.log("DEBUG: addItemToCart - User ID from token (req.user.id):", req.user.id); // <-- ADD THIS

        let cart = await Cart.findOne({user: req.user.id});
        const product = await Product.findById(productId);

        if(!product)
        {
            console.log("ERROR: addItemToCart - Product not found for ID:", productId)
            return next(new ErrorHandler('Product not found!', 404));
        }

        // Ensure product has enough stock
        if (product.stock === 0 || product.stock < quantity) {
             console.log("ERROR: addItemToCart - Insufficient stock for product:", product.name, "Available:", product.stock); // <-- ADD THIS

            return next(new ErrorHandler(`Not enough stock for ${product.name}. Available: ${product.stock}`, 400));
        }
        const price = product.price;
        const name = product.name;
        const image = product.images.length > 0 ? product.images[0].url : 'No Image';

        if(cart)
        {
            console.log("DEBUG: addItemToCart - Cart found for user. Current items count:", cart.items.length); // <-- ADD THIS
            //cart exists for user
            const itemIndex = cart.items.findIndex(item=> item.product.toString() === productId);
            if(itemIndex > -1) {
                //product exists in cart, update quantity
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;   //update  the quantity
            }
            else {
                //Product doesn't exists , addn new item 
                cart.items.push({product: productId, name, image, price, quantity });
            }
            console.log("DEBUG: addItemToCart - Cart before save:", JSON.stringify(cart, null, 2));
            cart = await cart.save();
            console.log("DEBUG: addItemToCart - Cart after save:", JSON.stringify(cart, null, 2));
            return res.status(200).json({
                success: true, 
                message: 'items added to cart',
                items: cart.items
            });
        }
        else{
            console.log("DEBUG: addItemToCart - No cart found for user. Creating new cart.");
            //no cart for user, create new
            const newCart = await Cart.create({
                user: req.user.id,
                items: [{product: productId, name, image, price, quantity}]
            });
            console.log("DEBUG: addItemToCart - New cart created:", JSON.stringify(newCart, null, 2));
            res.status(201).json({
                success: true,
                message: 'Cart created and items added',
                items: newCart.items,
            });
        }
});

exports.removeItemFromCart = catchAsyncErrors(async (req,res, next) => {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: "Cart not found for this user." });
        }

        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found in cart." });
        }

        cart = await cart.save();
        res.status(200).json({ 
            success: true, 
            message: "Item removed from cart.",
            items: cart.items });
    
});


exports.updateCartItemQuantity = catchAsyncErrors(async (req,res,next) => {
    const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: "Cart not found for this user." });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            // You might want to add a check here for stock limits (quantity <= product.stock)
            cart = await cart.save();
            return res.status(200).json({ 
                success: true, 
                message: "Cart item quantity updated.", 
                items: cart.items 
            });
        } else {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found in cart." });
        }
    
});

exports.clearUserCart = catchAsyncErrors(async (req,res,next) => {
        const cart = await Cart.findOneAndDelete({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: "Cart not found for this user." });
        }
        res.status(200).json({ 
            success: true, 
            message: "Cart cleared successfully.", 
            items: [] });
    
});