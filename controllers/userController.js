const { User } = require('../models/User');

const { Topic } = require('../models/Topic');
const { Comment } = require('../models/Comment');

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
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...req.body,
        profilePicture: req.file ? req.file.path : user.profilePicture,
      },
      {
        new: true,
      }
    );
    console.log(user);
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
    const topics = await Topic.find({ user_id: userId })
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
    const comments = await Comment.find({ user_id: userId }).populate(
      'user_id'
    );

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
