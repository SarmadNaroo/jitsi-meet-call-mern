const jwt = require('jwt-simple');
const config = require('../config/config');
const User = require('../models/User');

exports.initiateCall = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const roomName = `call-${req.user.id}-${recipientId}-${Date.now()}`;

        // Generate Jitsi Meet token
        const token = jwt.encode({ room: roomName, user: req.user.username }, config.jwtSecret);

        // Find recipient user and notify via Socket.IO
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).send('Recipient not found');
        }

        // Notify recipient of the incoming call
        req.app.io.emit('call', {
            recipientId: recipient._id,
            roomName,
            caller: req.user.username
        });

        res.json({ roomName, token });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
