import jwt from '../src/utils/jwt';
// import dotenv from 'dotenv';
import errorGenerator from '../src/utils';
import { userDAO } from '../src/models';
// import jwt from 'jsonwebtoken';

// dotenv.config();

const validateToken = async (req, res, next) => {
  console.log('token좀보자');
  console.log(req.headers.authorization);
  try {
    console.log('tok');
    if (!req.headers.authorization)
      return errorGenerator('인가되지 않은 유저입니다', 403);
    const checkToken = await jwt.verifyToken(req.headers.authorization);
    console.log(checkToken);
    if (!checkToken) return errorGenerator('인증 오류', 403);
    const user = userDAO.checkUserId(checkToken);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// const AUTH_ERROR = { message: 'Authentication Error' };
// const JWT_SECRETKEY = process.env.JWT_SECRETKEY;

// export const isAuth = async (req, res, next) => {
//   console.log('여기도 못왔니');
//   const authHeader = req.headers.authorization;
//   console.log(authHeader);

//   jwt.verify(token, process.env.JWT_SECRETKEY, async (error, decoded) => {
//     if (error) {
//       return res.status(401).json(AUTH_ERROR);
//     }
//     const user = await userDAO.checkUserIdheck(decoded._id);
//     if (!user) {
//       return res.status(401).json(AUTH_ERROR);
//     }
//     req.userEmail = user.email;
//     req.status = user.status;
//     req.token = token;
//     next();
//   });
// };

export { validateToken };
