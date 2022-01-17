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

const register = async (reqData) => {
  try {
    const result = await userDAO.createUser(reqData);
    return result;
  } catch (err) {
    throw err;
  }
};

const findUserPost = async (user) => {
  try {
    const result = await userDAO.findUserPost(user);
    return result;
  } catch (err) {
    throw err;
  }
};

const createUserBookmark = async (user_id, postId) => {
  try {
    const result = await userDAO.createUserBookmark(user_id, postId);
    return result;
  } catch (err) {
    throw err;
  }
};

const findUserBookmark = async (user) => {
  try {
    const result = await userDAO.findUserBookmark(user);
    return result;
  } catch (err) {
    throw err;
  }
};

const removeUserBookmark = async (user_id, postId) => {
  try {
    const result = await userDAO.removeUserBookmark(user_id, postId);
    return result;
  } catch (err) {
    throw err;
  }
};

const checkBookmark = async (user_id, postId) => {
  try {
    const result = await userDAO.checkBookmark(user_id, postId);
    return result;
  } catch (err) {
    throw err;
  }
};

export default {
  checkUserEmail,
  checkUserNickname,
  checkUserinfo,
  register,
  findUserPost,
  createUserBookmark,
  findUserBookmark,
  removeUserBookmark,
  checkBookmark,
};
