import { body } from 'express-validator';
import { userDAO } from '../models';
import { userService } from '../services';
import { bcrypt, crypto, errorGenerator } from '../utils';
import jwt from '../utils/jwt';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
// import kakaoPassport from 'passport-kakao';

// const KakaoStrategy = kakaoPassport.Strategy;

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

const kakao = async (req, res) => {
  try {
    passport.use(
      new KakaoStrategy(
        {
          clientID: process.env.KAKAO_CLIENT_ID,
          clientSecret: '',
          callbackURL: 'http://localhost:8080/user/kakao/callback',
        },
        kakaoLoginCallback
      )
    );
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

const changeUserInfo = async (req, res) => {
  try {
    console.log('회원 정보 수정하기 컨트롤러');
    // console.log(req);
    // console.log('야아아아');
    // console.log('file?', file);
    console.log('req.file?', req.file);
    const file = req.file;
    const reqData = req.body;
    console.log(req.ValidationError);
    if (req.ValidationError) {
      console.log('에러가 있음니다');
      return res.status(409).json({
        status: 'fail',
        message: req.ValidationError,
      });
    }

    if (file != undefined) {
      console.log('이미지가 없을때');
      //프로필 이미지 변경
      const result = await userService.changeUserInfoWithImg(
        req.user,
        reqData,
        file
      );
      return res.status(200).json({
        status: 'success',
      });
    }

    // 이미지 수정
    const result = await userService.changeUserInfo(req.user, reqData);

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const findUserPost = async (req, res) => {
  try {
    if (req.user == null) errorGenerator('조회 권한 없음', 403);
    const result = await userService.findUserPost(req.user);
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

const changeUserPassword = async (req, res) => {
  try {
    // const userEmail = await userService.checkUserEmail(req.body.email);
    const userInfo = await userService.checkUserId(req.user);

    const isSamePW = await bcrypt.comparePassword(
      req.body.password,
      userInfo.password
    );
    if (isSamePW == false) errorGenerator('틀린 비밀번호입니다.', 401);

    if (req.body.newPassword == req.body.checkPassword)
      errorGenerator(
        '새로운 비밀번호와 비밀번호 확인 입력이 같지 않습니다.',
        401
      );
    const hashPassword = await bcrypt.encryptPassword(req.body.password, 10);
    req.body.password = hashPassword;
    const result = await userService.changeUserPassword(req.user, req.body);

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
  //북마크하기
  try {
    const postId = req.params.postId;
    if (req.user == null) errorGenerator('로그인 후 가능합니다', 403);

    //해당 게시글에 유저가 북마크 했는지 확인
    const checkBookmark = await userService.checkBookmark(req.user, postId);

    if (checkBookmark == true) errorGenerator('이미 북마크 한 글입니다.', 400);
    const result = await userService.createUserBookmark(req.user, postId);
    console.log('북마크 하기 결과', result);
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

const findUserBookmark = async (req, res) => {
  // 유저가 북마크한 글
  try {
    const postId = req.params.postId;
    const result = await userService.findUserBookmark(req.user, postId);
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

const removeUserBookmark = async (req, res) => {
  // 북마크 취소
  try {
    const postId = req.params.postId;

    //해당 게시글에 유저가 북마크 했는지 확인
    const checkBookmark = await userService.checkBookmark(req.user, postId);

    if (checkBookmark == false)
      errorGenerator('취소할 수 있는 북마크가 없습니다.', 400);

    const result = await userService.removeUserBookmark(req.user, postId);

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

const removeUserInfo = async (req, res) => {
  try {
    // 이거 아직 안끝남 !!
    const userInfo = await userService.checkUserId(req.user._id);

    const isSamePW = await bcrypt.comparePassword(
      req.body.password,
      userInfo.password
    );

    if (isSamePW == false) errorGenerator('틀린 비밀번호입니다.', 401);

    const result = await userService.removeUserInfo(req.user);
    //서비스랑 DAO 작성하기
    console.log(result);
    res.status(200).json({
      status: 'success',
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
  kakao,
  userInfo,
  changeUserInfo,
  changeUserPassword,
  findUserPost,
  createUserBookmark,
  findUserBookmark,
  removeUserBookmark,
  removeUserInfo,
};
