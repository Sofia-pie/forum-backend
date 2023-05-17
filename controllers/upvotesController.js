const { Comment } = require('../models/Comment');
const { Topic } = require('../models/Topic');

const upvoteItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    const { action, type } = req.body;
    const item = await (type === 'topic'
      ? Topic.findById(id)
      : Comment.findById(id));
    if (action === 'add') {
      if (item.upvoters.includes(userId)) {
        return res.status(400).json({ message: 'already upvoted' });
      } else if (item.downvoters.includes(userId)) {
        item.downvoters.pull(userId);
      }
      item.upvoters.push(userId);

      item.upvotes = item.upvoters.length - item.downvoters.length;
      await item.save();
    } else if (action === 'remove') {
      if (!item.upvoters.includes(userId)) {
        return res
          .status(400)
          .json({ error: 'User has not upvoted this item' });
      }
      const upvoterIndex = item.upvoters.indexOf(userId);
      item.upvoters.splice(upvoterIndex, 1);

      item.upvotes = item.upvoters.length - item.downvoters.length;
      await item.save();
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const downvoteItem = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  const { action, type } = req.body;
  try {
    const item = await (type === 'topic'
      ? Topic.findById(id)
      : Comment.findById(id));

    if (action === 'add') {
      if (item.downvoters.includes(userId)) {
        return res
          .status(400)
          .json({ error: 'User has already downvoted this item' });
      } else if (item.upvoters.includes(userId)) {
        item.upvoters.pull(userId);
      }
      item.downvoters.push(userId);

      item.upvotes = item.upvoters.length - item.downvoters.length;
      await item.save();
    } else if (action === 'remove') {
      if (!item.downvoters.includes(userId)) {
        return res
          .status(400)
          .json({ error: 'User has not downvoted this item' });
      }
      const downvoterIndex = item.downvoters.indexOf(userId);
      item.downvoters.splice(downvoterIndex, 1);
      item.upvotes = item.upvoters.length - item.downvoters.length;
      await item.save();
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  upvoteItem,
  downvoteItem,
};
