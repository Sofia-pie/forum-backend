const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getUser,
  updateUser,
  deleteUser,
  getUserTopics,
  getUserComments,
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads' });

router.put('/', authMiddleware, upload.single('profilePicture'), updateUser);

router.delete('/', authMiddleware, deleteUser);

router.get('/:id', authMiddleware, getUser);

router.get('/:id/topics', authMiddleware, getUserTopics);

router.get('/:id/comments', authMiddleware, getUserComments);

module.exports = {
  userRouter: router,
};
