import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    nickname: {
      type: String,
      index: true,
      unique: true,
      required: [true, 'Please enter nickname'],
      maxlength: [7, 'Nickname must be 7 characters or less.'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please enter email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter password'],
      minlength: [7, 'Password must be at least 7 characters'],
    },
    social_id: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isBasicImage: {
      type: Boolean,
    },
    userImage: {
      type: String,
    },
    refreshtoken: {},
  },
  { timestamps: true }
);

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

const bookmarkSchema = new Schema({
  post_id: {
    type: mongoose.Schema.type.ObjectId,
    ref: 'Post',
    required: true,
    index: true,
  },
  user_id: {
    type: mongoose.Schema.type.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
});

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Post', postSchema);
module.exports = mongoose.model('Comment', commentSchema);
module.exports = mongoose.model('Bookmark', bookmarkSchema);
