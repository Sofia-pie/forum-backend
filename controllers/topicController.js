const { Tag } = require('../models/Tag');
const { Topic } = require('../models/Topic');

const getAllTopics = (req, res) => {
  Topic.find()
    .populate({
      path: 'comments',
      populate: { path: 'user_id', select: 'username' },
    })
    .populate('tags')
    .populate({ path: 'user_id', select: 'username' })
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
    .populate('comments')
    .populate('tags')
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

      return topic.save().populate('tags');
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

  Topic.findByIdAndUpdate(id, { title, content, tags, upvote }, { new: true })
    .then((topic) => {
      if (topic) {
        res.status(200).json(topic);
      } else {
        res.status(404).json({ message: 'ТNot found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const deleteTopic = (req, res) => {
  const { id } = req.params;

  Topic.findByIdAndDelete(id)
    .then((topic) => {
      if (topic) {
        res.status(200).json({ message: 'Deleted' });
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
};
