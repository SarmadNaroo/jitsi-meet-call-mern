const express = require('express');
const router = express.Router();
const jitsiController = require('../controllers/jitsiController');
const authenticate = require('../middleware/authMiddleware');

router.post('/jitsi-token', authenticate, jitsiController.generateToken);

module.exports = router;

