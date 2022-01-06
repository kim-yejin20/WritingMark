import { userDAO } from '../models';
import { userService } from '../services'; //서비스 만들기
import { bcrypt, crypto, errorGenerator } from '../utils';
import jwt from '../utils/jwt';

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
    if (req.body.nickname == '') {
      console.log('닉네임이 없습니다. 랜덤 생성하겠습니다.');
      const randomName = await crypto.makeRandomNickname();
      req.body.nickname = randomName;
    }
    const nicknameResult = await userService.checkUserNickname(
      req.body.nickname
    );
    if (nicknameResult !== null) errorGenerator('닉네임 중복', 409);
    const emailResult = await userService.checkUserEmail(req.body.email);
    if (emailResult !== null) errorGenerator('이메일 중복', 409);
    // 비밀번호 암호화 필요
    const hashPassword = await bcrypt.encryptPassword(req.body.password, 10);
    req.body.password = hashPassword;
    const result = await userService.register(req.body);
    res.status(201).json({
      status: 'success',
      result,
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const userEmail = await userService.checkUserEmail(req.body.email);
    console.log(userEmail.password);
    const isValidUser = await bcrypt.comparePassword(
      req.body.password,
      userEmail.password
    );
    if (!userEmail || !isValidUser)
      errorGenerator('이메일 혹은 비밀번호가 다릅니다', 401);
    const token = await jwt.signToken(userEmail._id);
    res.status(200).json({
      status: 'success',
      token: token,
    });
    // const result = await userService.checkUserAccount(req.body);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
    // res.status(err.statusCode).json({
    //   status: 'fail',
    //   message: err.message,
    // });
  }
};

export default { register, login };
