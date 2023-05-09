const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getUser,
  updateUser,
  deleteUser,
  getUserTopics,
  getUserComments,
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.put('/', upload.single('profilePicture'), authMiddleware, updateUser);

router.delete('/', authMiddleware, deleteUser);

router.get('/:id', authMiddleware, getUser);

router.get('/:id/topics', authMiddleware, getUserTopics);

router.get('/:id/comments', authMiddleware, getUserComments);

module.exports = {
  userRouter: router,
};
