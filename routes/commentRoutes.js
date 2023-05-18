const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { deleteComment } = require('../controllers/commentController');

const router = express.Router();

router.delete('/:id', authMiddleware, deleteComment);

module.exports = {
  commentsRouter: router,
};
