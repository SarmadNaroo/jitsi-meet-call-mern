const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    // Fetch all users except the logged-in user
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
    
    // Return the list of users
    res.status(200).json(users);
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUsers };
