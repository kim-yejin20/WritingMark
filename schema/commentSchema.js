import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    commentId: {
      type: Number,
      default: 0,
    },
    post_id: {
      type: mongoose.Schema.type.ObjectId,
      ref: 'Post',
      required: true,
    },
    postId : {
      type: Number,
    },
    writer: {
      type: mongoose.Schema.type.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [100, 'Comments must be 100 characters or less.'],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export { Comment };
