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
    .catch((error) => {
      const err = new Error(error.message);
      err.statusCode = 500;
      return next(err);
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
        const err = new Error('Not Found');
        err.statusCode = 404;
        return next(err);
      }
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.statusCode = 500;
      return next(err);
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
    .catch((error) => {
      const err = new Error(error.message);
      err.statusCode = 500;
      return next(err);
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
        return res.status(200).json(topic);
      }
      const err = new Error('Not Found');
      err.statusCode = 404;
      return next(err);
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.statusCode = 500;
      return next(err);
    });
};

const deleteTopic = async (req, res) => {
  const { id } = req.params;
  try {
    const topic = await Topic.findByIdAndDelete(id);
    if (topic) {
      await Comment.deleteMany({ topic: id });
      return res.status(200).json({ message: 'Deleted' });
    }
    const err = new Error('Not Found');
    err.statusCode = 404;
    return next(err);
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    return next(err);
  }
};

const getTopicsByTag = (req, res) => {
  const { tagId } = req.params;
  Tag.findById(tagId)
    .then((tag) => {
      if (tag) {
        Topic.find({ tags: { $in: [tagId] } })
          .populate({
            path: 'comments',
            populate: { path: 'user_id', select: 'username' },
          })
          .populate({ path: 'tags', select: 'name' })
          .populate({ path: 'user_id', select: 'username profilePicture' })
          .then((topics) => {
            res.status(200).json(topics);
          });
      }
    })
    .catch((error) => {
      const err = new Error(error.message);
      err.statusCode = 500;
      return next(err);
    });
};

module.exports = {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicsByTag,
};
