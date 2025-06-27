const express = require('express');
const router = express.Router();
const {verifyToken} = require('../Middlewares/authMiddleware');

const {viewUserProfile , updateUserProfile} = require('../Controllers/ProfileController');
router.get('/profile',verifyToken,viewUserProfile);
router.put('/profile',verifyToken,updateUserProfile);
module.exports = router;