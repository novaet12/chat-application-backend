const User = require('../models/User');

exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    if (friendId === req.user.id) return res.status(400).json({ error: 'Cannot add yourself' });
    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendId);
    if (!friend) return res.status(404).json({ error: 'Friend not found' });
    if (user.friends.includes(friendId)) return res.status(400).json({ error: 'Already friends' });
    user.friends.push(friendId);
    friend.friends.push(req.user.id);
    await user.save();
    await friend.save();
    res.json({ friends: user.friends });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendId);
    if (!friend) return res.status(404).json({ error: 'Friend not found' });
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== req.user.id);
    await user.save();
    await friend.save();
    res.json({ friends: user.friends });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 