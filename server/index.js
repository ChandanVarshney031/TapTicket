const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('joinMovie', (movieId) => {
        socket.join(movieId);
        console.log(`User joined movie room: ${movieId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Make io accessible to routes
app.set('io', io);

// Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const setupCronJobs = require('./utils/cronJobs');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

setupCronJobs();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
