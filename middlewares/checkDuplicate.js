import { userService } from '../src/services';
import { errorGenerator } from '../src/utils';

export const checkDuplicate = async (req) => {
  try {
    //디비 중복 확인
    console.log('서버 이메일 닉네임 중복 체크');
    const dbUser = await userService.checkUserinfo(req.user);

    if (req.body.email != dbUser.email) {
      const emailResult = await userService.checkUserEmail(req.body.email);
      if (emailResult != null) {
        req.ValidationError = '이메일 중복';
        return req.ValidationError;
        // return req;
      }
    }

    if (req.body.nickname != dbUser.nickname) {
      const nicknameResult = await userService.checkUserNickname(
        req.body.nickname
      );
      if (nicknameResult != null) {
        req.ValidationError = '닉네임 중복';
        return req.ValidationError;
        // return req;
      }
    }
    return null;
  } catch (err) {
    throw err;
  }
};
