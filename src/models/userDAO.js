import User from '../../schema/userSchema';
import mongoose from 'mongoose';
import moment from '../utils/moment';
import Post from '../../schema/postSchema';
import Bookmark from '../../schema/bookmarkSchema';

const checkUserEmail = async (email) => {
  return await User.findOne({ email: email });
};

const checkUserNickname = async (nickname) => {
  return await User.findOne({ nickname });
};

const checkUserId = async (id) => {
  return await User.findOne({ _id: id }, '_id nickname role profileImage');
};

const checkUserInfo = async (id) => {
  return await User.findOne({ _id: id }, 'email nickname profileImage');
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
  const newBookmark = await new Bookmark({
    postId: result._id,
    userId: userId._id,
  }).save(); //.save()가 있어야 저장됨. 꼭 넣어주기

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
  console.log('userDAO에');
  console.log(userId, postId);
  const deleteBookmark = await Bookmark.findOneAndDelete({
    $and: [{ postId: result._id }, { userId: userId._id }],
  });
  const result = await Post.findOneAndUpdate(
    { postId: postId },
    {
      $pull: { userBookmark: { _id: userId._id } },
      $inc: { 'count.bookmark': -1 },
    },
    { new: true }
  );
  console.log(result);
  // const deleteBookmark = await Bookmark.findOneAndDelete({
  //   $and: [{ postId: result._id }, { userId: userId._id }],
  // });
  return result;
};

const checkBookmark = async (user_id, postId) => {
  // const result = await Post.findOne({ userBookmark: user_id._id })
  //   .select('userBookmark')
  //   .lean();

  const result = await Post.exists({
    $and: [{ userBookmark: user_id._id }, { postId: postId }],
  });
  console.log(result);
  return result;
};

export default {
  checkUserEmail,
  checkUserNickname,
  checkUserId,
  checkUserInfo,
  createUser,
  findUserPost,
  createUserBookmark,
  findUserBookmark,
  removeUserBookmark,
  checkBookmark,
};
