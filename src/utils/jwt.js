import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

require('dotenv').config();

const JWT_SECRETKEY = process.env.JWT_SECRETKEY;
const OPTION = process.env.OPTION;

const signToken = (id) => {
  console.log('토큰생성');
  const faketoken = id + 'this is faketoken';
  //   return jwt.sign({ id: id }, JWT_SECRETKEY, OPTION);
  return faketoken;
};

const issueToken = async (id) => {
  console.log('issueToken에 왔음');
  return jwt.sign({ id: id }, JWT_SECRETKEY, { expiresIn: '1h' });
};

const verifyToken = async (token) => {
  return jwt.verify(token, KEY);
};

export default { signToken, issueToken, verifyToken };
