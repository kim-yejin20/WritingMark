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

const findUserWritten = async (user) => {
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

const findUserBookmarkTest = async (user) => {
  const result = await Bookmark.find({ userId: user._id }).populate({
    path: 'postId',
    populate: { path: 'writer', select: 'nickname profileImage' },
  });
  return result;
};

export default {
  checkUserEmail,
  checkUserNickname,
  checkUserId,
  checkUserInfo,
  createUser,
  findUserWritten,
  createUserBookmark,
  findUserBookmarkTest,
};
