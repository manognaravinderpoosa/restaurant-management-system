const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

// Set up Express app
const app = express();

// Create HTTP server and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
});

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() instead of bodyParser

// MongoDB URI
const mongoURI = 'mongodb://localhost:27017/restaurant_management';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: "Restaurant Management API is running!" });
});

// Basic routes without parameters first
app.post('/api/signup', (req, res) => {
    res.json({ message: "Signup endpoint" });
});

app.post('/api/login', (req, res) => {
    res.json({ message: "Login endpoint" });
});

app.get('/api/stock', (req, res) => {
    res.json({ message: "Get stock endpoint" });
});