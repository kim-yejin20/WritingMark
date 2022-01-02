import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export { Bookmark };
