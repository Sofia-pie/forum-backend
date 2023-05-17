const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const upload = multer({ dest: 'uploads' });

const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);

module.exports = {
  authRouter: router,
};
