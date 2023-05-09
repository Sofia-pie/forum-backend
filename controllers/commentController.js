const { Topic } = require('../models/Topic');
const { Comment } = require('../models/Comment');

const createComment = (req, res) => {
  const { text } = req.body;
  const topic_id = req.params.id;
  const user_id = req.user._id;

  Topic.findById(topic_id)
    .then((topic) => {
      if (!topic) {
        throw new Error('Topic not found');
      }

      const comment = new Comment({
        text,
        user_id,
        topic_id,
      });
      topic.comments.push(comment._id);

      return Promise.all([comment.save(), topic.save()]);
    })
    .then(([comment]) => {
      res.status(201).json(comment);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const updateComment = (req, res) => {
  const comment_id = req.params.commentId;

  const { text, upvotes } = req.body;

  Comment.findOneAndUpdate(
    { _id: comment_id },
    { text, upvotes },
    { new: true }
  )
    .populate('user_id topic_id')
    .then((comment) => {
      if (!comment) {
        throw new Error('Comment not found');
      }
      res.status(200).json(comment);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

module.exports = {
  createComment,
  updateComment,
};
