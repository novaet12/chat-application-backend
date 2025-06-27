const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');
const { redis } = require('../app');
const Group = require('../models/Group');

function chatHandler(io) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('No token'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    // Join user room
    socket.join(socket.userId);

    // Join all group rooms
    const groups = await Group.find({ members: socket.userId });
    groups.forEach(group => {
      socket.join(group._id.toString());
    });

    // Join group event
    socket.on('join_group', async ({ groupId }) => {
      const group = await Group.findById(groupId);
      if (group && group.members.includes(socket.userId)) {
        socket.join(groupId);
      }
    });

    // Leave group event
    socket.on('leave_group', ({ groupId }) => {
      socket.leave(groupId);
    });

    // Listen for sending messages
    socket.on('send_message', async (data) => {
      // data: { recipients, content, group, mediaUrl }
      const message = new Message({
        sender: socket.userId,
        recipients: data.recipients,
        group: data.group || null,
        content: data.content,
        mediaUrl: data.mediaUrl,
        readBy: [socket.userId]
      });
      await message.save();
      // Publish to Redis for scaling
      redis.publish('messages', JSON.stringify({
        type: 'new_message',
        message
      }));
      // Emit to recipients
      data.recipients.forEach((rid) => {
        io.to(rid).emit('receive_message', message);
      });
      if (data.group) {
        io.to(data.group).emit('receive_message', message);
      }
    });

    // Listen for read receipts
    socket.on('read_message', async ({ messageId }) => {
      const message = await Message.findById(messageId);
      if (message && !message.readBy.includes(socket.userId)) {
        message.readBy.push(socket.userId);
        await message.save();
        message.recipients.forEach((rid) => {
          io.to(rid).emit('message_read', { messageId, userId: socket.userId });
        });
      }
    });

    // Typing indicator
    socket.on('typing', ({ to }) => {
      io.to(to).emit('typing', { from: socket.userId });
    });
  });

  // Redis subscriber for scaling
  const sub = redis.duplicate();
  sub.subscribe('messages');
  sub.on('message', (channel, message) => {
    if (channel === 'messages') {
      const data = JSON.parse(message);
      if (data.type === 'new_message') {
        data.message.recipients.forEach((rid) => {
          io.to(rid).emit('receive_message', data.message);
        });
        if (data.message.group) {
          io.to(data.message.group).emit('receive_message', data.message);
        }
      }
    }
  });
}

module.exports = chatHandler; 