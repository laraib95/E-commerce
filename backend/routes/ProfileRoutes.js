const express = require('express');
const router = express.Router();
const {verifyToken} = require('../Middlewares/authMiddleware');

const {viewUserProfile , updateUserProfile} = require('../Controllers/userController');
router.get('/profile',verifyToken,viewUserProfile);
router.put('/profile',verifyToken,updateUserProfile);
module.exports = router;