import User from '../../schema/userSchema';
import mongoose from 'mongoose';
import moment from '../utils/moment';
import Post from '../../schema/postSchema';
// import Bookmark from '../../schema/bookmarkSchema';

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
    { password: reqData.password },
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

const findUserPost = async (user) => {
  return await Post.find({ writer: user })
    .populate('writer', 'nickname profileImage')
    .sort({ postId: -1 });
};

const createUserBookmark = async (userId, postId) => {
  const result = await Post.findOneAndUpdate(
    { postId: postId },
    {
      $push: { userBookmark: { _id: userId._id } },
      $inc: { 'count.bookmark': 1 },
    },
    { new: true }
  );
  return result;
};

const findUserBookmark = async (user) => {
  const result = await Post.find({ userBookmark: user._id }).populate(
    'writer',
    'nickname profileImage'
  );

  return result;
};

const removeUserBookmark = async (userId, postId) => {
  const result = await Post.findOneAndUpdate(
    { postId: postId },
    {
      $pull: { userBookmark: userId._id },
      $inc: { 'count.bookmark': -1 },
    },
    { new: true }
  );

  return result;
};

const checkBookmark = async (user_id, postId) => {
  const result = await Post.exists({
    $and: [{ userBookmark: user_id._id }, { postId: postId }],
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
  changeUserInfoWithImg,
  changeNotImage,
  changeBasicImage,
  changeUserPassword,
  createUser,
  findUserPost,
  createUserBookmark,
  findUserBookmark,
  removeUserBookmark,
  checkBookmark,
  removeUserInfo,
};
