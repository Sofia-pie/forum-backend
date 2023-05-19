const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');

const token = process.env.TOKEN_KEY;

const registerUser = async (req, res, next) => {
  const { username, firstName, lastName, bio, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error('User with this email already exists');
      err.statusCode = 400;
      return next(err);
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      username,
      email,
      username,
      firstName,
      lastName,
      bio,
      password: hashedPassword,
      profilePicture: req.file ? req.file.path : null,
    });
    // create new user
    await user.save();

    return res.json({ message: 'User created' });
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    return next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (
      user &&
      (await bcryptjs.compare(String(req.body.password), String(user.password)))
    ) {
      const payload = {
        user_id: user._id,
      };
      const jwtToken = jwt.sign(payload, token);
      return res.json({ jwt_token: jwtToken, _id: user._id });
    }
    const err = new Error('Not authorized');
    err.statusCode = 400;
    return next(err);
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 500;
    return next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
