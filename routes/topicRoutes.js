const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicController');
const router = express.Router();

router.get('/', getAllTopics);
router.get('/:id', getTopicById);
router.post('/', authMiddleware, createTopic);
router.put('/:id', authMiddleware, updateTopic);
router.delete('/:id', authMiddleware, deleteTopic);

module.exports = {
  topicsRouter: router,
};
