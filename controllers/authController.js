const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');

const token = process.env.TOKEN_KEY;

const registerUser = async (req, res, next) => {
  const { username, firstName, lastName, bio, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: 'User with this email already exists' });
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
};

const loginUser = async (req, res, next) => {
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
  return res.status(400).json({ message: 'Not authorized' });
};

module.exports = {
  registerUser,
  loginUser,
};
