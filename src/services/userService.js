// import crypto from 'crypto';
import { crypto } from '../utils';
import { userService } from '.';
import { userDAO } from '../models';
// import { errorGenerator } from '../utils';
const { errorGenerator } = require('../utils/');

const checkDuplicateEmail = async (email) => {
  const result = await userDAO.checkUserEmail(email);
  if (result !== null) throw new Error('이미 존재하는 이메일입니다.');
  return result;
};

const checkDuplicateNickname = async (nickname) => {
  const result = await userDAO.checkUserNickname(nickname);
  if (result !== null) throw new Error('이미 존재하는 닉네임입니다.');
  return null;
};

const register = async (reqData) => {
  try {
    console.log(reqData);
    if (reqData.nickname == '') {
      const randomName = await crypto.makeRandomNickname();
      reqData.nickname = randomName;
      console.log('닉네임 생성 완료:', randomName);
    }
    const nicknameResult = await userDAO.checkUserNickname(reqData.nickname);
    if (nicknameResult !== null) throw new Error('이미 존재하는 닉네임입니다.');
    // if (nicknameResult !== null)
    //   errorGenerator({ statusCode: 409, message: '중복!' });
    const emailResult = await userDAO.checkUserEmail(reqData.email);
    if (emailResult !== null) throw new Error('이미 존재하는 이메일입니다.');
    //비밀번호 암호화 필요
    const result = await userDAO.createUser(reqData);
    console.log('결과는 어떨까..ㅎㅎ:', result);
    return result;
  } catch (err) {
    throw err;
  }
};

export default {
  checkDuplicateEmail,
  checkDuplicateNickname,
  register,
};
