const jwt = require('jwt-simple');
const config = require('../config/config');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied');
    try {
        const decoded = jwt.decode(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = authenticate;
