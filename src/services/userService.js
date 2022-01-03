// import crypto from 'crypto';
import { crypto } from '../utils';
import { userService } from '.';
import { userDAO } from '../models';

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

const makeRandomName = async () => {
  // const result = '새로운닉네임';
  const newname = 'hi' + crypto.randomBytes(2).toString('hex');
  // const result = await userDAO.enterUserNickname(nickname);
  console.log('randomname:', newname);
  return newname;
};

const register = async (reqData) => {
  try {
    console.log(reqData);
    if (reqData.nickname == '') {
      console.log('처음:', reqData.nickname);
      console.log('nickname이 빈스트링으로 왔음니다');
      const randomName = await crypto.makeRandomNickname();
      reqData.nickname = randomName;
      console.log('변경후:', reqData.nickname);
      console.log('randomName:', randomName);
    }
    const nicknameResult = await userDAO.checkUserNickname(reqData.nickname);
    if (nicknameResult !== null) throw new Error('이미 존재하는 닉네임입니다.');
    const emailResult = await userDAO.checkUserEmail(reqData.email);
    if (emailResult !== null) throw new Error('이미 존재하는 이메일입니다.');
    //비밀번호 암호화 필요
    const result = await userDAO.createUser(reqData);
    return result;
  } catch (err) {
    const message = err;
    return message;
  }
};

export default {
  checkDuplicateEmail,
  checkDuplicateNickname,
  makeRandomName,
  register,
};
