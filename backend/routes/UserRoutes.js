const {getAllUsers , getSingleUser , createUserByAdmin , updateUser , deleteUser} = require('../Controllers/UserController')
const express = require('express')
const router = express.Router();

// Import the authentication and authorization middleware
const {verifyToken, authorizeRoles} = require('../Middlewares/authMiddleware')

// --- Admin Specific Routes (Requires 'Admin' role) ---
router.route('/admin/users')
                    .get(verifyToken, authorizeRoles('Admin'),getAllUsers)
                    .post(verifyToken, authorizeRoles('Admin'), createUserByAdmin)
router.route('/admin/users/:id')
                .get(verifyToken, authorizeRoles('Admin') ,getSingleUser)
                .put(verifyToken, authorizeRoles('Admin'), updateUser)
                .delete(verifyToken, authorizeRoles('Admin'), deleteUser)

module.exports = router;