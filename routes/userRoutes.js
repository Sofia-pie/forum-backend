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

router.get('/:id', getUser);

router.get('/:id/topics', getUserTopics);

router.get('/:id/comments', getUserComments);

module.exports = {
  userRouter: router,
};
