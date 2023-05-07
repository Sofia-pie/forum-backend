const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getUser,
  updateUser,
  deleteUser,
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

// Get a user by ID
router.get('/:id', authMiddleware, getUser);

// Update a user with profile picture
router.put('/', upload.single('profilePicture'), authMiddleware, updateUser);

// Delete a user
router.delete('/', authMiddleware, deleteUser);

module.exports = {
  userRouter: router,
};
