// import User from '../../schema';
import User from '../../schema/userSchema';

const checkUserEmail = async (email) => {
  console.log('userDAO에 왔슴');
  //   console.log(User.findOne({ email: 'email' }));
  return await User.findOne({ email });
};

export default { checkUserEmail };
