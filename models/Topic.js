const mongoose = require('mongoose');

const { Schema } = mongoose;

const topicSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    upvotes: {
      type: Number,
    },
  },
  { timestamps: { createdAt: 'created_date', updatedAt: false } }
);

const Topic = mongoose.model('Topic', topicSchema);

module.exports = {
  Topic,
};
