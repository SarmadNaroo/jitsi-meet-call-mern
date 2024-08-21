const jwt = require('jwt-simple');
const config = require('../config/config');

exports.generateToken = (req, res) => {
    try {
        const { room, userId } = req.body;
        const token = jwt.encode({
            room: room || 'default-room',
            sub: userId || req.user.id,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
        }, config.jwtSecret);
        res.json({ token });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
