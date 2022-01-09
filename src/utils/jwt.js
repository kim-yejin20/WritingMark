import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

// require('dotenv').config();

const JWT_SECRETKEY = process.env.JWT_SECRETKEY;

const signToken = (id) => {
  return jwt.sign({ _id: id.toString() }, JWT_SECRETKEY, {
    expiresIn: '7d',
    issuer: 'writingmark',
  });
};

const issueToken = async (id) => {
  return jwt.sign({ id: id }, JWT_SECRETKEY, { expiresIn: '1h' });
};

const verifyToken = async (token) => {
  return await jwt.verify(token, JWT_SECRETKEY);
};

export default { signToken, issueToken, verifyToken };
