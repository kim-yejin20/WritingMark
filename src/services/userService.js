// import crypto from 'crypto';
import { bcrypt, crypto } from '../utils';
import { userService } from '.';
import { userDAO } from '../models';
import jwt from '../utils/jwt';
import { errorGenerator } from '../utils';

// const { errorGenerator } = require('../utils/');

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

const checkUserAccount = async (reqData) => {
  try {
    const userEmail = await userDAO.checkUserEmail(reqData.email);
    // if (!userEmail) errorGenerator('존재하지 않는 계정입니다', 401);
    console.log(userEmail.password);
    const isValidUser = await bcrypt.comparePassword(
      reqData.password,
      userEmail.password
    );
    if (!userEmail || !isValidUser)
      errorGenerator('이메일 혹은 비밀번호가 다릅니다', 401);
    const token = await jwt.faketoken;
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
