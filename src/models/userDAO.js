import User from '../../schema/userSchema';
import mongoose from 'mongoose';
import moment from '../utils/moment';
import Post from '../../schema/postSchema';
import Bookmark from '../../schema/bookmarkSchema';

// const ObjectId = mongoose.Types.ObjectId;

// String.prototype.toObjectId = function () {
//   var ObjectId = mongoose.Types.ObjectId;
//   return new ObjectId(this.toString());
// };

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
  // const post_id = await Post.findOne({ postId: postId });
  // console.log('post_id?', post_id);
  const result = await Post.findOneAndUpdate(
    { postId: postId },
    { $push: { userBookmark: { _id: userId._id } } },
    { new: true }
  );
  console.log('result', result);
  const newBookmark = await new Bookmark({
    postId: result._id,
    userId: userId._id,
  });
  console.log('newBookmark?', newBookmark);

  //post문서에 북마크에도 카운트 추가해야함!!!!!!!!!!!!!

  // array에 _id추가하는거
  // const result = await User.findOneAndUpdate(
  //   { _id: userId },
  //   {
  //     $push: {
  //       bookmarkPost: { _id: post_id._id },
  //     },
  //   }
  // );

  return result;
};

const findUserBookmarkTest = async (user) => {
  // const result = await Bookmark.exists({ userId: user }); //true만 하나 나옴
  const post = await Post.find({})
    .populate('writer', 'nickname profileImage')
    .sort({ postId: -1 });
  console.log('post의 첫번째 객체는??', post[0]);
  console.log('user._id는?', user._id);

  const test = await User.findById(user._id);
  const result = await User.findById(user._id).populate({
    path: 'bookmarkPost',
    populate: { path: 'writer', select: 'nickname' },
  });

  // const result = await Bookmark.find(post[0]._id).exists(user._id);
  // console.log('post의 한 객체는?', post)
  // const bookmarkt_result = await post.exists({ userId: user });
  return test;
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
