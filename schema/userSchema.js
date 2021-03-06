import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickname: {
    type: String,
    index: true,
    unique: true,
    required: true,
    maxlength: [7, 'Nickname must be 7 characters or less.'],
  },
  email: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { email: { $exists: true, $gt: '' } },
    },
    // unique: true,
    required: [true, 'Please enter email'],
    // sparse: true,
    // set: toLower,
  },
  password: {
    type: String,
    // required: [true, 'Please enter password'],
    minlength: [7, 'Password must be at least 7 characters'],
  },
  social_id: {
    type: String,
  },
  social_platform: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  profileImage: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  state: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

function toLower(email) {
  return email.toLowerCase();
}

const User = mongoose.model('User', userSchema);

export default User;
