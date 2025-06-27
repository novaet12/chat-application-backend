const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const chatHandler = require('./sockets/chat');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Placeholder for future Redis and MongoDB connection

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

chatHandler(io);

module.exports = { io }; 