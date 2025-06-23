const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../Middlewares/catchAsyncErrors');
//IMPORTS FOR IMAGE UPLOAD
const cloudinary = require('cloudinary').v2;
const fs = require('fs'); // Node.js built-in for file system operations

//.....Admin Access Only.......

// Create new product => /api/v1/admin/product/new
// Create new product => /api/v1/admin/product/new
// Create new product => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    console.log('DEBUG: 1. Entered newProduct controller.');
    console.log('DEBUG: Request Body (text fields):', req.body);
    console.log('DEBUG: Request Files (from Multer):', req.files);

    let imagesLinks = [];

    // Ensure Multer has successfully processed files
    if (!req.files || req.files.length === 0) {
        
        console.log('DEBUG: No files found in req.files.');
        
    } else {
        console.log('DEBUG: 2. Files detected. Proceeding to upload to Cloudinary.');
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            console.log(`DEBUG: 3. Attempting Cloudinary upload for local file: ${file.path}`);
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'ecommerce/products', 
                });
                console.log(`DEBUG: 4. Cloudinary upload successful for ${file.originalname}. Public ID: ${result.public_id}`);
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            } catch (cloudinaryErr) {
                console.error(`ERROR: Cloudinary upload failed for ${file.originalname}:`, cloudinaryErr);
                // Delete the temporary local file on upload failure too
                fs.unlinkSync(file.path);
                // Pass the error to the global error handler
                return next(new ErrorHandler(`Cloudinary upload failed for ${file.originalname}: ${cloudinaryErr.message}`, 500));
            } finally {
                // IMPORTANT: Delete the temporary file from local storage after each upload attempt
                // whether successful or failed, to prevent filling up disk space.
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                        console.log(`DEBUG: Deleted local temp file: ${file.path}`);
                    }
                } catch (unlinkErr) {
                    console.error(`WARN: Failed to delete temporary file ${file.path}:`, unlinkErr);
                }
            }
        }
    }

    // Assigning Cloudinary links to the request body for product creation
    req.body.images = imagesLinks;
    // Attaching the user (admin) who created the product
    req.body.user = req.user.id;

    console.log("DEBUG: 5. Attempting to create product in database with data:", req.body);
    const product = await Product.create(req.body);
    console.log("DEBUG: 6. Product created in DB. Product ID:", product._id);

    res.status(201).json({
        success: true,
        message: 'Product added successfully!', 
        product
    });
    console.log("DEBUG: 7. Sent product creation response.");
});


// Update Product (Admin) => /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Handle image updates:
    // If new files are uploaded, delete existing images from Cloudinary, then upload new ones.
    if (req.files && req.files.length > 0) {
        console.log('DEBUG: Update - New files detected. Deleting old images and uploading new ones.');
        // Deleting images associated with the product from Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            try {
                await cloudinary.uploader.destroy(product.images[i].public_id);
                console.log(`DEBUG: Update - Deleted old Cloudinary image: ${product.images[i].public_id}`);
            } catch (deleteErr) {
                console.warn(`WARN: Could not delete old Cloudinary image ${product.images[i].public_id}:`, deleteErr.message);
                // Continue even if an old image fails to delete, might be already gone or permission issue.
            }
        }

        let imagesLinks = [];
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            console.log(`DEBUG: Update - Attempting Cloudinary upload for local file: ${file.path}`);
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'ecommerce/products',
                    // width: 150,
                    // crop: "scale"
                });
                console.log(`DEBUG: Update - Cloudinary upload successful for ${file.originalname}. Public ID: ${result.public_id}`);
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            } catch (cloudinaryErr) {
                console.error(`ERROR: Update - Cloudinary upload failed for ${file.originalname}:`, cloudinaryErr);
                fs.unlinkSync(file.path); // Delete temp file on error
                return next(new ErrorHandler(`Cloudinary upload failed for ${file.originalname}: ${cloudinaryErr.message}`, 500));
            } finally {
                // Ensure temporary file is deleted
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                        console.log(`DEBUG: Update - Deleted local temp file: ${file.path}`);
                    }
                } catch (unlinkErr) {
                    console.error(`WARN: Update - Failed to delete temporary file ${file.path}:`, unlinkErr);
                }
            }
        }
        req.body.images = imagesLinks; // Update product with new image links
    } else {
        console.log('DEBUG: Update - No new files uploaded. Retaining existing images.');
        req.body.images = product.images; // Crucial: retain old images if no new ones are provided
    }

    console.log("DEBUG: Update - Attempting to update product in database with data:", req.body);
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    console.log("DEBUG: Update - Product updated in DB. Product ID:", product._id);

    res.status(200).json({
        success: true,
        message: 'Product updated successfully!',
        product
    });
    console.log("DEBUG: Update - Sent product update response.");
});
// Delete Product (Admin) => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    // Deleting images associated with the product from Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    });
});
//.....Public Access / All users.......

//get all products => /api/v1/products
exports.getProducts = catchAsyncErrors(async(req,res,next)=> {
    const products = await Product.find(); // For now, fetch all products
    res.status(200).json({
        success: true,
        products
    });
})
//get single product details => /api/v1/products/:id
exports.getSingleProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404))
    }
    res.status(200).json({
        success: true,
        product
    });
})