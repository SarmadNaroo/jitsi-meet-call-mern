const jwt = require('jwt-simple');
const config = require('../config/config');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if the Authorization header is present
    if (!authHeader) {
        return res.status(401).json({ error: 'Access Denied: No Authorization header provided' });
    }

    // Check if the Authorization header is properly formatted
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(400).json({ error: 'Malformed Authorization header' });
    }

    const token = tokenParts[1];

    // Decode the token
    try {
        const decoded = jwt.decode(token, config.jwtSecret);

        // Ensure the token is not expired (assuming 'exp' field is in seconds)
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({ error: 'Token has expired' });
        }

        // Attach user information to the request object
        req.user = decoded;
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.message === 'Token expired') {
            return res.status(401).json({ error: 'Token has expired' });
        } else if (error.message === 'Signature verification failed') {
            return res.status(401).json({ error: 'Invalid token signature' });
        } else if (error.message === 'Algorithm not supported') {
            return res.status(400).json({ error: 'Unsupported token algorithm' });
        } else {
            // General error handling
            console.error("JWT Decode Error: ", error.message);
            return res.status(400).json({ error: 'Invalid token' });
        }
    }
};

module.exports = authenticate;
