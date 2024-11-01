const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Protected Dashboard Route
router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: `Welcome to your dashboard, user ${req.user.userId}` });
});

// Additional protected routes can be added here
// Example: another protected route
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: `This is your profile, user ${req.user.userId}` });
});

module.exports = router;
