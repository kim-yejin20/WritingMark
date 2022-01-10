import { userDAO } from '../models';
import { userService } from '../services';
import { bcrypt, crypto, errorGenerator } from '../utils';
import jwt from '../utils/jwt';

const register = async (req, res) => {
  try {
    if (!req.body.nickname) errorGenerator('회원가입시 닉네임 키 필수', 400);
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
    const isValidUser = await bcrypt.comparePassword(
      req.body.password,
      userEmail.password
    );
    if (!userEmail || !isValidUser)
      errorGenerator('이메일 혹은 비밀번호가 다릅니다', 401);
    const token = await jwt.signToken(userEmail._id);
    console.log('id가뭐길래', userEmail.id);
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
  }
};

const userInfomation = async (req, res) => {
  try {
    const userinfo = await userService.checkUserId(req.user);
    res.status(200).json({
      status: 'success',
      userinfo,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export default { register, login, userInfomation };
