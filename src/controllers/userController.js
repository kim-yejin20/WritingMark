import { userDAO } from '../models';
import { userService } from '../services';
import { bcrypt, crypto, errorGenerator } from '../utils';
import jwt from '../utils/jwt';

const user = async (req, res) => {
  try {
    const userinfo = await userService.checkUserinfo(req.user);
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
    const hashPassword = await bcrypt.encryptPassword(req.body.password, 10);
    req.body.password = hashPassword;
    const result = await userService.register(req.body);
    res.status(201).json({
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

const login = async (req, res) => {
  try {
    const userEmail = await userService.checkUserEmail(req.body.email);
    if (userEmail == null)
      errorGenerator('이메일 혹은 비밀번호가 다릅니다', 401);

    const isValidUser = await bcrypt.comparePassword(
      req.body.password,
      userEmail.password
    );
    if (isValidUser == false)
      errorGenerator('이메일 혹은 비밀번호가 다릅니다', 401);

    const token = await jwt.signToken(userEmail._id);
    res.status(200).json({
      status: 'success',
      token: token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const userInfo = async (req, res) => {
  try {
    const userinfo = await userService.checkUserinfo(req.user);
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

const readUserWritten = async (req, res) => {
  try {
    const result = await userService.checkUserWritten(req.user);
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

const createUserBookmark = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(postId);
    console.log('북마크에옴');
    if (req.user == null) errorGenerator('로그인 후 가능합니다', 403);
    const result = await userService.createUserBookmark(req.user, postId);
    console.log(result);
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

const findUserBookmarkTest = async (req, res) => {
  try {
    const result = await userService.findUserBookmarkTest(req.user);
    // console.log(result);
    // return result;
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

export default {
  user,
  register,
  login,
  userInfo,
  readUserWritten,
  createUserBookmark,
  findUserBookmarkTest,
};
