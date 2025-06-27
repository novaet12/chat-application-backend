require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const messageRoutes = require('./routes/message');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Redis connection
const redis = new Redis(process.env.REDIS_URL);
redis.on('connect', () => {
  console.log('Redis connected');
});
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/message', messageRoutes);
app.use('/uploads', express.static('uploads'));

module.exports = app;
module.exports.redis = redis; 