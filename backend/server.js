const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const forumRoutes = require('./routes/forumRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const screeningRoutes = require('./routes/screeningRoutes');
const moodRoutes = require('./routes/moodRoutes');
const healthRoutes = require('./routes/healthRoutes');

dotenv.config();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "*", // allow frontend access
        methods: ["GET", "POST"]
    }
});

app.set('socketio', io); // Make io accessible in controllers

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_chat', (roomId) => {
        socket.join(roomId);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/screening', screeningRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/counselor', require('./routes/counselorRoutes'));

app.get('/', (req, res) => {
    res.send('MindCare API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
