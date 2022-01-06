import User from '../../schema/userSchema';
import moment from '../utils/moment';

const checkUserEmail = async (email) => {
  return await User.findOne({ email });
};

const checkUserNickname = async (nickname) => {
  return await User.findOne({ nickname });
};

const checkUserId = async (id) => {
  return await User.findOne({ id }, 'nickname role isBasicImage');
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
