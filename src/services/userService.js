import { userDAO } from '../models';
import { s3 } from '../utils/aws';

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

const checkUserId = async (_id) => {
  const result = await userDAO.checkUserId(_id);
  return result;
};

const checkUserSocial = async (kakaoId, platform) => {
  const result = await userDAO.checkUserSocial(kakaoId, platform);
  return result;
};

const changeUserInfoWithImg = async (user, reqData, file) => {
  const result = await userDAO.changeUserInfoWithImg(user, reqData, file);
  const user_profile = result.profileImage;
  console.log(user_profile);
  if (result.profileImage != 'basicProfileImage.png') {
    s3.deleteObject(
      {
        Bucket: 'writingmark',
        Key: `user/${user_profile}`,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log('프로필 이미지 변경 // 이전 프로필 삭제');
      }
    );
  }

  return result;
};

const changeUserInfo = async (user, reqData) => {
  const checkUserImg = await userDAO.checkUserInfo(user._id);
  console.log('이전데이터', checkUserImg);
  // console.log('-------', checkUserImg.profileImage);
  // console.log('데이터에서', reqData.user_profile)

  if (checkUserImg.profileImage == reqData.user_profile) {
    const result = await userDAO.changeNotImage(user, reqData);
    return result;
  }
  const result = await userDAO.changeBasicImage(user, reqData);
  const user_profile = result.profileImage;
  s3.deleteObject(
    {
      Bucket: 'writingmark',
      Key: `user/${user_profile}`,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('기본 이미지로 변경// 이전 프로필 삭제');
    }
  );
  return result;
};

const changeUserPassword = async (user, reqData) => {
  const result = await userDAO.changeUserPassword(user, reqData);
  return result;
};

const register = async (reqData) => {
  const result = await userDAO.createUser(reqData);
  return result;
};

const socialLogin = async (email, randomName, kakaoId, platform) => {
  const result = await userDAO.createSocialUser(
    email,
    randomName,
    kakaoId,
    platform
  );
  return result;
};

const findUserPost = async (user, lastId) => {
  const result = await userDAO.findUserPost(user, lastId);
  return result;
};

const countTotal = async (user, about) => {
  const result = await userDAO.countTotal(user, about);
  return result;
};

const createUserBookmark = async (user_id, postId) => {
  const result = await userDAO.createUserBookmark(user_id, postId);
  return result;
};

const findUserBookmark = async (user, lastId) => {
  const result = await userDAO.findUserBookmark(user, lastId);
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
  checkUserId,
  checkUserSocial,
  changeUserInfoWithImg,
  changeUserInfo,
  changeUserPassword,
  register,
  socialLogin,
  findUserPost,
  countTotal,
  createUserBookmark,
  findUserBookmark,
  removeUserBookmark,
  checkBookmark,
  removeUserInfo,
};
