const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  upvoteItem,
  downvoteItem,
} = require('../controllers/upvotesController');

const router = express.Router();

router.put('/upvote/:id', authMiddleware, upvoteItem);
router.put('/downvote/:id', authMiddleware, downvoteItem);

module.exports = {
  upvoteRouter: router,
};
