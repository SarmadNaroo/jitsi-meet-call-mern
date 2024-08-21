// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users - Fetch all users except the logged-in user
router.get('/users', authMiddleware, getUsers);

module.exports = router;
