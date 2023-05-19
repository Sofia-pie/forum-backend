const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicsByTag,
} = require('../controllers/topicController');
const {
  createComment,
  updateComment,
} = require('../controllers/commentController');
const router = express.Router();

router.get('/', getAllTopics);

router.post('/', authMiddleware, createTopic);

router.get('/tags/:tagId', getTopicsByTag);

router.get('/:id', getTopicById);

router.put('/:id', authMiddleware, updateTopic);
router.delete('/:id', authMiddleware, deleteTopic);

router.post('/:id/comments', authMiddleware, createComment);
router.put('/:id/comments/:commentId', authMiddleware, updateComment);

module.exports = {
  topicsRouter: router,
};
