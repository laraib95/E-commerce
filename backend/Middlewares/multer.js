// multer.js
const multer = require('multer');
const path = require('path');
// const { isModuleNamespaceObject } = require('util/types'); // This import is not used and can be removed

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Correct path to go up one directory (from 'middlewares')
        // and then into 'uploads' folder
        cb(null, path.join(__dirname, '../uploads/')); // Corrected: null for error, '../uploads/' for path
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Accepts images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) { // Added /i for case-insensitive match
        // Use an actual Error object to pass to next() or the global error handler
        return cb(new Error('Only support images with jpg, jpeg, png, gif extension'), false); // false to reject the file
    }
    cb(null, true);
};

// max 5MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;