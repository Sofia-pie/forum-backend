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

const upvoteTopic = async (req, res) => {
  try {
    const userId = req.user._id;
    const topicId = req.params.id;
    const action = req.body.action;
    const topic = await Topic.findById(topicId);
    if (action === 'add') {
      if (topic.upvoters.includes(userId)) {
        return res.json({ message: 'already upvoted' });
      } else if (topic.downvoters.includes(userId)) {
        topic.downvoters.pull(userId);
      }
      topic.downvoters.push(userId);
      topic.upvotes = topic.upvoters.length - topic.downvoters.length;
      await topic.save();
    } else if (action === 'remove') {
      if (!topic.upvoters.includes(userId)) {
        return res
          .status(400)
          .json({ error: 'User has not upvoted this topic' });
      }
      const upvoterIndex = topic.upvoters.indexOf(userId);
      topic.upvoters.splice(upvoterIndex, 1);
      await topic.save();
    }
    res.json(topic);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const downvoteTopic = async (req, res) => {
  const topicId = req.params.id;
  const userId = req.user._id;
  const action = req.body.action;
  try {
    const topic = await Topic.findById(topicId);
    if (action === 'add') {
      if (topic.downvoters.includes(userId)) {
        return res
          .status(400)
          .json({ error: 'User has already downvoted this topic' });
      } else if (topic.upvoters.includes(userId)) {
        topic.upvoters.pull(userId);
      }
      topic.downvoters.push(userId);
      topic.upvotes = topic.upvoters.length - topic.downvoters.length;
      await topic.save();
    } else if (action === 'remove') {
      if (!topic.downvoters.includes(userId)) {
        return res
          .status(400)
          .json({ error: 'User has not upvoted this topic' });
      }
      const downvoterIndex = topic.downvoters.indexOf(userId);
      topic.downvoters.splice(downvoterIndex, 1);
      topic.upvotes = topic.upvoters.length - topic.downvoters.length;
      await topic.save();
    }
    res.json(topic);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
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
  upvoteTopic,
  downvoteTopic,
  updateTopic,
  deleteTopic,
};
