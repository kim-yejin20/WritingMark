import { userService } from '../src/services';
import { errorGenerator } from '../src/utils';

export const checkDuplicate = async (req) => {
  try {
    //디비 중복 확인
    const dbUser = await userService.checkUserinfo(req.user);

    if (req.body.email != dbUser.email) {
      const emailResult = await userService.checkUserEmail(req.body.email);
      if (emailResult != null) {
        req.ValidationError = '이메일 중복';
        return req.ValidationError;
      }
    }

    if (req.body.nickname != dbUser.nickname) {
      const nicknameResult = await userService.checkUserNickname(
        req.body.nickname
      );
      if (nicknameResult != null) {
        req.ValidationError = '닉네임 중복';
        return req.ValidationError;
      }
    }
    return null;
  } catch (err) {
    throw err;
  }
};
