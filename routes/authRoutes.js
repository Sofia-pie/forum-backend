const express = require('express');
const router = express.Router();
const multer = require('multer');

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

const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);

module.exports = {
  authRouter: router,
};
