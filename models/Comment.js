const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    topic_id: { type: Schema.Types.ObjectId, ref: 'Topic' },
    text: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvoters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downvoters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: { createdAt: 'created_date', updatedAt: false } }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  Comment,
};
