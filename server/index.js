const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/estatehub';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Socket.io: Room based on Property
io.on('connection', (socket) => {
  console.log('Socket Connected:', socket.id);

  // Join the property's live chat room
  socket.on('join_property_chat', (propertyId) => {
    if (propertyId) {
      socket.join(String(propertyId));
      console.log(`Socket ${socket.id} joined property room: ${propertyId}`);
    }
  });

  // Broadcast message to everyone in that property room
  socket.on('send_message', ({ propertyId, messageData }) => {
    if (propertyId) {
      io.to(String(propertyId)).emit('receive_message', messageData);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});