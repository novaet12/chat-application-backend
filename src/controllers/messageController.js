const Message = require('../models/Message');
const path = require('path');
const userController = require('../controllers/userController');
const User = require('../models/User');

exports.searchMessages = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    const userId = req.user.id;
    const messages = await Message.find({
      $and: [
        {
          $or: [
            { sender: userId },
            { recipients: userId }
          ]
        },
        { content: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { recipients, group, content } = req.body;
    if (!recipients) return res.status(400).json({ error: 'Recipients required' });
    const recipientsArr = Array.isArray(recipients) ? recipients : JSON.parse(recipients);
    const mediaUrl = `/uploads/${req.file.filename}`;
    const message = new Message({
      sender: req.user.id,
      recipients: recipientsArr,
      group: group || null,
      content: content || '',
      mediaUrl,
      readBy: [req.user.id]
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 