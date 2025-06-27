const Group = require('../models/Group');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'Name and members required' });
    }
    if (!members.includes(req.user.id)) members.push(req.user.id);
    const group = new Group({
      name,
      members,
      admins: [req.user.id]
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!group.admins.includes(req.user.id)) return res.status(403).json({ error: 'Only admins can add members' });
    if (group.members.includes(userId)) return res.status(400).json({ error: 'User already a member' });
    group.members.push(userId);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!group.admins.includes(req.user.id)) return res.status(403).json({ error: 'Only admins can remove members' });
    group.members = group.members.filter(id => id.toString() !== userId);
    group.admins = group.admins.filter(id => id.toString() !== userId);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id });
    res.json(groups);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 