import User from '../../schema/userSchema';
import mongoose from 'mongoose';
import moment from '../utils/moment';

// const ObjectId = mongoose.Types.ObjectId;

// String.prototype.toObjectId = function () {
//   var ObjectId = mongoose.Types.ObjectId;
//   return new ObjectId(this.toString());
// };

const checkUserEmail = async (email) => {
  return await User.findOne({ email: email });
};

const checkUserNickname = async (nickname) => {
  return await User.findOne({ nickname });
};

const checkUserId = async (id) => {
  return await User.findOne({ _id: id }, '_id nickname role');
};

const createUser = async (reqData) => {
  const result = await new User({
    nickname: reqData.nickname,
    email: reqData.email,
    password: reqData.password,
    createdAt: moment.localTime,
    // createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }).save();
  return result;
};

export default { checkUserEmail, checkUserNickname, checkUserId, createUser };
