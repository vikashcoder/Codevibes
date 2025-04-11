const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT'],
  },
});

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Uploads folder mein save hoga
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Unique filename (timestamp + extension)
  },
});
const upload = multer({ storage });

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb+srv://vikash29raj:vikash@cluster0.abkydjo.mongodb.net/codes?retryWrites=true&w=majority', {
  serverSelectionTimeoutMS: 15000, // Increase timeout
  connectTimeoutMS: 15000, // Increase connection timeout
  socketTimeoutMS: 20000,  // Allow more time for requests
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api/auth', require('./routes/auth')(upload)); // Pass upload middleware to auth routes
app.use('/api/sessions', require('./routes/sessions'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('joinSession', (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session: ${sessionId}`);
  });
  socket.on('codeChange', ({ sessionId, code }) => {
    io.to(sessionId).emit('codeUpdate', code);
  });
  socket.on('sendMessage', async ({ sessionId, message, userId }) => {
    const User = require('./models/User');
    try {
      const user = await User.findById(userId);
      const username = user ? user.username : 'Unknown';
      console.log(`Sending message to ${sessionId}: ${username}: ${message}`);
      io.to(sessionId).emit('receiveMessage', { username, message, userId });
    } catch (error) {
      console.error('Message error:', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));