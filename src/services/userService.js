import { userDAO } from '../models';

const checkUserEmail = async (email) => {
  const result = await userDAO.checkUserEmail(email);
  return result;
};

const checkUserNickname = async (nickname) => {
  const result = await userDAO.checkUserNickname(nickname);
  return result;
};

const checkUserId = async (_id) => {
  const result = await userDAO.checkUserId(_id);
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

export default {
  checkUserEmail,
  checkUserNickname,
  checkUserId,
  register,
};
