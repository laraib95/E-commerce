const express = require('express')
const router = express.Router();
const {getProducts, getSingleProduct, newProduct, updateProduct, deleteProduct,} = require('../Controllers/productController');

// Import the authentication and authorization middleware
const { verifyToken, authorizeRoles } = require('../Middlewares/authMiddleware');
const upload = require('../Middlewares/multer');
// --- Public Routes (Anyone can view products) ---
router.route('/products').get(getProducts); // Get all products
router.route('/product/:id').get(getSingleProduct); // Get single product details

// --- Admin Specific Routes (Requires 'Admin' role) ---
// Note: verifyToken comes before authorizeRoles
router.route('/admin/product/new').post(verifyToken, authorizeRoles('Admin'), upload.array('images',5),newProduct); // Create new product
router.route('/admin/product/:id')
    .put(verifyToken, authorizeRoles('Admin'), upload.array('images',5), updateProduct) // Update product
    .delete(verifyToken, authorizeRoles('Admin'), deleteProduct); // Delete product

module.exports =  router;