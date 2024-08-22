const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors'); 
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jwt = require('jwt-simple');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique room names

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' })); 
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', userRoutes);

const io = socketIo(server, {
    cors: {
        origin: '*', 
        methods: ["GET", "POST"],
        allowedHeaders: ["authorization"],
        credentials: true,
    }
});

// Middleware to authenticate socket connections
io.use((socket, next) => {
    const userId = socket.handshake.query.userId; // Directly receive userId
    if (userId) {
        socket.userId = userId;
        next();
    } else {
        next(new Error('Authentication error'));
    }
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected with user ID:', socket.userId);

    // Join a user-specific room
    socket.join(socket.userId);

    // Handle 'call' event when a user initiates a call
    socket.on('call', ({ recipientId }) => {
        const roomName = uuidv4(); // Generate a unique room name
        console.log(`Call from ${socket.userId} to ${recipientId} in room ${roomName}`);

        // Notify the caller about the room name
        socket.emit('callStarted', { roomName });

        // Notify the recipient about the call
        socket.to(recipientId).emit('call', { roomName, caller: socket.userId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected with user ID:', socket.userId);
    });
});

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server
server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
