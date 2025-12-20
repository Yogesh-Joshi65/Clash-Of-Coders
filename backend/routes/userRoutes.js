const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// Get profile by ID
router.get('/:id', getUserProfile);

// Update profile
router.put('/update', updateUserProfile);

module.exports = router;