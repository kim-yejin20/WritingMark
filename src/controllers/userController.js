import { userService } from '../services'; //서비스 만들기

// const register = async (req, res) => {
//   console.log('회원가입에 와따!');
//   res.send('약!');
// };

// const register = async (req, res) => {
//   console.log('유저컨트롤러 - 회원가입');
//   console.log(req.body);
//   const email = req.body.email;
//   const nickname = req.body.nickname;
//   try {
//     if (nickname == '') {
//       var randomName = await userService.makeRandomName();
//     }
//     const nicknameResult = await userService.checkDuplicateNickname(nickname);
//     const emailResult = await userService.checkDuplicateEmail(email);
//     res.status(200).json({
//       status: 'success',
//       nicknameResult,
//       emailResult,
//       randomName,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err.message,
//     });
//   }
// };

const register = async (req, res) => {
  try {
    console.log('userController-register');
    if (req.body.email == '' || req.body.password == '') {
      throw new Error('Please enter the input.');
    }
    const result = await userService.register(req.body);
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
