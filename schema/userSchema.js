import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickname: {
    type: String,
    index: true,
    unique: true,
    // maxlength: [7, 'Nickname must be 7 characters or less.'],
    maxlength: 7,
  },
  email: {
    type: String,
    unique: true,
    // required: [true, 'Please enter email'],
    required: true,
    // match: [
    //   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    //   'Please fill a valid email address',
    // ],
    set: toLower,
  },
  password: {
    type: String,
    // required: [true, 'Please enter password'],
    required: true,
    // minlength: [7, 'Password must be at least 7 characters'],
    minlength: 7,
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
  isBasicImage: {
    type: Boolean,
    defalt: true,
  },
  userImage: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

function toLower(email) {
  return email.toLowerCase();
}

// const User = mongoose.model('User', userSchema);

// // export default { User };

// module.exports = User;

module.exports = mongoose.model('User', userSchema);
