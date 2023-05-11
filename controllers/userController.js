const { User } = require('../models/User');
const multer = require('multer');
const path = require('path');
const { Topic } = require('../models/Topic');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const url = `${req.protocol}://${req.get('host')}\\`;
    res.json({...user,profilePicture: url+user.profilePicture});
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

const getUserTopics = async (req, res) => {
  const userId = req.params.id;

  try {
    const topics = await Topic.find({ user: userId })
      .populate('tags')
      .populate('user_id')
      .populate({
        path: 'comments',
        populate: { path: 'user_id', select: 'username' },
      });

    res.status(200).json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserComments = async (req, res) => {
  const userId = req.params.id;

  try {
    const comments = await Comment.find({ user_id: userId })
      .populate('topic_id')
      .populate('user_id');

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._sid);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send('User deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserTopics,
  getUserComments,
  updateUser,
  deleteUser,
};
