const { User } = require('../models/User');

const { Topic } = require('../models/Topic');
const { Comment } = require('../models/Comment');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    return next(err);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json(user);
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    return next(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...req.body,
        profilePicture: req.file ? req.file.path : user.profilePicture,
      },
      {
        new: true,
      }
    );

    res.json(updatedUser);
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    return next(err);
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
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    return next(err);
  }
};

const getUserComments = async (req, res) => {
  const userId = req.params.id;

  try {
    const comments = await Comment.find({ user_id: userId }).populate(
      'user_id'
    );

    res.status(200).json(comments);
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    return next(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      const err = new Error('Not found');
      err.statusCode = 500;
      return next(err);
    }
    await Topic.updateMany(
      { $or: [{ upvoters: userId }, { downvoters: userId }] },
      { $pull: { upvoters: userId, downvoters: userId } }
    );
    await Comment.updateMany(
      { $or: [{ upvoters: userId }, { downvoters: userId }] },
      { $pull: { upvoters: userId, downvoters: userId } }
    );
    await Comment.updateMany({ user_id: userId }, { $unset: { user_id: 1 } });

    await Topic.updateMany({ user_id: userId }, { $unset: { user_id: 1 } });
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    return next(err);
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
