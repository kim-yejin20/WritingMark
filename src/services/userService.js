import { userDAO } from '../models';

const checkDuplicateEmail = async (email) => {
  const result = await userDAO.checkUserEmail(email);
  if (result !== null) throw new Error('이미 존재하는 이메일입니다.');
  return null;
};

export default { checkDuplicateEmail };
