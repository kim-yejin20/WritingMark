import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
  post_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true,
  },
  postId: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  createdAt: {
    type: String,
  },
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
