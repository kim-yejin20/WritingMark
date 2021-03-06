import jwt from '../src/utils/jwt';
import { errorGenerator } from '../src/utils';
import { userDAO } from '../src/models';

export const validateToken = async (req, res, next) => {
  try {
    // if (!req.headers.authorization)
    //   errorGenerator('인가되지 않은 유저입니다', 403);

    //로그인 안한 유저 null처리
    if (!req.headers.authorization) {
      req.user = null;
      next();
    }

    if (req.headers.authorization) {
      const checkToken = await jwt.verifyToken(req.headers.authorization);
      if (!checkToken) errorGenerator('인증 오류', 403);
      const user = await userDAO.checkUserToken(checkToken);
      req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};

// export { validateToken };
