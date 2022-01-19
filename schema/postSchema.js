import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  postId: {
    type: Number,
  },
  writer: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  categoryValue: {
    type: String,
    required: true,
  },
  categoryLabel : {
    type: String,
    required : true,
  },
  content: {
    type: String,
    required: [true, 'content는 필수입니다.'],
  },
  createdAt: {
    type: String,
  },
  info_title: {
    type: String,
  },
  info_url: {
    type: String,
  },

  image: {
    info_image: {
      type: String,
    },
    originalImageName: {
      type: String,
    },
  },
  count: {
    // type: Number,
    bookmark: {
      type: Number,
      default: 0,
    },
    comment: {
      type: Number,
      default: 0,
    },
  },
  userBookmark: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

export default Post;
