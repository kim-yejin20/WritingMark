import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  // commentId: {
  //   type: Number,
  //   default: 0,
  // },
  post_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  postId: {
    type: Number,
    required: true,
  },
  writer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: [100, 'Comments must be 100 characters or less.'],
  },
  createdAt: {
    type: String,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
