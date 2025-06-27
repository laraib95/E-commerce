const mongoose = require('mongoose')

const productSchema = new mongoose.Schema ({
    name :{
        type: String,
        trim : true,
        required: true,
        maxLength : [100,"Product name can't exceed 100 characters"],
    },
    description: {
        type : String,
        require: true,
    },
    price : {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
    },
    images : [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        }
    ],
    category: {
        type: String,
        reqired: true,
        enum: {
            values:[
                'Cameras',
                'MemoryCards',
                'InkCatiadges',
                'Protectors',
                'Headphones',
            ],
            message: 'Please select correct category for product'
        }
    },
    seller: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    // User who created this product (admin) - useful for tracking
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    // Mongoose will automatically add createdAt and updatedAt fields
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', productSchema);