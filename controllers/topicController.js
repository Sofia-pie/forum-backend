const { Comment } = require('../models/Comment');
const { Tag } = require('../models/Tag');
const { Topic } = require('../models/Topic');

const getAllTopics = (req, res) => {
  Topic.find()
    .populate({
      path: 'comments',
      populate: { path: 'user_id', select: 'username' },
    })
    .populate({ path: 'tags', select: 'name' })
    .populate({ path: 'user_id', select: 'username profilePicture' })
    .then((topics) => {
      res.status(200).json(topics);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const getTopicById = (req, res) => {
  const { id } = req.params;
  Topic.findById(id)
    .populate({
      path: 'comments',
      populate: { path: 'user_id', select: 'username profilePicture' },
    })
    .populate({ path: 'tags', select: 'name' })
    .populate({ path: 'user_id', select: 'username profilePicture' })
    .then((topic) => {
      if (topic) {
        res.status(200).json(topic);
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const createTopic = (req, res) => {
  const { title, content, tags } = req.body;
  const user_id = req.user._id;
  Promise.all(
    tags.map((tagName) => {
      return Tag.findOne({ name: tagName }).then((tag) => {
        if (!tag) {
          tag = new Tag({ name: tagName });
          return tag.save();
        } else {
          return tag;
        }
      });
    })
  )
    .then((tagDocs) => {
      const tagIds = tagDocs.map((tag) => tag._id);

      const topic = new Topic({
        title,
        content,
        tags: tagIds,
        upvotes: 0,
        user_id,
        comments: [],
      });

      return topic.save();
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const updateTopic = (req, res) => {
  const { id } = req.params;

  const { title, content, tags } = req.body;

  Promise.all(
    tags.map((tagName) => {
      return Tag.findOne({ name: tagName }).then((tag) => {
        if (!tag) {
          tag = new Tag({ name: tagName });
          return tag.save();
        } else {
          return tag;
        }
      });
    })
  )
    .then((tagDocs) => {
      const tagIds = tagDocs.map((tag) => tag._id);
      return Topic.findByIdAndUpdate(
        id,
        { title, content, tags: tagIds },
        { new: true }
      );
    })
    .then((topic) => {
      console.log(topic);
      if (topic) {
        res.status(200).json(topic);
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const deleteTopic = async (req, res) => {
  const { id } = req.params;
  try {
    const topic = await Topic.findByIdAndDelete(id);
    if (topic) {
      await Comment.deleteMany({ topic: id });
      res.status(200).json({ message: 'Deleted' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
};
