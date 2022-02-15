import { body, check } from 'express-validator';
import { userDAO } from '../models';
import { userService } from '../services';
import { bcrypt, crypto, errorGenerator } from '../utils';
import jwt from '../utils/jwt';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { checkDuplicate } from '../../middlewares/checkDuplicate';
import axios from 'axios';
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
    const accessToken = req.headers.authorization;

    const kakao_profile = await axios({
      method: 'post',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoId = kakao_profile.data.id;
    const platform = 'kakao';
    const email = kakao_profile.data.kakao_account.email;
    const socialUser = await userService.checkUserSocial(kakaoId, platform);

    if (socialUser == null) {
      const randomName = await crypto.makeRandomNickname();
      const register = await userService.socialLogin(
        email,
        randomName,
        kakaoId,
        platform
      );
      const token = await jwt.signToken(register._id);
      return res.status(201).json({
        status: 'success',
        token,
      });
    }

    const token = await jwt.signToken(socialUser._id);

    res.status(200).json({
      status: 'success',
      token,
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

const changeUserInfo = async (req, res) => {
  try {
    const checkTest = await checkDuplicate(req);

    const file = req.file;
    const reqData = req.body;

    if (checkTest !== null) {
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
    const { lastId } = req.query;

    const about = 'post';
    const result = await userService.findUserPost(req.user, lastId);
    const postCount = await userService.countTotal(req.user, about);
    res.status(200).json({
      status: 'success',
      count: postCount,
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
    const userInfo = await userService.checkUserId(req.user._id);

    const isSamePW = await bcrypt.comparePassword(
      req.body.password,
      userInfo.password
    );
    if (isSamePW == false) errorGenerator('틀린 비밀번호입니다.', 401);

    if (req.body.newPassword != req.body.newPasswordCheck)
      errorGenerator(
        '새로운 비밀번호와 비밀번호 확인 입력이 같지 않습니다.',
        401
      );
    const hashPassword = await bcrypt.encryptPassword(req.body.newPassword, 10);
    req.body.newPassword = hashPassword;
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
    const { lastId } = req.query;
    const about = 'bookmark';
    const result = await userService.findUserBookmark(req.user, lastId);
    const bookmarkCount = await userService.countTotal(req.user, about);
    res.status(200).json({
      status: 'success',
      count: bookmarkCount,
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
    const userInfo = await userService.checkUserId(req.user._id);

    const isSamePW = await bcrypt.comparePassword(
      req.body.password,
      userInfo.password
    );

    if (isSamePW == false) errorGenerator('틀린 비밀번호입니다.', 401);

    const result = await userService.removeUserInfo(req.user);

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
