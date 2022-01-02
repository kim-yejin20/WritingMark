import { userService } from '../services'; //서비스 만들기

// const register = async (req, res) => {
//   console.log('회원가입에 와따!');
//   res.send('약!');
// };

const register = async (req, res) => {
  console.log('유저컨트롤러 - 회원가입');
  console.log(req.body);
  const email = req.body.email;
  const nickname = req.body.nickname;
  try {
    const result = await userService.checkDuplicateEmail(email);
    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export default { register };
