import User from '../../schema/userSchema';
import mongoose from 'mongoose';
import moment from 'moment';
import Post from '../../schema/postSchema';
import Bookmark from '../../schema/bookmarkSchema';

const checkUserEmail = async (email) => {
  return await User.findOne({ email: email });
};

const checkUserNickname = async (nickname) => {
  return await User.findOne({ nickname: nickname });
};

const checkUserToken = async (id) => {
  return await User.findOne({ _id: id }, '_id nickname role profileImage');
};

const checkUserId = async (id) => {
  return await User.findById({ _id: id }).select('_id password');
};

const checkUserInfo = async (id) => {
  return await User.findOne({ _id: id }, 'email nickname profileImage');
};

const checkUserSocial = async (kakaoId, platform) => {
  const result = await User.findOne({
    $and: [{ social_id: kakaoId }, { social_platform: platform }],
  });
  return result;
};

const changeUserInfoWithImg = async (user, reqData, file) => {
  const result = await User.findByIdAndUpdate(
    { _id: user._id },
    {
      email: reqData.email,
      nickname: reqData.nickname,
      profileImage: file.key.replace('user/', ''),
    }
  );
  console.log('문서 수정 전 result', result);
  return result;
};

const changeNotImage = async (user, reqData) => {
  const result = await User.findByIdAndUpdate(
    { _id: user._id },
    { email: reqData.email, nickname: reqData.nickname }
  );
  return result;
};

const changeBasicImage = async (user, reqData) => {
  const result = await User.findOneAndUpdate(
    { _id: user._id },
    {
      email: reqData.email,
      nickname: reqData.nickname,
      profileImage: 'basicProfileImage.png',
    }
  );
  return result;
};

const changeUserPassword = async (user, reqData) => {
  const result = await User.findByIdAndUpdate(
    { _id: user._id },
    { password: reqData.newPassword },
    { new: true }
  );
  return result;
};

const createUser = async (reqData) => {
  const result = await new User({
    nickname: reqData.nickname,
    email: reqData.email,
    password: reqData.password,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    profileImage: 'basicProfileImage.png',
  }).save();
  return result;
};

const createSocialUser = async (email, randomName, kakaoId, platform) => {
  const result = await new User({
    nickname: randomName,
    email: email,
    social_id: kakaoId,
    social_platform: platform,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    profileImage: 'basicProfileImage.png',
  }).save();
  return result;
};

const findUserPost = async (user, lastId) => {
  const result = await Post.find(
    lastId
      ? { $and: [{ _id: { $lt: lastId } }, { writer: user }] }
      : { writer: user }
  )
    .sort({ _id: -1 })
    .limit(5)
    .populate('writer', 'nickname profileImage')
    .lean();

  for (let i in result) {
    const state = await Bookmark.exists({
      $and: [{ post_id: result[i]._id }, { user_id: user }],
    });
    result[i].bookmarkState = state;
  }
  return result;
};

const countTotal = async (user, about) => {
  if (about == 'post') {
    const result = await Post.find({ writer: user._id }).count();
    return result;
  } else if (about == 'bookmark') {
    const result = await Bookmark.find({ user_id: user._id }).count();
    return result;
  }
};

const createUserBookmark = async (userId, postId) => {
  const post_id = await Post.findOne({ postId: postId }).exec();

  const result = await new Bookmark({
    post_id: post_id,
    postId: postId,
    user_id: userId._id,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }).save();

  console.log('북마크 하기 result', result);

  if (result != null) {
    const post = await Post.findOneAndUpdate(
      {
        postId: postId,
      },
      { $inc: { 'count.bookmark': 1 } },
      { new: true }
    ).exec();

    console.log('북마크 취소후 count +1', post);
  }

  return result;
};

const findUserBookmark = async (user, lastId) => {
  const result = await Bookmark.find(
    lastId
      ? { $and: [{ _id: { $lt: lastId } }, { user_id: user._id }] }
      : { user_id: user._id }
  )
    .sort({ _id: -1 })
    .limit(5)
    .populate({
      path: 'post_id',
      populate: { path: 'writer', select: 'nickname profileImage' },
    })
    .lean();

  for (let i in result) {
    result[i].bookmarkState = true;
  }

  return result;
};

const removeUserBookmark = async (userId, postId) => {
  const result = await Bookmark.findOneAndDelete({
    $and: [{ postId: postId }, { user_id: userId._id }],
  }).exec();

  console.log('북마크 취소 result', result);

  if (result != null) {
    const post = await Post.findOneAndUpdate(
      {
        postId: postId,
      },
      { $inc: { 'count.bookmark': -1 } },
      { new: true }
    ).exec();

    console.log('북마크 취소후 count -1', post);
  }

  return result;
};

const checkBookmark = async (user_id, postId) => {
  const result = await Bookmark.exists({
    $and: [{ postId: postId }, { user_id: user_id._id }],
  });
  return result;
};

const removeUserInfo = async (user) => {
  // 유저 정보 변경 (프로필 이미지 -> 기본 이미지 변경 / 이메일, 패스워드 -> 삭제, state -> inactive);
  const removeUser = await User.findByIdAndUpdate(
    { _id: user._id },
    {
      $unset: {
        email: '',
        password: '',
        social_id: '',
        social_platform: '',
      },
      profileImage: 'basicProfileImage.png',
      state: 'inactive',
    },
    { new: true }
  );

  return removeUser;
};

export default {
  checkUserEmail,
  checkUserNickname,
  checkUserToken,
  checkUserId,
  checkUserInfo,
  checkUserSocial,
  changeUserInfoWithImg,
  changeNotImage,
  changeBasicImage,
  changeUserPassword,
  createUser,
  createSocialUser,
  findUserPost,
  countTotal,
  createUserBookmark,
  findUserBookmark,
  removeUserBookmark,
  checkBookmark,
  removeUserInfo,
};
