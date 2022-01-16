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
  const result = await Bookmark.find({ userId: user._id }).populate({
    path: 'postId',
    populate: { path: 'writer', select: 'nickname profileImage' },
  });
  //이렇게 쿼리문 날릴경우 postId { } 안에 또 한번 객체들이 담겨서 프론트에서 관리가 어려웠음
  const result_test2 = await Bookmark.find({ userId: user._id });
  console.log(result_test2);
};

const findUserBookmarkTest = async (user) => {
  //post 문서에서 찾아서 그런지 리스트 페이지와 똑같이 결과값이 반환되어 프론트에서 관리하기 편했음.
  // 서버의 성능에 대해서 공부하고 뭐가 더 좋은지 찾아보자. 객체중에서 find하는 것이 좋은지, userBookmark 배열 안에서 find하는 것이 좋은지
  const result = await Post.find({ userBookmark: user._id }).populate(
    'writer',
    'nickname profileImage'
  );
  console.log(result);

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
  findUserBookmarkTest,
};
