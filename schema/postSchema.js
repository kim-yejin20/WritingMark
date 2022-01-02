import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  postId: {
    type: Number,
    default: 0,
  },
  writer: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  info_title: {
    type: String,
  },
  info_url: {
    type: String,
  },
  info_image: {
    type: String,
  },
  count: {
    like: {
      type: Number,
      default: 0,
    },
    comment: {
      type: Number,
      default: 0,
    },
  },
});

const Post = mongoose.model('Post', postSchema);

export { Post };
