const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const config = require('../config/config');

// User Registration
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send('Username or email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the new user
        await newUser.save();

        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        // Check if the password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate a JWT token
        const token = jwt.encode(
            { userId: user._id, username: user.username },
            config.jwtSecret
        );

        // Update the user's status to 'online'
        user.status = 'online';
        await user.save();

        res.json({
            token,
            userId: user._id, // Send userId along with other user details
            username: user.username,
            email: user.email,
            status: user.status
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};