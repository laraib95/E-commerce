const mongoose = require('mongoose')

const productSchema = new mongoose.Schema ({
    name :{
        type: String,
        trim : true,
        require: true,
        maxLength : [100,"Product name can't exceed 100 characters"],
    },
    description: {
        type : String,
        require: true,
    },
    price : {
        type: Number,
        require: true,
        maxLength: 8,
    },
    images : [
        {
            public_id: {
                type: String,
                require: true,
            },
            url: {
                type: String,
                reuire: true,
            },
        }
    ],
    category: {
        type: String,
        reuire: true,
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
        require: true,
    },
    stock: {
        type: Number,
        require: true,
        maxLength: 5,
        default: 0,
    },
    // User who created this product (admin) - useful for tracking
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = mongoose.model('Product', productSchema);