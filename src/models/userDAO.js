// import User from '../../schema';
import User from '../../schema/userSchema';

const checkUserEmail = async (email) => {
  console.log('userDAO에 왔슴');
  //   console.log(User.findOne({ email: 'email' }));
  return await User.findOne({ email });
};

const checkUserNickname = async (nickname) => {
  console.log('userDAO에 checkusernickname');
  return await User.findOne({ nickname });
};

// const enterUserNickname = async (nickname) => {
//   console.log('userDAO에 enterusernickname');
//   return await User.
// };

const createUser = async (reqData) => {
  console.log('userDAO- createuser에 왔음');
  const result = await new User({
    nickname: reqData.nickname,
    email: reqData.email,
    password: reqData.password,
  }).save();
  return result;
};

export default { checkUserEmail, checkUserNickname, createUser };
