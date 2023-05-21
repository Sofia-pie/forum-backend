const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    profilePicture: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
