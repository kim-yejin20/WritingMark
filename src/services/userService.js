import { userDAO } from '../models';

const checkUserEmail = async (email) => {
  const result = await userDAO.checkUserEmail(email);
  return result;
};

const checkUserNickname = async (nickname) => {
  const result = await userDAO.checkUserNickname(nickname);
  return result;
};

const checkUserinfo = async (_id) => {
  const result = await userDAO.checkUserInfo(_id);
  return result;
};

const changeUserInfo = async (user, reqData) => {
  const result = await userDAO.changeUserInfo(user, reqData);
  return result;
};

const register = async (reqData) => {
  const result = await userDAO.createUser(reqData);
  return result;
};

const findUserPost = async (user) => {
  const result = await userDAO.findUserPost(user);
  return result;
};

const createUserBookmark = async (user_id, postId) => {
  const result = await userDAO.createUserBookmark(user_id, postId);
  return result;
};

const findUserBookmark = async (user) => {
  const result = await userDAO.findUserBookmark(user);
  return result;
};

const removeUserBookmark = async (user_id, postId) => {
  const result = await userDAO.removeUserBookmark(user_id, postId);
  return result;
};

const checkBookmark = async (user_id, postId) => {
  const result = await userDAO.checkBookmark(user_id, postId);
  return result;
};

const removeUserInfo = async (user) => {
  const result = await userDAO.removeUserInfo(user);
  return result;
};

export default {
  checkUserEmail,
  checkUserNickname,
  checkUserinfo,
  changeUserInfo,
  register,
  findUserPost,
  createUserBookmark,
  findUserBookmark,
  removeUserBookmark,
  checkBookmark,
  removeUserInfo,
};
