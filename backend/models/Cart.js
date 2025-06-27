const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',         //ref to the Product model
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: [0, 'Quantity must be greater than 1']  //Quantity shouldn't be negative
    }
});

const cartSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',            //ref to the User model
    required: true,
    unique: true,           //A user should only have 1 cart.
    },
    items: [cartItemSchema],   //array of cart items
}, {
        timestamps: true,   //Adds createdAt and updatedAt timestamps automatically
    });
module.exports = mongoose.model('Cart', cartSchema);