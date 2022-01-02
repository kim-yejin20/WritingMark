import { User } from '../schema';

const nicknameCheck = asyn (req, res, next) {
  const nickname = req.body.nickname;
  if (nickname) {
      // user에서 똑같은 닉네임이 있으면 에러 발생? 
      const user = await User.findOne(nickname);
      if (user) {
          return res.status()
      }

  }
};
