import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
