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

router.use(authMiddleware);

router.get('/', getAllTopics);
router.get('/:id', getTopicById);
router.post('/', createTopic);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);

module.exports = {
  topicsRouter: router,
};
