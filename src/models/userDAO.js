import User from '../../schema/userSchema';
import mongoose from 'mongoose';
import moment from '../utils/moment';
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
    createdAt: moment.localTime,
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
    createdAt: moment.localTime,
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
  console.log(about);
  if (about == 'post') {
    const result = await Post.find({ writer: user._id }).count();
    return result;
  } else if (about == 'bookmark') {
    const result = await Bookmark.find({ user_id: user._id }).count();
    return result;
  }
};

const createUserBookmark = async (userId, postId) => {
  const post = await Post.findOneAndUpdate(
    {
      postId: postId,
    },
    { $inc: { 'count.bookmark': 1 } },
    { new: true }
  );

  const result = await new Bookmark({
    post_id: post._id,
    postId: postId,
    user_id: userId._id,
    createdAt: moment.localTime,
  }).save();

  return result;
};

const findUserBookmark = async (user, lastId) => {
  const result = await Bookmark.find(
    lastId
      ? { $and: [{ _id: { $lt: lastId } }, { userBookmark: user._id }] }
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
    console.log(result[i]._id);
    result[i].bookmarkState = true;
  }

  return result;
};

const removeUserBookmark = async (userId, postId) => {
  const post = await Post.findOneAndUpdate(
    {
      postId: postId,
    },
    { $inc: { 'count.bookmark': -1 } },
    { new: true }
  );
  const result = await Bookmark.findOneAndRemove({ postId: postId });

  return result;
};

const checkBookmark = async (user_id, postId) => {
  const result = await Bookmark.exists({
    $and: [{ postId: postId }, { user_id: user_id._id }],
  });
  return result;
};

const removeUserInfo = async (user) => {
  // 유저 정보 삭제
  // const removeUser = await User.findByIdAndDelete({ _id: user._id }); // 테스트중이라 잠시 삭제

  //유저가 북마크 한 글 배열에 담김
  const removeBookmark = await Post.find({ userBookmark: { $in: user._id } });

  //유저가 쓴 글 배열에 담김 -> 게시글, 댓글은 삭제 안하기로 했지
  const removePost = await Post.find({ writer: user._id });

  return removePost;

  // return removeBookmark;

  // 이거 다시 손 봐야함니다.
  // return result;
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
