import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickname: {
    type: String,
    index: true,
    unique: true,
    maxlength: [7, 'Nickname must be 7 characters or less.'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please enter email'],
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please fill a valid email address',
    ],
    set: toLower,
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
  createdAt: {
    type: Date,
  },
});

function toLower(email) {
  return email.toLowerCase();
}

// const User = mongoose.model('User', userSchema);

// // export default { User };

// module.exports = User;

module.exports = mongoose.model('User', userSchema);
